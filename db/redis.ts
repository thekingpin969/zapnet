import { createClient } from "redis"

const Redis = createClient({
    url: process.env.REDIS_URL
});

Redis.on('error', err => {
    console.error('Redis Client Error:', err);
});
Redis.on('connect', () => {
    console.log('Redis client connected');
});
Redis.on('reconnecting', () => {
    console.warn('Redis client reconnecting...');
});

try {
    if (!Redis.isOpen) {
        await Redis.connect();
    }
} catch (err) {
    console.error('Failed to connect to Redis:', err);
}

export default Redis;