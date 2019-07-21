import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

class AuthModel {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async authenticateUser(user) {
    const session = await this.DB.insert('user_session', { user_id: user.id, status: 'Online', device_type: 'Web' })
    return this.generateToken({
      payload: {
        ...session,
        hasura_claims: {
          'x-hasura-allowed-roles': ['admin'],
          'x-hasura-default-role': 'admin',
          'x-hasura-user-id': user.id,
          'x-hasura-session-id': session.id
        }
      },
      insert_db: false
    })
  }

  async getUserData(user) {
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('company', user.company_id)
      if (company) {
        user.company = company
      }
    }
    const { id } = user
    user.unread_notifications = await this.knex('notification')
      .where({ user_id: id, status: 'unread' })
      .count()
      .first()
      .then(e => e.count)
    return user
  }

  async generateToken(params) {
    const {
      payload, insert_db = true, type, has_expiry = true
    } = params
    if (insert_db) {
      const result = await this.DB.insert('token', {
        type,
        expiry: has_expiry ? dayjs().add(process.env.TOKEN_EXPIRY_DAYS, 'day').toISOString() : null
      })
      payload.id = result.id
    }
    const token = jwt.sign(
      payload,
      process.env.AUTH_SECRET,
      has_expiry ? { expiresIn: `${process.env.TOKEN_EXPIRY_DAYS}d` } : {}
    )
    return token
  }
}

export default AuthModel
