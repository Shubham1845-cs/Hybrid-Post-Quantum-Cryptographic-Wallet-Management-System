import mongoose  from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const mongodb_url = process.env.MONGODB_URI || '';
if(!mongodb_url)
{
  throw new Error('Mongodb_uri is missing from the enviroment variable ');
  // It provides a full stack trace, showing exactly which file and line caused the failure.
}
const connectDB=async()=>{
  try {
      const conn=await mongoose.connect(mongodb_url);
      console.log(`mongodb  is conected ${conn.connection.host}`);

  } catch (error) {
    console.log(`Error:${error instanceof Error?error.message:error}`);
    //retry logic
    console.log("retrying the connection in 5 seconds");
    setTimeout(connectDB,5000);
  }
}
export default connectDB;