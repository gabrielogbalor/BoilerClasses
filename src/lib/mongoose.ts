import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      dbName: 'boilerclasses',
    });
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function disconnectFromDatabase() {
  return mongoose.disconnect();
}
