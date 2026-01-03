import mongoose from "mongoose";
export const dbconection= async()=>{
  const isconnected=  await mongoose.connect(process.env.MONGODB_URI)
  if(!isconnected) return console.log("connection failed")
    console.log("db connected")
    
}