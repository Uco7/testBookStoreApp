import User from "../models/user.js";
import sendMail from "../middleWare/sendMail.js";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import user from "../models/user.js";
import { login } from "./authController.js";
import { error } from "console";

const normalizeEmail=(email)=>email?toLowerCase().trim();
const normalizeUserName=(inputData)=>inputData?.replace(/[^a-zA-Z\s]/g, "").trim()
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;
const globalNameRegex = /^[\p{L}\s'-]{2,50}$/u;
// This removes EVERYTHING except letters and spaces
const sanitizedName = (str) => str?.replace(/[^a-zA-Z\s]/g, "").trim();
export const requestOtp=async(req,res)=>{
    const {userName,fullName,email,password}=req.body;
    if(!userName||!fullName||!email||!password){
        return res.status(400).json({
            message:"all field are required"
        })
    }
    const cleanEmail=normalizeEmail(email)
    const cleanUserName=normalizeUserName(userName)
    if(EMAIL_REGEX.test(cleanEmail)){
        return res.status(400).json({
            message:"invalid email format"
        })
    }
    if(USERNAME_REGEX.test(cleanUserName)){
        return res.status(400).json({
            message:"invalid  username format"
        })
    }
    if(globalNameRegex.test(fullName)){
        return res.status(400).json({
            message:"invalid name format"
        })
    }
    if(PASSWORD_REGEX.test(password)){
        return res.status(400).json({
            message:"invalid password format"
        })
    }
    const  isexist=await User.findOne(
        {
            $or:[{email:cleanEmail},{userName:cleanUserName}]
        }
    )
    if(isexist){
        return res.status(400).json({
            message:"user already exist"
        })
    }
    const otp=Math.floor(100000 + Math.random() *900000).toString;
    const hashPassword=await bycrpt.hash
    await User.findOneAndUpdate({
        $or:{email:cleanEmail},
        userName:cleanUserName,
        fullName:normalizeUserName(fullName),
        password:hashPassword,
        otp,
        otpExpires:Date.now()+15*60*1000,
        isVerified:fales,


    },{upser:true,now: true})

};
sendMail({
    from:"bookStore App<noreply@ucheTecHub.store>",
    to:cleanEmail,
    subject:"your registeration verification email at bookSore.store",
    html:`<h1>hi ${cleanUserName}
    <p>your verification otp ${otp}</p>`
})
.catch((error)=>{
    console.log("error sending mail",error)
    res.status(400).json({
        message:"emai sending failed"
    })
    console.log("email sent")
    res.status(200).json({
        message:"verification code have been sent to your email"
    })
})
export const verifyandregUser=async(req,res)=>{
    try {
        const {otp,email}=req.body;
        const cleanEmail=normalizeEmail(email)
        if(EMAIL_REGEX.test(cleanEmail)){
            res.status(400).json({
                message:"invalid email format"
            })
        }
        const existUser=await User.findOne({email:cleanEmail})
        if(Date.now()>existUser.otpExpires){
            res.status(400).json({
                message:"otp has already expire"
            })
        }
        if(existUser&&existUser.isVerified===true){
            res.status(400).json({
                message:"user has already been verified"
            })
        }
        existUser.otp=null;
        existUser.isVerified=true;
        existUser.otpExpires=null
        await User.save();
        res.status(200).json({
            user:{
                id:existUser._id,
                email:existUser.email,
                userName:existUser.userName
            },
            message:"user registration success"
        })
        
    } catch (error) {
        console.log("error",error)
        res.status(500).json({
            message:"internal server error, faield to complete processs"
        })
        
    }
}

export const login=async(req,res)=>{
    try {
        const {identifyer,password}=req.body;
        if(!identifyer||!password){
            res.status(400).json({
                message:"input field must not be empty"
            })
        }
        const cleanIdentifyer=sanitizedName(identifyer);
        const query=EMAIL_REGEX.test(identifyer)?{email:normalizeEmail(identifyer)}:{userName:cleanIdentifyer}
        if(!query){
            res.status(400).json({
                message:"no usabe data parameter"
            })

        }
        const user=await User.findOne(query).select("+password")
        if(!user){
            res.status(400).json({
                message:"user does not exist"
            })
        }
        if(user&&user.isVerified===false){
            res.status(400).json({
                message:"user is not verifyied"
            })
        }
        const match= await bycrpt.compare(password,user.password)
        if(!match){
            res.status(400).json({
                message:"invalid credentials"
            })
        }
        const token=await jwt.sign({id:user._id},process.envJWT_SCREAT,{
            expiresIn:"7d"
        })
        If(!token){
            res.status(400).json({
                message:"faied to sign user in"
            })
        }
        res.json({token})
        
    } catch (error) {
        console.log("error in login user",error)
        res.status(500).json({
            message:"login failed",error
        })
        
    }
}
export const getUser=async(req,res)=>{
    try {
        const user=await User.findById({_id:req.user.id});
        if(!user)return res.status(400).json({
            message:"user does not exist"
        })
        req.json(user)
        
    } catch (error) {
        console.log("error")
        res.status(500).json({
            message:"error fetching user"
        })
        
    }
}

export const forgetpasword=async(req,res)=>{
    try {
        const {identifyer}=req.body;
        if(!identifyer){
            res.status(400).json({
                message:"input filed empty"
            })
        }
        const normalizeIdentifier=identifyer?{email:EMAIL_REGEX.test(normalizeEmail(identifyer))}:{userName:USERNAME_REGEX.test(normalizeUserName(identifyer))}
        const  user=await User.findOne({
            $or:[{email:normalizeIdentifier},{username:normalizeIdentifier}]
        });
        if(!user) return res.status(400).json({
            message:"user not found"
        })
        const otp=Math.floor(100000 + Math.random()*900000).toString() 
        user.resetPasswordOTP=crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")
        user.otpExpires=Date.now()+ 15*60*1000;
        await user.save()
         sendMail({
            from:"BookSore App",
            to:user.email,
            subject:"password reset pin",
            html:`<h2>hi ${user.fullName} here is your otp reset pin for your password${otp}</h2>`

        }).catch((error)=>{
            console.log("email sending error",error)
            res.status(400).json({
                message:"error sending mail",error
            })
        })
        

        
    } catch (error) {
    console.log("error",error);
    res.status(500).json({
        message:"server erorr/network conection terminated"
    })
        
    }
}
export const resetPassword=async(req,res)=>{
    try {
        const {identifyer,otp,password}=req.body; 
        if(identifyer.typeof!=="string"||otp.typeof!=="string"||password.typeof!=="string"){
            return res.status(400).json({
                message:"provide the required field"
            })
        }
     const query=(identifyer&&EMAIL_REGEX.test(identifyer))?{email:normalizeEmail(identifyer)}:{userName:normalizeUserName(identifyer)}
     const hashOTP=crypto.createHash("sha256").update(otp).digest("hex")
     const newPassword=await bycrpt.hash(password,10)
     const user=await User.findByIdAndUpdate({
        $or:[{email:normalizeEmail(query)},{userName:normalizeUserName(query)}],
        resetPasswordOTP:hashOTP,
        resetPasswordExpires:{$gt:Date.now()},
        {
            $set:{
                password:newPassword,
                resetPasswordOTP:null,
                resetPasswordExpires:null

        }
        },        {new:true}
        

     })
        