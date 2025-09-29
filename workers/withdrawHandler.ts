import Database from "../db/mongodb";
import Redis from "../db/redis"
import { config } from 'dotenv'
import CHClient from '../db/clickhouse'
import { error } from "console";
import createTransactions from "../helpers/createTransaction";

config({ path: '../.env' })
const db = new Database()

await db.setDB()
console.log('withdraw handler started...')
while (true) {
    try {
        const result = await Redis.blPop('withdraw_requests', 30);
        if (!result) continue;

        const { element } = result
        const { userid, address, amount } = JSON.parse(element) || {}



        // proceed transfer

        await createTransactions(userid, (-1 * Math.abs(amount)), 'available', 'success', 'withdraw', {})
        await db.updateLog({ id: { userid }, data: { status: 'completed', completedAt: new Date().getTime() } }, 'withdraws', false)
    } catch (err) {
        console.error('Error processing request:', err);
    }
}
