import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!dbUri || dbUri.includes('localhost') || dbUri.includes('127.0.0.1')) {
      console.log('CRITICAL: App is trying to connect to a LOCAL database instead of Atlas!');
      console.log('URI used:', dbUri ? dbUri.substring(0, 15) + '...' : 'UNDEFINED');
    } else {
      console.log('Connecting to Atlas Database...');
    }

    const conn = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
