import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/test`)
    console.log('MongoDB Connected!!',connectionInstance.connection.host);
  } catch (err) {
    console.log('Database failed to connect.')
    process.exit(1)
  }
}

export default connectDB;
