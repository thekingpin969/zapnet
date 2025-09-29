import type { Context } from "hono";
import Redis from "../../db/redis";
import verifyAdPostBackScrt from "../../helpers/verifyAdPostBackScrt.ts";
import { decryptUserid } from "../../utils/encodeDecodeUserid.ts";

const PER_CLICK_AMOUNT = +(process.env.PER_CLICK_AMOUNT || 0)

async function adPostBack(c: Context) {
    try {
        const {
            telegram_id: [telegram_id] = [],
            event_type: [event_type] = [],
            reward_event_type: [reward_event_type] = [],
            estimated_price: [estimated_price] = [],
            request_var: [request_var] = [],
            ymid: [ymid] = [],
            scrt: [scrt] = []
        } = c.req.queries() || {}
        // console.log(c.req.queries())
        const scrtMatched = verifyAdPostBackScrt(scrt || '')
        if (!scrtMatched) return c.text('not acceptable', 401)
        if (event_type != 'impression' || reward_event_type != 'valued') return c.text('not acceptable', 201)

        const click = {
            short_id: request_var == 'watch_and_earn' ? ymid : ymid?.split('_')[1],
            author: request_var == 'watch_and_earn' ? null : decryptUserid(ymid?.split('_')[0] || ''),
            timestamp: new Date().getTime(),
            telegramid: telegram_id,
            ymid,
            type: reward_event_type,
            amount: +(estimated_price || 0),
            earned: PER_CLICK_AMOUNT,
            evt_type: event_type,
            method: request_var
        };
        const data = {
            telegram_id, event_type, reward_event_type, estimated_price, ymid
        }

        const key = `${ymid}.${telegram_id}`
        await Promise.all([
            Redis.rPush("clicks", JSON.stringify(click)),
            Redis.setEx(key, 60 * 10, JSON.stringify(data))
        ]);
        return c.text('ok', 200)
    } catch (error) {
        console.log(error)
        return c.status(500)
    }
}

export default adPostBack