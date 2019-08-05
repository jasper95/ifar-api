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
    const users = await this.DB.filter('user', { role: 'USER' }, ['id'])
    await this.DB.insert('notification', {
      user_id: session.user_id,
      receivers: users.map(e => e.id),
      risk_id: params.risk_id,
      details: {
        action: 'comment'
      }
    })
    const tagged_users = Object.values(body.entityMap)
      .filter(e => e.type === 'mention')
      .map(e => e.data.mention.id)
    if (tagged_users.length) {
      await this.DB.insert('notification', {
        user_id: session.user_id,
        receivers: tagged_users,
        risk_id: params.risk_id,
        details: {
          action: 'tag'
        }
      })
    }
    return response
  }
}
