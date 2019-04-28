import {
  generateHash,
  generateSalt,
  formatHTML
} from '../../utils'

export default class UserController {
  constructor({
    DB, knex, Model, serviceLocator
  }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
    this.serviceLocator = serviceLocator
  }

  async getSession({ session }) {
    const { user_id, token } = session
    const [user] = await this.DB.filter('tbl_User', { id: user_id })
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('tbl_Company', user.company_id)
      if (company) {
        user.company = company
      }
    }
    return {
      ...user,
      token
    }
  }

  async signup({ params }) {
    // validate email
    const [user_exists] = await this.Model.base.validateUnique('tbl_User', { email: params.email })
    if (user_exists) {
      throw { success: false, message: 'Email already taken.' }
    }

    if (params.role === 'ADMIN') {
      const [company_exists] = await this.Model.base.validateUnique('tbl_Company', { name: params.company_name })
      if (company_exists) {
        throw { success: false, message: 'Company name already taken' }
      }
      const company = await this.DB.insert('tbl_Company', { ...params, name: params.company_name })
      params.company_id = company.id
    }

    const user = await this.DB.insert('tbl_User', params)
    const salt = generateSalt()
    this.DB.insert('tbl_UserAuth',
      { user_id: user.id, password: generateHash(params.password, salt), salt })
    const sendgrid = this.serviceLocator.get('sendgrid')
    const name = params.role === 'ADMIN' ? params.company_name : params.first_name
    const html = await formatHTML('signup', { confirm_link: `${process.env.PORTAL_LINK}/confirm?user_id=${user.id}`, name })
    await sendgrid.send({
      from: {
        name: 'Internlink',
        email: process.env.EMAIL_FROM
      },
      to: user.email,
      subject: 'Verify Account',
      html
    })

    return {
      success: true
    }
  }

  async login({ params }) {
    const { email, password } = params
    const [user] = await this.DB.filter('tbl_User', { email })
    if (!user) {
      throw { success: false, message: 'Email does not exists' }
    }
    if (!user.verified) {
      throw { success: false, message: 'Please verify email to login' }
    }
    const { id } = user
    const [{ salt, password: hash_password }] = await this.DB.filter('tbl_UserAuth', { user_id: id })
    const hash = generateHash(password, salt)
    if (hash !== hash_password) {
      throw { success: false, message: 'Incorrect Password' }
    }
    const token = await this.Model.auth.authenticateUser(user)
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('tbl_Company', user.company_id)
      if (company) {
        user.company = company
      }
    }
    return {
      ...user,
      token
    }
  }

  async logout({ session }) {
    return this.DB.deleteById('tbl_UserSession', { id: session.id })
  }
}
