import { randomBytes } from "crypto"
import type { Context } from "hono"
import createTransactions from "./createTransaction"
import Database from "../db/mongodb"

const db = new Database()
async function rechargeWithdraw(userid: number, paymentData: any, c: Context) {
    try {
        const { amount, provider, number } = paymentData || {}
        const acceptedProviders = ['jio', 'airtel', 'vi', 'bsnl']

        if (!acceptedProviders.includes(provider)) return c.text('invalid provider!', 400)
        const payload = {
            id: randomBytes(8).toString('hex'),
            method: '',
            paymentData,
            userid,
            createdAt: new Date().getTime(),
            status: 'pending',
            verified: true
        }
        await db.addLogs(payload, 'withdraws')
        await createTransactions(userid, (-1 * paymentData.amount), 'available', 'success', 'withdraw')

        return c.text('ok', 200)
    } catch (error) {
        throw error
    }
}

export default rechargeWithdraw