import type { Context } from "hono"
import verifyAid from "../../helpers/verifyAid";
import Redis from "../../db/redis";
import rewardUser from "../../helpers/rewardUser";

async function openTunnel(c: Context) {
    try {
        const { id, aid } = await c.req.json()
        if (!id || !aid) return c.text('invalid request', 400)
        const { id: userid } = c.get('tgUserData')

        const { verified: aidVerified } = await verifyAid(aid, +userid)
        if (!aidVerified) return c.text('invalid request', 401)

        const data = JSON.parse(await Redis.get('tunnels-' + id) || '') || false
        if (!data || typeof data != 'object') return c.text('invalid tunnel id', 404)

        const { amount } = await rewardUser(+userid)

        let payload: any = { ...data, reward: amount }

        return c.json({ ...payload })
    } catch (error) {
        console.log(error)
        return c.text('something went wrong!', 500)
    }
}

export default openTunnel