import { MongoClient } from "mongodb";

if (!process.env.DB_URL) {
    throw new Error("DB_URL is undefined");
}

const uri: string = process.env.DB_URL;
export const mongoClient = new MongoClient(uri);

export const mongodb = mongoClient.db(process.env.DB_NAME || 'queue');
