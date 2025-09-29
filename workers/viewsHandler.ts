import { config } from 'dotenv'
config({ path: '../.env' })

import Redis from '../db/redis';
import CHClient from '../db/clickhouse';

async function processClicks() {
    console.log('worker running...')
    while (true) {
        const batch = await Redis.lRange("clicks", 0, 999) || [];
        if (batch?.length === 0) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
        }
        const parsed = batch.map(item => JSON.parse(item));
        const filtered = Array.from(
            new Map(parsed.map(item => [item.ymid, item])).values()
        );

        try {
            await CHClient.insert({
                table: "visits",
                values: filtered,
                format: "JSONEachRow"
            });
            await Redis.lTrim("clicks", batch.length, -1);
        } catch (err) {
            console.error("Insert failed:", err);
        }
    }
}

processClicks();