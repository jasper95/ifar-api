import difference from 'lodash/difference'

export default class CommentController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async createComment({ params, session }) {
    const { body } = params
    const response = await this.DB.insert('comment', {
      ...params,
      user_id: session.user_id
    })
    const risk = await this.DB.find('risk', params.risk_id)
    const users = await this.knex('user')
      .select('id')
      .where({ business_unit_id: risk.business_unit_id })
      .whereIn('role', ['USER', 'UNIT_MANAGER'])
      .orWhere({ role: 'ADMIN' })

    const tagged_users = Object.values(body.entityMap)
      .filter(e => e.type === 'mention')
      .map(e => e.data.mention.id)

    await this.DB.insert('notification', {
      user_id: session.user_id,
      receivers: difference(users.map(e => e.id), tagged_users),
      risk_id: params.risk_id,
      business_unit_id: risk.business_unit_id,
      details: {
        action: 'comment'
      }
    })

    if (tagged_users.length) {
      await this.DB.insert('notification', {
        user_id: session.user_id,
        receivers: tagged_users,
        risk_id: params.risk_id,
        business_unit_id: risk.business_unit_id,
        details: {
          action: 'tag'
        }
      })
    }
    return response
  }
}
