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
      table_name: 'classification',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'business_unit',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          required: true
        },
        {
          column_name: 'order',
          type: 'integer',
          required: true
        }
      ]
    },
    {
      table_name: 'risk',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          required: true
        },
        {
          column_name: 'definition',
          type: 'string',
          required: true
        },
        {
          column_name: 'business_unit_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'business_unit',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'classification_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'classification',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'residual_change_direction',
          type: 'string',
          default: 'initial'
        },
        {
          column_name: 'impact',
          type: 'jsonb',
          required: true
        },
        {
          column_name: 'likelihood',
          type: 'jsonb',
          required: true
        },
        {
          column_name: 'inherent_rating',
          type: 'integer',
          required: true
        },
        {
          column_name: 'residual_rating',
          type: 'integer'
        },
        {
          column_name: 'target_rating',
          type: 'integer'
        },
        {
          column_name: 'causes',
          type: 'jsonb',
          default: '[]'
        },
        {
          column_name: 'stakeholders',
          type: 'jsonb',
          default: '[]'
        },
        {
          column_name: 'impacts',
          type: 'jsonb',
          default: '[]'
        },
        {
          column_name: 'current_treatments',
          type: 'jsonb',
          default: '[]'
        },
        {
          column_name: 'future_treatments',
          type: 'jsonb',
          default: '[]'
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
      table_name: 'token',
      columns: [
        {
          column_name: 'value',
          type: 'string',
          index: true,
          required: true
        },
        {
          column_name: 'type',
          type: 'string',
          required: true
        },
        {
          column_name: 'expiry',
          type: 'timestamp',
          type_params: [{ useTz: true }]
        },
        {
          column_name: 'used',
          type: 'boolean',
          default: false
        }
      ]
    }
  ]
}
