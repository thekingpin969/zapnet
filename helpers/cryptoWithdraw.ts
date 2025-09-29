import type { Context } from "hono";
import isAddressValid from "../utils/isAddressValid";
import isAddressActive from "../utils/isAddressActive";
import { randomBytes } from "crypto";
import createTransactions from "./createTransaction";
import Database from "../db/mongodb";
import Redis from "../db/redis";

const db = new Database()

async function cryptoWithdraw(userid: number, paymentData: any = {}, c: Context) {
    try {
        const { amount, address } = paymentData || {}
        if (!amount || !address || typeof amount != 'number' || typeof address != 'string' || amount <= 0) return c.text('invalid request', 400)

        const addressValid = isAddressValid(address)
        if (!addressValid) return c.text('address invalid!', 400)

        const addressActive = await isAddressActive(address)
        if (!addressActive) return c.text('address address is not active!', 400)

        const requestData = {
            userid,
            address,
            amount,
            status: 'pending',
            createdAt: new Date().getTime(),
        }

        const payload = {
            id: randomBytes(8).toString('hex'),
            method: 'crypto',
            paymentData,
            userid,
            createdAt: new Date().getTime(),
            status: 'pending',
            verified: true
        }

        await Promise.all([
            Redis.rPush('crypto_withdraw_requests', JSON.stringify(requestData)),
            createTransactions(userid, (-1 * paymentData.amount), 'available', 'success', 'withdraw'),
            db.addLogs(payload, 'withdraws')
        ])

        return c.text('ok', 200)
    } catch (error) {
        throw error
    }
}

export default cryptoWithdraw;