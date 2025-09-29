import type { Context } from "hono";
import createTransactions from "../../helpers/createTransaction";
import verifyAid from "../../helpers/verifyAid";
import Redis from "../../db/redis";

async function adReward(c: Context) {
    try {
        const { id: userid, username } = c.get('tgUserData')
        const { aid } = await c.req.json()
        if (!aid) return c.text('invalid request', 400)
        const crnt_time = new Date().getTime()
        const last_ad_watched = +(await Redis.get(`last_ad_watch:${userid}`) || 0)
        if ((crnt_time - last_ad_watched) < 1000 * 20) return c.text('to many requests', 401)

        const { verified: aid_verified, data: ad_data } = await verifyAid(aid, +userid)
        if (!aid_verified) return c.text('invalid aid', 400)

        await Promise.all([
            createTransactions(userid, 1, 'available', 'success', 'ad reward', { username }),
            Redis.setEx(`last_ad_watch:${userid}`, 60, crnt_time.toString())
        ])
        return c.text('ok', 200)
    } catch (error) {
        return c.text('something went wrong!', 500)
    }
}

export default adReward