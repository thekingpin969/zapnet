import { Telegraf } from 'telegraf'
import start from './commands/start'
import apiToken from './commands/apiToken';

const TgBot = new Telegraf(process.env.BOT_TOKEN as string)

TgBot.start((ctx) => start(ctx))

TgBot.command('token', apiToken)

TgBot.launch()
console.log('bot running')


export default TgBot