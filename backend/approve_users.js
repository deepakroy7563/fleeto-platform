import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const approveUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const result = await User.updateMany(
      { role: { $in: ['admin', 'customer'] } },
      { $set: { isApproved: true } }
    );

    console.log(`${result.modifiedCount} users approved.`);
    
    // Specifically ensure chandan2@gmail.com is approved and is an admin if they want to test admin panel
    const user = await User.findOne({ email: 'chandan2@gmail.com' });
    if (user) {
      user.isApproved = true;
      user.role = 'admin'; 
      await user.save();
      console.log('User chandan2@gmail.com specifically approved and set as Admin.');
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

approveUsers();
