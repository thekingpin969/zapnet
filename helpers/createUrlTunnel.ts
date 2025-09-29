import { randomBytes } from "crypto"
import { encryptUserid } from "../utils/encodeDecodeUserid"
import Redis from "../db/redis"

async function createUrlTunnel(url: string, userid: number, additional = {}) {
    try {
        if (!url || !userid) throw Error('invalid request')
        const encodedUserid = encryptUserid(userid)
        const id = encodedUserid + '_' + randomBytes(4).toString('hex') + '' + Date.now().toString(32)
        const tunneledUrl = `http://t.me/prozapnetbot/files?startapp=${id}`

        const payload = {
            url,
            ...additional
        }
        await Redis.setEx('tunnels-' + id, 60 * 60, JSON.stringify(payload))
        return { ...payload, tunneledUrl }
    } catch (error) {
        throw error
    }
}

export default createUrlTunnel