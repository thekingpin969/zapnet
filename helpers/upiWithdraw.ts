import type { Context } from "hono";

async function upiWithdraw(userid: number, paymentData: any = {}, c: Context) {
    try {
        const { amount, upiId } = paymentData || {}
        const MINIMUM_AMOUNT_TO_WITHDRAW = 100 * 1000

        return c.text('upi withdraw is currently on hold', 400)
    } catch (error) {
        throw error
    }
}

export default upiWithdraw