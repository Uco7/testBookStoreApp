import mongoose from "mongoose";
export const dbconection= async()=>{
  // console.log("db env value:",process.env.MONGODB_URI)
  const isconnected=  await mongoose.connect(process.env.MONGODB_URI)
  if(!isconnected) return console.log("connection failed")
    console.log("db connected")
    
}