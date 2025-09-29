// @ts-nocheck
import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb';

let database: Db;

class Database {

    setDB() {
        const mongoUser = process.env.MONGO_DB_USER
        const mongoPass = process.env.MONGO_DB_PASS
        const mongodb = process.env.MONGO_DB_DB
        return new Promise((resolve, reject) => {
            MongoClient.connect(`mongodb+srv://${mongoUser}:${mongoPass}@cluster0.ywsn7md.mongodb.net/`, { useNewUrlParser: true }, (err, result) => {
                if (err) reject(err)
                var mongoDb = result.db(mongodb)
                database = mongoDb;
                console.log('mongoDB setup complete');
                resolve('mongoDB setup complete')
            })
        })
    }

    async updateLog(body, collectionName, upsert = true) {
        try {
            const { data = {}, id = {} } = body;
            const collection = database.collection(collectionName);
            const result = await collection.updateMany(id, { $set: data }, { upsert: upsert });
            return result;
        } catch (error) {
            console.error('Error updating log:', error);
            throw error;
        }
    }

    async getLogs(query = {}, collectionName, sort = {}, limit = 100, skip = 0) {
        try {
            const collection = database.collection(collectionName);
            const data = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
            return data ? { success: true, data } : { success: false, data: {} };
        } catch (error) {
            console.error('Error getting logs:', error);
            throw error;
        }
    }

    async addLogs(body, collectionName) {
        const data = body ?? {};
        const collection = database.collection(collectionName);
        const res = await collection.insertOne(data);
        return res;
    }

    async clearLogs(id = {}, collectionName, clearAll = false) {
        const res = clearAll ? await database.collection(collectionName).deleteMany(id) : await database.collection(collectionName).deleteOne(id)
        return res;
    }

    async createCollection(collectionName) {
        return await database.createCollection(collectionName);
    }

    async countDocuments(id = {}, collectionName) {
        const collection = database.collection(collectionName);
        const count = await collection.countDocuments(id);
        return count;
    }

    async calculateSum({ match = {}, fieldName, collectionName }) {
        const collection = database.collection(collectionName);
        const sum = await collection.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: `$${fieldName}` } } }
        ]).toArray();

        return sum;
    }

    async aggregate(query: any[] = [], collectionName) {
        const collection = database.collection(collectionName);
        const result = await collection.aggregate(query).toArray();

        return result
    }

    async collection(collectionName: string) {
        return database.collection(collectionName)
    }
}

export default Database