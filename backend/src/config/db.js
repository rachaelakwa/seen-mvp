import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✓ MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
}

export function disconnectDB() {
  return mongoose.disconnect();
}
