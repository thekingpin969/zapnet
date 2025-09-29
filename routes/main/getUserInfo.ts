import type { Context } from "hono";
import Database from "../../db/mongodb"
import getBalance from "../../helpers/getBalance"

const db = new Database()

async function getUserInfo(c: Context) {
    try {
        const useInfo = c.get('tgUserData')
        const { data: [user] }: { data: any } = await db.getLogs({ userid: useInfo.id }, 'users')
        if (!user) {
            const newUser = {
                userid: useInfo.id,
                tgUsername: useInfo.username,
                createdAt: new Date().getTime(),
                wallet: {
                    available: 0,
                    pending: 0
                },
            }
            await db.addLogs(newUser, 'users')
            return c.json(newUser, 200)
        } else {
            const balance = await getBalance(useInfo.id)
            user.wallet.available += balance
            delete user._id
            return c.json(user, 200)
        }

    } catch (error) {
        console.error(error)
        return c.text('something went wrong!', 500)
    }
}

export default getUserInfo