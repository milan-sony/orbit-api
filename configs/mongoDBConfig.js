import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n🔗 Connected to MongoDB at ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
    }
}