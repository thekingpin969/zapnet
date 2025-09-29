import { createClient } from '@clickhouse/client'

const { CLICKHOUSE_URL, CLICKHOUSE_USERNAME, CLICKHOUSE_PASSWORD } = process.env
const CHClient = createClient({
    url: CLICKHOUSE_URL,
    username: CLICKHOUSE_USERNAME,
    password: CLICKHOUSE_PASSWORD,
})

await CHClient.ping().then(() => console.log('clickhouse connected')).catch(console.log)

export default CHClient