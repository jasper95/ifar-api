export default [
  {
    name: 'risk_dashboard',
    query: `
      select
        r.*,
        EXISTS(select * from request where risk_id = r.id and type = 'treatment_request') as has_treatment_request
          from risk r
            left join classification c
              on r.classification_id = c.id
    `
  }
]
