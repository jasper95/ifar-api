module.exports = {
  tables: [
    {
      table_name: 'user',
      columns: [
        {
          column_name: 'email',
          type: 'string',
          required: true,
          index: true
        },
        {
          column_name: 'slug',
          type: 'string',
          required: true,
          unique: true,
          index: true
        },
        {
          column_name: 'verified',
          type: 'boolean',
          default: false
        },
        {
          column_name: 'resume',
          type: 'string',
          default: ''
        },
        {
          column_name: 'avatar',
          type: 'string',
          default: ''
        },
        {
          column_name: 'first_name',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'contact_number',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'last_name',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'role',
          type: 'string',
          // required: true,
          default: ''
        }
      ]
    },
    {
      table_name: 'user_auth',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'password',
          type: 'string',
          default: '',
          required: true
        },
        {
          column_name: 'salt',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'user_session',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'status',
          type: 'string',
          default: 'Online',
          required: true
        },
        {
          column_name: 'device_type',
          type: 'string',
          default: 'Web',
          required: true
        }
      ]
    },
    {
      table_name: 'notification',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'body',
          type: 'jsonb',
          default: '{}'
        },
        {
          column_name: 'status',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'risk',
      columns: [
        {
          name: 'name',
          type: 'string',
          required: true
        },
        {
          name: 'definition',
          type: 'string',
          required: true
        },
        {
          name: 'business_unit',
          type: 'string',
          required: true
        },
        {
          name: 'classification',
          type: 'string',
          required: true
        },
        {
          name: 'residual_change_direction',
          type: 'string',
          default: 'initial'
        },
        {
          name: 'type',
          type: 'string',
          required: true
        },
        {
          name: 'frequency',
          type: 'string',
          required: true
        },
        {
          name: 'inherent_value',
          type: 'integer',
          required: true
        },
        {
          name: 'residual_value',
          type: 'integer'
        },
        {
          name: 'target_value',
          type: 'integer'
        },
        {
          name: 'causes',
          type: 'jsonb',
          default: '[]'
        },
        {
          name: 'current_treatment',
          type: 'jsonb',
          default: '[]'
        },
        {
          name: 'future_treatment',
          type: 'jsonb',
          default: '[]'
        }
      ]
    }
  ]
}
