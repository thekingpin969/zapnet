import type { Context } from "hono";
import TgBot from "../../bot/bot";

async function botWebhookHandler(c: Context) {
    try {
        const body = await c.req.json();
        await TgBot.handleUpdate(body);
        return c.text('ok', 200);
    } catch (error) {
        console.log(error)
        return c.text('error', 500)
    }
}

export default botWebhookHandler