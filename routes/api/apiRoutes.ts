import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiAuth from '../../auth/apiAuth';
import tunnelUrl from './tunnelUrl';

const app = new Hono();
app.use(cors({ origin: "*" }));
app.use(apiAuth)

app.post('/tunnelUrl', tunnelUrl)

export default app