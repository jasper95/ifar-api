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
    const { risk_id, type } = request
    if (type === 'DELETE_RISK') {
      await this.DB.deleteById('request', params)
      await this.DB.deleteById('risk', { id: risk_id })
    } else if (type === 'DONE_TREATMENT_RISK') {
      const risk = await this.DB.find('risk', risk_id)
      const { current_treatments, future_treatments } = risk
      const { id: treatment_id } = request.treatment_details
      const new_treatment = future_treatments.find(e => e.id === treatment_id)
      await this.DB.updateById('risk',
        {
          id: risk.id,
          current_treatments: [
            ...current_treatments,
            new_treatment && { ...new_treatment, rerate: true }
          ].filter(Boolean),
          future_treatments: future_treatments.filter(e => e.id !== treatment_id)
        })
      await this.DB.deleteById('request', params)
    }
    return { success: true }
  }
}
