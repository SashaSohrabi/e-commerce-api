import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

try {
  const connection = await mongoose.connect(MONGO_URI, {
    dbName: 'ecommerce',
  });
  console.log('✔️  connected to MongoDB');
  console.log(`Using db: ${connection.connection.name}`);
} catch (error) {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
}
