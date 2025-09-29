import { Hono } from 'hono';
import { cors } from 'hono/cors';
import openTunnel from './openTunnel';
import TelegramAuth from '../../auth/telegramAuth';
import adPostBack from './adPostBack'
import getUserInfo from './getUserInfo';
import withdraw from './withdraw';
import adReward from './adReward';
import getWithdrawRequests from './getWithdrawRequests';

const app = new Hono();
app.use(cors({ origin: "*" }));
app.use(TelegramAuth());

app.get('/', (c) => c.text('ok'));
app.get('/adPostBack', adPostBack);
app.get('/getUserInfo', getUserInfo)
app.get('/getWithdrawRequests', getWithdrawRequests)

app.post('/openTunnel', openTunnel)
app.post('/withdraw', withdraw)
app.post('/adReward', adReward)

export default app