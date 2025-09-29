import { Hono } from 'hono'
import mainRoutes from './main/mainRoutes'
import apiRoutes from './api/apiRoutes.ts'

const routes = new Hono()

routes.route('/api', apiRoutes)
routes.route('/', mainRoutes)

export default routes