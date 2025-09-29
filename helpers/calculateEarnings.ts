import CHClient from "../db/clickhouse";
import Database from "../db/mongodb"
import Redis from "../db/redis";

const db = new Database()

const PER_CLICK_AMOUNT = process.env.PER_CLICK_AMOUNT || 0

async function calculateEarnings(userid: number) {
    try {
        const { data = [] }: any = await db.getLogs({ 'userInfo.chatId': userid }, 'tunnels');
        const ids = data.map((i: any) => i.id).filter(Boolean);
        const shortIds = ids.map((s: any) => `'${String(s).trim()}'`).join(",");

        if (shortIds.length <= 0) return 0

        const redisKey = `lastEarningsUpdated_${userid}`
        const lastUpdated = await Redis.get(redisKey) || false

        let query;
        if (lastUpdated && Number(lastUpdated)) {
            query = `SELECT short_id, COUNT(*) AS clicks,  MAX(timestamp) AS last_click_captured
FROM visits
WHERE author = ${userid}
  AND timestamp > ${+lastUpdated}
GROUP BY short_id;`
        } else {
            query = `SELECT short_id, COUNT(*) AS clicks,  MAX(timestamp) AS last_click_captured
FROM visits
WHERE author = ${userid}
GROUP BY short_id;`
        }

        const result: any = await CHClient.query({ query }).then(r => r.json());
        const perLinkEarnings = result.data.map((row: any) => ({
            short_id: row.short_id,
            clicks: Number(row.clicks),
            earnings: Number(row.clicks) * +PER_CLICK_AMOUNT
        }));
        const totalEarnings = perLinkEarnings.reduce((sum: any, r: any) => sum + r.earnings, 0).toFixed(5);
        const lastClicksCaptured = result.data.map((item: any) => +item.last_click_captured)
        const lastClicked = Math.max(lastClicksCaptured.length <= 0 ? [lastUpdated] : lastClicksCaptured)
        await Redis.set(redisKey, lastClicked)
        return +totalEarnings;
    } catch (error) {
        throw error
    }
}

export default calculateEarnings