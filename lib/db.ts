import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/nextjs";

if (!MONGO_URI) {
    throw new Error('Mongo URI not found');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;