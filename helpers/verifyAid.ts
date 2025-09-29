import Redis from "../db/redis"

async function verifyAid(id: string, userid: number) {
    try {
        const key = `${id}.${userid}`
        // console.log(key)
        const data = JSON.parse(await Redis.get(key) || '') || false
        await Redis.del(key)
        if (!data || data.event_type != 'impression' || data.reward_event_type != 'valued') return { verified: false, data: null }
        else return { verified: true, data }
    } catch (error) {
        return { verified: false, data: null }
    }
}

export default verifyAid