import { Context } from "telegraf"

async function start(ctx: Context, msg: any = null) {
    try {
        ctx.replyWithHTML(msg || 'Hi, Welcome! ',)
    } catch (error) {
        console.error(error)
    }
}

export default start