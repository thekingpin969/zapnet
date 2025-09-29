import type { Context } from "hono";
import Database from "../../db/mongodb";
import giftCardWithdraw from "../../helpers/giftCardWithdraw";
import upiWithdraw from "../../helpers/upiWithdraw";
import cryptoWithdraw from "../../helpers/cryptoWithdraw";
import rechargeWithdraw from "../../helpers/rechargeWithdraw";

const db = new Database()

type methods = 'upi' | 'gift_cards' | 'mobile_recharge' | 'crypto' | null

async function withdraw(c: Context) {
    try {
        const { method = null, paymentData = {} }: { method: methods, paymentData: any } = await c.req.json()
        const { id: userid } = c.get('tgUserData')

        if (!method || !paymentData) return c.text('invalid request!', 400)

        const validMethods = ['gift_cards', 'upi', 'crypto', 'mobile_recharge'];
        if (!method || method == null || !validMethods.includes(method)) return c.text('invalid withdraw method', 404);

        if (typeof paymentData.amount != 'number' || paymentData.amount <= 0) return c.text('invalid amount')

        const { data: [user] }: any = await db.getLogs({ userid }, 'users') || {}

        const { wallet: { available } } = user || {}
        if (!available || available < paymentData.amount) return c.text('insufficient balance!', 400)

        switch (method) {
            case 'gift_cards':
                return await giftCardWithdraw(userid, paymentData, c)
            case 'upi':
                return await upiWithdraw(userid, paymentData, c)
            case 'crypto':
                return await cryptoWithdraw(userid, paymentData, c)
            case 'mobile_recharge':
                return await rechargeWithdraw(userid, paymentData, c)
            default:
                return c.text('invalid method!', 400)
        }

    } catch (error) {
        return c.text('something went wrong!', 500)
    }
}

export default withdraw;