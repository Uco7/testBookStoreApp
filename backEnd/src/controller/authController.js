import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req,res) => {
  const hashed = await bcrypt.hash(req.body.password,10);
  const user = await User.create({...req.body,password:hashed});
  res.json(user);
  console.log("new user",user)
};

export const login = async (req,res) => {
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.status(400).json({msg:"Invalid credentials"});

  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.status(400).json({msg:"Invalid credentials"});

  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"});
  console.log("res.data.token=",token)
  res.json({token});
};


export const getUser = async (req, res) => {
  console.log("req.user=", req.user);
  console.log("req.user=", req.user.id);
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};