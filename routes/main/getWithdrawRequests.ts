import type { Context } from "hono";
import Database from "../../db/mongodb";

const db = new Database()

async function getWithdrawRequests(c: Context) {
    try {
        const { id: userid } = c.get('tgUserData')

        var requests: any
        var { data: requests }: any = await db.getLogs({ userid }, 'withdraws', { createdAt: -1 })

        return c.json(requests, 200)
    } catch (error) {
        return c.text('something went wrong!', 500)
    }
}

export default getWithdrawRequests