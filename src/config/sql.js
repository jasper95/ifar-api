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
  },
  {
    name: 'business_unit_srmp',
    query: `
        SELECT b.*, count(r.business_unit_id) as risk_count
        from business_unit b
        left join (select * from risk rr where rr."type" = 'srmp') r
          on (r.business_unit_id = b.id)
        group by
          b.id
    `
  },
  {
    name: 'business_unit_ormp',
    query: `
        SELECT b.*, count(r.business_unit_id) as risk_count
        from business_unit b
        left join (select * from risk rr where rr."type" = 'ormp') r
          on (r.business_unit_id = b.id)
        group by
          b.id
    `
  },
  {
    name: 'business_unit_prmp',
    query: `
        SELECT b.*, count(r.business_unit_id) as risk_count
        from business_unit b
        left join (select * from risk rr where rr."type" = 'prmp') r
          on (r.business_unit_id = b.id)
        group by
          b.id
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
