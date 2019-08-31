export const views = [
  {
    name: 'risk_dashboard',
    query: `
      select r.*, EXISTS(select * from request where risk_id = r.id and type = 'DONE_TREATMENT_RISK') as has_treatment_request, c.name as classification_name
      from risk r
      left join classification c
        on r.classification_id = c.id
    `
  },
  {
    name: 'user_dashboard',
    query: `
      select "user".*, concat_ws(' ', "user".first_name, "user".last_name) as full_name
      from "user"
    `
  }
]
export const functions = [
  {
    param_signature: 'search_users(search text)',
    return_signature: 'setof "user"',
    query: `
      select "user".*
      from "user"
      where "first_name" ilike ('%' || search || '%') OR "last_name" ilike ('%' || search || '%')
    `
  }
]
