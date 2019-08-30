import views from 'config/views'
import {
  serviceLocator
} from 'utils'
import util from 'util'

export default function initializeViews(self) {
  const knex = serviceLocator.get('knex')
  return Promise
    .mapSeries(views, (view) => {
      self.log('info', 'Initialize View  [Query: %s]', util.inspect(view))
      const query = `create or replace view ${view.name} as ${view.query}`
      return knex.raw(query)
    })
    .then(() => self.log('info', 'Views successfully initialized'))
    .catch(err => self.log('error', 'Error initializing views [Error: %s]', util.inspect(err)))
}
