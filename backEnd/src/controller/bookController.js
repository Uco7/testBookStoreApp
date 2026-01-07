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



import dotenv from "dotenv";
dotenv.config(); // must be first

import cloudinary from "cloudinary";
import streamifier from "streamifier";
import Book from "../models/book.js";
console.log("cloudinary env:", process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_KEY,process.env.CLOUDINARY_SECRET);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadBook = async (req, res) => {

  try {
    const { title, author, description, fileLink } = req.body;

    let fileUrl = null;
    let fileType = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "BookStoreApp", resource_type: "raw", use_filename: true, unique_filename: true },
          (error, result) => error ? reject(error) : resolve(result)
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      fileUrl = uploadResult.secure_url;
      fileType = uploadResult.resource_type;
    }

    const book = await Book.create({
      title,
      author,
      description,
      fileUrl,
      fileType,
      fileLink,
      user: req.user.id,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const updateBook = async (req, res) => { 
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     const { title, author, description } = req.body;

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer);
//       book.file = result.secure_url;
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

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { title, author, description, fileLink } = req.body;

    if (fileLink) {
      book.fileLink = fileLink;
      book.fileUrl = null; // optional: clear file if link used
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      book.fileUrl = result.secure_url;
      book.fileLink = null; // optional: clear link if file used
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    await book.save();
    res.status(200).json(book);
  } catch (err) {
    console.error("UpdateBook error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("DeleteBook error:", err);
    res.status(500).json({ message: err.message });
  }
};
