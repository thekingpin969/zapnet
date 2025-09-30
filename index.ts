import { config } from 'dotenv'
config({ path: './.env' })

import { serve } from "bun"
import Database from './db/mongodb'
import routes from './routes/routes'
const db = new Database()

await import('./db/redis')
await import('./db/clickhouse')
await db.setDB()
await import('./bot/bot')

serve({
    fetch: routes.fetch,
    port: 3000,
    idleTimeout: 30,
})

console.log('server running on port 3000')