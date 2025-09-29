import Redis from "../db/redis"
import calculateEarnings from "./calculateEarnings"
import createTransactions from "./createTransaction"

async function getBalance(userid: number) {
    try {
        const redisKey = `balance_${userid}`
        const cachedBalance = await Redis.get(redisKey)
        if (cachedBalance) {
            return 0
        } else {
            const bal = await calculateEarnings(userid)
            await Promise.all([
                Redis.setEx(redisKey, 60 * 10, bal.toString()),
                createTransactions(userid, +bal, 'available', 'success', 'views_reward', {})
            ])
            return +bal
        }
    } catch (error) {
        throw error
    }
}

export default getBalance;