import type { Context } from 'hono';
import jwt from 'jsonwebtoken'

const srt = process.env.JWT_API_SRT as string

async function apiAuth(c: Context, next: any) {
    try {
        const token = c.req.header('authorization')?.split('Bearer ')[1] || ''
        try {
            const payload = jwt.verify(token, srt);
            c.set('user', payload);
            return await next();
        } catch (e) {
            return c.text('Invalid or expired token', 403);
        }
    } catch (error) {
        c.status(500)
    }
}

export default apiAuth