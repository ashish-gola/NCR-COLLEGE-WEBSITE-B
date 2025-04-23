import mongoose from "mongoose";


const connectDB = async () => {
  // console.log(process.env.MONGO_URI);
  
  try {
    await mongoose.connect(
      `${process.env.MONGO_URI }`
    );
    // console.log(`MongoDB Connected !! DB host: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log("Error: " + error);
    process.exit(1);
  }
};

export default connectDB;
