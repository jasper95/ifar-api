import omit from 'lodash/omit'
import pick from 'lodash/pick'

export default class RequestController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async acceptRequest({ params }) {
    const { id } = params
    const request = await this.DB.find('request', id)
    if (!request) { throw { success: false, message: 'Request does not exists' } }
    const { risk_id, type, risk_details } = request
    await this.DB.deleteById('request', params)
    if (type === 'DELETE_RISK') {
      await this.DB.deleteById('risk', { id: risk_id })
    } else if (type === 'DONE_TREATMENT_RISK') {
      const risk = await this.DB.find('risk', risk_id)
      const { current_treatments } = risk
      const { id: treatment_id } = request.treatment_details
      await this.DB.updateById('risk',
        {
          id: risk.id,
          current_treatments: current_treatments.map((e) => {
            if (e.id === treatment_id) {
              return {
                ...omit('for_approval'),
                rerate: true
              }
            }
            return e
          })
        })
      await this.DB.deleteById('request', params)
    } else if (type === 'EDIT_INHERENT_RISK') {
      const risk = await this.DB.find('risk', risk_id)
      const new_data = omit(risk_details,
        'future_treatments', 'current_treatments', 'target_impact_driver',
        'target_rating', 'target_likelihood', 'residual_impact_driver', 'residual_rating', 'residual_likelihood')
      const overrides = ['recent_changes', 'impact_details', 'previous_details']
        .reduce((acc, key) => {
          acc[key] = {
            ...risk[key],
            ...pick(new_data[key], 'inherent')
          }
          return acc
        }, {})
      await this.DB.updateById('risk', { ...new_data, ...overrides })
    }
    return { success: true }
  }

  async createRequest({ params, user }) {
    params.user_id = user.id
    if (params.type === 'DONE_TREATMENT_RISK') {
      const { treatment_details } = params
      const risk = await this.DB.find('risk', params.risk_id)
      const { current_treatments, future_treatments } = risk
      const { id: treatment_id } = treatment_details
      const new_treatment = future_treatments.find(e => e.id === treatment_id)
      await this.DB.updateById('risk',
        {
          id: risk.id,
          current_treatments: [
            ...current_treatments,
            new_treatment && { ...new_treatment, for_approval: true }
          ].filter(Boolean),
          future_treatments: future_treatments.filter(e => e.id !== treatment_id)
        })
    }
    return this.DB.insert('request', params)
  }
}
