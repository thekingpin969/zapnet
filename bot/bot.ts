import { Telegraf } from 'telegraf'
import start from './commands/start'
import apiToken from './commands/apiToken';

const TgBot = new Telegraf(process.env.BOT_TOKEN as string)

TgBot.start((ctx) => start(ctx))

TgBot.command('token', apiToken)

if (process.env.NODE_ENV == 'production') {
    const url = 'https://zapnet.onrender.com' + '/webhook'
    TgBot.telegram.setWebhook(url, { secret_token: 'authorized_request_from_prozapnetbot' })
    console.log('bot running throw webhook')
} else {
    TgBot.launch()
    console.log('bot running')
}
export default TgBot