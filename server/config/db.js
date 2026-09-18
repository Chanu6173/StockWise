const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at URI: ${process.env.MONGODB_URI}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds to fallback quickly
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Standard DB connection failed: ${error.message}`);
    console.log('Attempting in-memory MongoDB server fallback for local demo...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      console.log(`Connecting to in-memory MongoDB at: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`Fallback in-memory MongoDB Connected: ${conn.connection.host}`);
      console.log('--- DEMO MODE ACTIVE: Database is in-memory and will clear when server restarts. ---');
    } catch (fallbackError) {
      console.error(`Fallback in-memory DB start failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
