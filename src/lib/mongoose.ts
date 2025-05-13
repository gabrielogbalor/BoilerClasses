import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const connection = await mongoose.connect(uri, {
      dbName: 'boilerclasses',
    });
    
    // Only drop indexes if the connection is established
    if (connection.connection.db) {
      await connection.connection.db.collection('courses').dropIndexes();
    }
    
    console.log('Connected to MongoDB successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function disconnectFromDatabase() {
  return mongoose.disconnect();
}
