// import Book from "../models/book.js";

// export const uploadBook = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const { title, author, description } = req.body;
//     if (!title || !author) {
//       return res.status(400).json({ message: "Title and Author are required" });
//     }

//     const protocol = req.get("x-forwarded-proto") || req.protocol;
//     const fileUrl = `${protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//     const book = await Book.create({
//       title,
//       author,
//       description,
//       fileUrl,
//       fileType: req.file.mimetype,
//       user: req.user.id,
//     });

//     res.status(201).json(book);
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };

// export const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ user: req.user.id }).sort("-createdAt");
//     res.json(books);
//   } catch (err) {
//     console.error("Fetch books error:", err);
//     res.status(500).json({ message: "Fetch failed" });
//   }
// };

// export const deleteBook = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const book = await Book.findOne({ _id: id, user: req.user.id });
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     await Book.deleteOne({ _id: book._id });

//     res.json({ message: "Book deleted successfully" });
//   } catch (err) {
//     console.error("Delete book error:", err);
//     res.status(500).json({ message: "Failed to delete book" });
//   }
// };



// export const updateBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, author, description } = req.body;

//     // Find the book belonging to the user
//     const book = await Book.findOne({ _id: id, user: req.user.id });
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     // Update fields if provided
//     if (title) book.title = title;
//     if (author) book.author = author;
//     if (description !== undefined) book.description = description;

//     // If a new file is uploaded
//     if (req.file) {
//       const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//       book.fileUrl = fileUrl;
//       book.fileType = req.file.mimetype;
//     }

//     await book.save();

//     res.json(book);
//   } catch (err) {
//     console.error("Update book error:", err);
//     res.status(500).json({ message: "Failed to update book" });
//   }
// };
// src/controller/bookController.js
// src/controller/bookController.js



// import dotenv from "dotenv";
// dotenv.config(); // must be first

// import cloudinary from "cloudinary";
// import streamifier from "streamifier";
// import Book from "../models/book.js";
// console.log("cloudinary env:", process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_KEY,process.env.CLOUDINARY_SECRET);

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

// export const uploadBook = async (req, res) => {

//   try {
//     const { title, author, description, fileLink } = req.body;

//     let fileUrl = null;
//     let fileType = null;

//     if (req.file) {
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.v2.uploader.upload_stream(
//           { folder: "BookStoreApp", resource_type: "raw", use_filename: true, unique_filename: true },
//           (error, result) => error ? reject(error) : resolve(result)
//         );
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });

//       fileUrl = uploadResult.secure_url;
//       fileType = uploadResult.resource_type;
//     }

//     const book = await Book.create({
//       title,
//       author,
//       description,
//       fileUrl,
//       fileType,
//       fileLink,
//       user: req.user.id,
//     });

//     res.status(201).json(book);
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ user: req.user.id }).sort("-createdAt");
//     res.status(200).json(books);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // export const updateBook = async (req, res) => { 
// //   try {
// //     const book = await Book.findById(req.params.id);
// //     if (!book) return res.status(404).json({ message: "Book not found" });

// //     const { title, author, description } = req.body;

// //     if (req.file) {
// //       const result = await uploadToCloudinary(req.file.buffer);
// //       book.file = result.secure_url;
// //     }

// //     book.title = title || book.title;
// //     book.author = author || book.author;
// //     book.description = description || book.description;

// //     await book.save();
// //     res.status(200).json(book);
// //   } catch (err) {
// //     console.error("UpdateBook error:", err);
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// export const updateBook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     const { title, author, description, fileLink } = req.body;

//     if (fileLink) {
//       book.fileLink = fileLink;
//       book.fileUrl = null; // optional: clear file if link used
//     }

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer);
//       book.fileUrl = result.secure_url;
//       book.fileLink = null; // optional: clear link if file used
//     }

//     book.title = title || book.title;
//     book.author = author || book.author;
//     book.description = description || book.description;

//     await book.save();
//     res.status(200).json(book);
//   } catch (err) {
//     console.error("UpdateBook error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// export const deleteBook = async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });
//     res.status(200).json({ message: "Book deleted successfully" });
//   } catch (err) {
//     console.error("DeleteBook error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



// import dotenv from "dotenv";
// dotenv.config(); // must be first
// import path from "path";
// import fs from "fs";
// import libre from "libreoffice-convert";
// import util from "util";
// import cloudinary from "cloudinary";
// import Book from "../models/book.js";

// const lib_convert = util.promisify(libre.convert);

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });
// console.log("Checking Cloudinary Key:",process.env.CLOUDINARY_KEY ? "FOUND" : "NOT FOUND");
// const convertToPDF = async (inputPath) => {
//   const ext = path.extname(inputPath).toLowerCase();
//   console.log("ext",ext)
//   const supportedDocs = [".docx", ".doc", ".pptx", ".ppt", ".xls", ".xlsx"];
//   if (!supportedDocs.includes(ext)) return inputPath;

//   try {
//     const docBuffer = fs.readFileSync(inputPath);
//     console.log("docbufer",docBuffer)
//     const pdfBuffer = await lib_convert(docBuffer, ".pdf", undefined);
//     const pdfPath = inputPath.replace(ext, ".pdf");
//     fs.writeFileSync(pdfPath, pdfBuffer);
//     return pdfPath;
//   } catch (err) {
//     console.error("Conversion Error:", err.message);
//     return inputPath;
//   }
// };

// export const uploadBook = async (req, res) => {
//   let localPath = null;
//   let convertedPath = null;
//   try {
//     const { title, author, description, fileLink } = req.body;
//     let finalUrl = fileLink || null;
//     let format = "link";

//     if (req.file) {
//       localPath = req.file.path;
//       convertedPath = await convertToPDF(localPath);
      
//       const result = await cloudinary.v2.uploader.upload(convertedPath, {
//         folder: "BookStoreApp",
//         resource_type: "raw",
//       });
//       console.log("cloudnay result",result)

//       finalUrl = result.secure_url;
//       console.log("fileUrel",finalUrl)
//       format = path.extname(convertedPath).replace(".", "");
//     }

//     const book = await Book.create({
//       title, author, description,
//       fileUrl: finalUrl,
//       fileLink: req.file ? null : fileLink,
//       originalFormat: format,
//       user: req.user.id,
//     });
//     console.log("book",book)

//     if (localPath && fs.existsSync(localPath)) fs.unlinkSync(localPath);
//     if (convertedPath && convertedPath !== localPath && fs.existsSync(convertedPath)) fs.unlinkSync(convertedPath);

//     res.status(201).json(book);
//   } catch (err) {
//     if (localPath && fs.existsSync(localPath)) fs.unlinkSync(localPath);
//     if (convertedPath && fs.existsSync(convertedPath)) fs.unlinkSync(convertedPath);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ user: req.user.id }).sort("-createdAt");
//     res.status(200).json(books);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const updateBook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     const { title, author, description, fileLink } = req.body;

//     if (fileLink) {
//       book.fileLink = fileLink;
//       book.fileUrl = null; // optional: clear file if link used
//     }

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer);
//       book.fileUrl = result.secure_url;
//       book.fileLink = null; // optional: clear link if file used
//     }

//     book.title = title || book.title;
//     book.author = author || book.author;
//     book.description = description || book.description;

//     await book.save();
//     res.status(200).json(book);
//   } catch (err) {
//     console.error("UpdateBook error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



// export const deleteBook = async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });
//     res.status(200).json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// import path from "path";
// import fs from "fs";
// import multer from "multer";
// import libre from "libreoffice-convert";
// import util from "util";
// import Book from "../models/book.js";
// import { uploadsDir } from "../config/path.js";

// const lib_convert = util.promisify(libre.convert);

// // ================= MULTER =================
// const uploadsDir = path.join(process.cwd(), "uploads");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const cleanName = file.originalname
//       .replace(/\s+/g, "_")
//       .replace(/[^\w.-]/g, "");

//     cb(null, `${Date.now()}-${cleanName}`);
//   },
// });

// export const upload = multer({ storage });

// // ================= CONVERT =================
// const convertToPDF = async (inputPath) => {
//   const ext = path.extname(inputPath).toLowerCase();

//   const supported = [".docx", ".doc", ".pptx", ".ppt", ".xls", ".xlsx"];

//   if (!supported.includes(ext)) {
//     return inputPath;
//   }

//   try {
//     const fileBuffer = fs.readFileSync(inputPath);

//     const pdfBuffer = await lib_convert(fileBuffer, ".pdf", undefined);

//     const pdfPath = inputPath.replace(ext, ".pdf");

//     fs.writeFileSync(pdfPath, pdfBuffer);

//     // optional: delete original file after conversion
//     // fs.unlinkSync(inputPath);

//     return pdfPath;
//   } catch (err) {
//     console.error("❌ Conversion failed:", err.message);
//     return inputPath;
//   }
// };

// // ================= CREATE BOOK =================
// export const createBook = async (req, res) => {
//   try {
//     const { title, author, description, fileLink } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }

//     let fileUrl = null;
//     let fileType = null;
//     let originalFormat = null;

//     // ---------- FILE UPLOAD ----------
//     if (req.file) {
//       const finalPath = await convertToPDF(req.file.path);
//       console.log("Final file path after conversion:", finalPath);

//       const fileName = path.basename(finalPath);

//       // ✅ IMPORTANT: use /uploads not /files
//       fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
//       console.log("Generated file URL:", fileUrl);

//       fileType = "file";
//       originalFormat = path.extname(req.file.originalname).replace(".", "");
//     }

//     // ---------- EXTERNAL LINK ----------
//     if (fileLink) {
//       fileUrl = null;
//       fileType = "link";
//     }

//     if (!req.file && !fileLink) {
//       return res.status(400).json({ message: "Provide file or link" });
//     }
//     if(!req.user.id){
//       return res.status(400).json({ message: "User not authenticated" });
//     }

//     const book = new Book({
//       title,
//       author,
//       description,
//       fileUrl,
//       fileLink,
//       fileType,
//       originalFormat,
//       user: req.user?.id || null,
//     });

//     await book.save();
// console.log("Book created:", book);
//     res.status(201).json(book);
//   } catch (err) {
//     console.error("❌ Create book error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================= GET BOOKS =================
// export const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });
//     console.log("Books retrieved:", books);
//     res.json(books);
//   } catch (err) {
//     console.error("❌ Get books error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================= UPDATE BOOK =================
// export const updateBook = async (req, res) => {
//   try {
//     const { title, author, description, fileLink } = req.body;

//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     if (req.file) {
//       const finalPath = await convertToPDF(req.file.path);
//       const fileName = path.basename(finalPath);

//       book.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
//       console.log("Updated file URL:", book.fileUrl);
//       book.fileLink = null;
//       book.fileType = "file";
//       book.originalFormat = path.extname(req.file.originalname).replace(".", "");
//     }

//     if (fileLink) {
//       book.fileLink = fileLink;
//       book.fileUrl = null;
//       book.fileType = "link";
//     }

//     book.title = title || book.title;
//     book.author = author || book.author;
//     book.description = description || book.description;

//     await book.save();

//     res.json(book);
//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================= DELETE BOOK =================
// export const deleteBook = async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     console.log("Book deleted:", book);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




import path from "path";
import fs from "fs";
import multer from "multer";
import libre from "libreoffice-convert";
import util from "util";
import Book from "../models/book.js";
import { uploadsDir } from "../config/path.js";

const lib_convert = util.promisify(libre.convert);

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const cleanName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");

    cb(null, `${Date.now()}-${cleanName}`);
  },
});

export const upload = multer({ storage });

// ================= CONVERT =================
const convertToPDF = async (inputPath) => {
  const ext = path.extname(inputPath).toLowerCase();
  const supported = [".docx", ".doc", ".pptx", ".ppt", ".xls", ".xlsx"];

  if (!supported.includes(ext)) {
    return inputPath;
  }

  try {
    const fileBuffer = fs.readFileSync(inputPath);
    const pdfBuffer = await lib_convert(fileBuffer, ".pdf", undefined);

    const pdfPath = inputPath.replace(ext, ".pdf");

    fs.writeFileSync(pdfPath, pdfBuffer);

    return pdfPath;
  } catch (err) {
    console.error("❌ Conversion failed:", err.message);
    return inputPath;
  }
};

// ================= CREATE BOOK =================
export const createBook = async (req, res) => {
  try {
    const { title, author, description, fileLink } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let fileUrl = null;
    let fileType = null;
    let originalFormat = null;

    // ---------- FILE UPLOAD ----------
    if (req.file) {
      const finalPath = await convertToPDF(req.file.path);
      const fileName = path.basename(finalPath);

      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

      fileType = "file";
      originalFormat = path.extname(req.file.originalname).replace(".", "");
    }

    // ---------- LINK ----------
    if (fileLink) {
      fileUrl = fileLink;
      fileType = "link";
    }

    if (!req.file && !fileLink) {
      return res.status(400).json({ message: "Provide file or link" });
    }

    if (!req.user?.id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const book = new Book({
      title,
      author,
      description,
      fileUrl,
      fileLink,
      fileType,
      originalFormat,
      user: req.user.id,
    });

    await book.save();

    res.status(201).json(book);
  } catch (err) {
    console.error("❌ Create book error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET BOOKS =================
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (err) {
    console.error("❌ Get books error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE BOOK =================
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, fileLink } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (req.file) {
      const finalPath = await convertToPDF(req.file.path);
      const fileName = path.basename(finalPath);

      book.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
      book.fileLink = null;
      book.fileType = "file";
      book.originalFormat = path.extname(req.file.originalname).replace(".", "");
    }

    if (fileLink) {
      book.fileLink = fileLink;
      book.fileUrl = null;
      book.fileType = "link";
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    await book.save();

    res.json(book);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE BOOK =================
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};