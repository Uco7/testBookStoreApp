// upload function///////
export const uploadBook = async (req, res) => {
  // try {
  //   const { title, author, description } = req.body;

  //   if (!req.file) {
  //     return res.status(400).json({ message: "No file uploaded" });
  //   }

  //   const uploadResult = await new Promise((resolve, reject) => {
  //     const stream = cloudinary.v2.uploader.upload_stream(
  //       {
  //         folder: "BookStoreApp",
  //         resource_type: "raw",        // for PDFs and non-images
  //         use_filename: true,
  //         unique_filename: true,
  //       },
  //       (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result);
  //       }
  //     );

  //     streamifier.createReadStream(req.file.buffer).pipe(stream);
  //   });

  //   const book = await Book.create({
  //     title,
  //     author,
  //     description,
  //     fileUrl: uploadResult.secure_url,
  //     fileType: uploadResult.resource_type,
  //     user: req.user.id,
  //   });

  //   res.status(201).json(book);

  // } catch (err) {
  //   console.error("Upload error:", err);
  //   res.status(500).json({ message: err.message });
  // }


// upload function///////


// user auth
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// export const register = async (req,res) => {
//   const hashed = await bcrypt.hash(req.body.password,10);
//   const user = await User.create({...req.body,password:hashed});
//   res.json(user);
//   console.log("new user",user)
// };

// export const login = async (req,res) => {
//   const user = await User.findOne({email:req.body.email});
//   if(!user) return res.status(400).json({msg:"Invalid credentials"});

//   const ok = await bcrypt.compare(req.body.password,user.password);
//   if(!ok) return res.status(400).json({msg:"Invalid credentials"});

//   const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"});
//   console.log("res.data.token=",token)
//   res.json({token});
// };


// export const getUser = async (req, res) => {
//   console.log("req.user=", req.user);
//   console.log("req.user=", req.user.id);
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     console.error("Fetch user error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// user auth