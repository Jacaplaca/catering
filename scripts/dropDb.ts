import { env } from '@root/app/env';
import { MongoClient } from 'mongodb';

async function dropDb() {
    const client = new MongoClient(env.DATABASE_URL ?? "", {});

    try {
        await client.connect();
        const db = client.db();
        await db.dropDatabase();
        console.log("Database dropped!");
    } finally {
        await client.close();
    }
}

export default dropDb;