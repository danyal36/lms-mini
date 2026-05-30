import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set — skipping DB connection');
    return;
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export function dbStatus(): 'connected' | 'disconnected' {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
}
