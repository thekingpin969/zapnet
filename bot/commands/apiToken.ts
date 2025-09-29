import type { Context } from "telegraf";
import Database from "../../db/mongodb";
import jwt from 'jsonwebtoken'
const db = new Database()

const srt = process.env.JWT_API_SRT as string

async function apiToken(ctx: Context) {
    try {
        const userid = ctx.chat?.id || null
        if (!userid) ctx.reply('forbidden!')
        const { data: [userExist] }: any = await db.getLogs({ userid: userid }, 'users')
        if (!userExist) return await ctx.reply('you should register on the app by opening it')
        const { data: [data] }: any = await db.getLogs({ userid }, 'apiTokens', {}, 1)

        let token;
        if (data) token = data.token
        else {
            const payload = {
                userid,
                userName: ctx.from?.username || ctx.from?.first_name || 'Unknown'
            }
            token = jwt.sign(payload, srt)
            await db.addLogs({ userid, token, created: new Date().getTime() }, 'apiTokens')
        }

        ctx.replyWithHTML(`<b>your token for api request is here:</b>\n<code>${token}</code>\n\n<i>keep it secret and do not share with anyone</i>`)
    } catch (error) {
        console.log(error)
        ctx.reply('try again')
    }
}

export default apiToken