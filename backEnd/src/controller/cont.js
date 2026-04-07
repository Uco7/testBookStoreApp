import User from "../models/user.js";
import sendMail from "../middleWare/sendMail.js";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import user from "../models/user.js";
const normalizeEmail=(email)=>email?.toLowerCase().trim()
const sanitizer=(inputData)=>inputData?.replace(/[<>\/\\$;]/g,"").trim()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;
const globalNameRegex = /^[\p{L}\s'-]{2,50}$/u;
// This removes EVERYTHING except letters and spaces
const sanitizedName = (str) => str?.replace(/[^a-zA-Z\s]/g, "").trim();

export const requestUserOtp= async(req,res)=>{
    try {
        const {userName,fullName,email,password}=req.body
        console.log("req body",req.body)
        if(!userName||!fullName||!email||!password){
            return res.status(400).json({
                message:"all field are requiured"
            })
        }
        const cleanEmail=normalizeEmail(email);
        const  cleanInput=sanitizer(userName)
        const cleanFullName=sanitizedName(fullName)
        if(!EMAIL_REGEX.test(cleanEmail)){
            return res.status(400).json({
                message:"invalid email format"
            })
        }
        if(!USERNAME_REGEX.test(cleanInput)){
            return res.status(400).json({
                message:"invalid userName format"
            })
        }
        if(!PASSWORD_REGEX.test(password)){
            return res.status(400).json({
                message:"password too weak"
            })
        }
        if(!globalNameRegex.test(cleanFullName)){
            return res.status(400).json({
                message:"invalid fullName format"
            })
        }
        const isuserExist=await User.findOne({
            $or:[{email:cleanEmail},{userName:cleanInput}]
        })
        console.log("is user exist",isuserExist)
        if(isuserExist){
            return res.status(400).json({
                message:"user with this email or userName already exist"
            })
        }
        const otp=math.floor(100000 + math.random()*900000).toString();
        console.log("generated otp",otp)
        const hashedPassword=await bcrypt.hash(password,12)
        console.log("hashed password",hashedPassword)
        const newUser=await User.findOneAndUpdate(
            {email:cleanEmail},
            {
                userName:cleanInput,
                fullName:cleanFullName,
                email:cleanEmail,
                password:hashedPassword,
                otp,
                otpExpires:Date.now() + 15*60*1000,
                isVerified:false,
                
            },
            {upsert:true,now:true}


        )
        console.log("new user after update",newUser)
        if(!newUser) return res.status(400).json({
            message:"failed to create user"
        })
        const response=await sendMail({
            from:"bookStore app<app@bookstore.com>",
            to:cleanEmail,
            subject:"Your OTP for BookStore Registration",
            html:`<h1>userName:${cleanInput}</h1><h4>
             Hi ${cleanInput}, did you request an OTP for registration?</h4><p>Your OTP is <strong>${otp}</strong>.
             It expires in 15 minutes.</p><p style="color: #666;">If you did not request this, please ignore this email.</p>`

        })
        cosole.log("send mail response",response)
        if(!response.ok){
            return res.status(500).json({
                message:"failed to send otp email"
            })
        }else{
            return res.status(200).json({
                message:"verification code sent to email"
            })
        }

    } catch (error) {
        console.log("otp request faild",error)
        res.status(500).json({
            message:"Internal server error",error
        })
        
    }
}
export const verifyAnRegUser=async(req,res)=>{
    try {
        const {email,otp}=req.body
        console.log("verification request",req.body)
        if(!email||!otp){
            return res.status(400).json({
                message:"email and otp are required"
            })
        }
        const cleanEmail=normalizeEmail(email)
        if(!EMAIL_REGEX.test(cleanEmail)){
            return res.status(400).json({
                message:"invalid email format"
            })
        }
        const user= await User.findOne({email:cleanEmail})
        console.log("user found for verification",user)
        if(!user){
            return res.status(400).json({
                message:"user session not found, please register again"
            })
        }
        if(user.isVerified){
            return res.status(400).json({
                message:"user already verified"
            })
        }
        if(user.otp!==otp){
            return res.status(400).json({
                message:"invalid otp"
            })
        }
        if(Date.now()>user.otpExpires){
            return res.status(400).json({
                message:"otp expired"
            })
        }
        user.isVerified=true
        user.otp=null
        user.otpExpires=null
        await user.save()

        
    } catch (error) {
        console.log("verification and registration failed",error)
        res.status(500).json({
            message:"Internal server error, failed to verify and register user",error
        })
        
    }
}
export const login=async(req,res)=>{
    try {
        const {identifier,password}=req.body
        console.log("login request",req.body)   
        if(!identifier||!password){
            return res.status(400).json({
                message:"identifier and password are required"
            })
        }
        const cleanIdentifier=identifier?.trim()
        const query=EMAIL_REGEX.test(cleanIdentifier)?{email:normalizeEmail(cleanIdentifier)}:{username:cleanIdentifier}
        const oser=await User.findOne(query).select("+password")
        if(!user){
            return res.status(400).json({
                message:"invalid credentials"
            })
        }
        if(user.isVerified===false){
            return res.status(400).json({
                message:"user not verified, please verify your email"
            })
        }
        const ismatch= await bycrpt.compare(password,user.password)
        if(!ismatch){
            return res.status(400).json({
                message:"invalid credentials"
            })
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"}
        )
        res.json({token})
    } catch (error) {
        console.log("login failed",error)
        res.status(500).json({
            message:"Internal server error, failed to login",error
        })
        
    }

}
export const getUser=async(req,res)=>{
    try {
        const user= await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.json(user)
        
    } catch (error) {
        console.log("get user failed",error)
        res.status(500).json({
            message:"Internal server error, failed to get user",error
        })
        
    }
}

