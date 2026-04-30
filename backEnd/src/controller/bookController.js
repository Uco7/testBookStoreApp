


import Book from "../models/book.js";
import { convertToPDF } from "../config/convert.js";
import { uploadToCloudinary } from "../config/uploadToCloudinary.js";

// ================= CREATE BOOK =================
export const createBook = async (req, res) => {
  try {
    const { title, author, description, fileLink } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
 console.log("reg body",req.body)
    let fileUrl = null;
    let fileType = null;

    // ================= FILE =================
    if (req.file) {
      const buffer = req.file.buffer;
      const originalNameAndExt = req.file.originalname.split(".").pop().toLowerCase();

      let finalBuffer = buffer;

      if (originalNamExt !== "pdf") {
        finalBuffer = await convertToPDF(buffer);
      }

const filename = `${Date.now()}-book`;
      const uploadResult = await uploadToCloudinary(finalBuffer, filename);

fileUrl = uploadResult.secure_url + "?fl_attachment";   
console.log("Generated file URL:", fileUrl);
   fileType = "file";
    }

    // ================= LINK =================
    if (fileLink) {
      fileUrl = fileLink;
      fileType = "link";
    }

    if (!req.file && !fileLink) {
      return res.status(400).json({ message: "Provide file or link" });
    }

    const book = new Book({
      title,
      author,
      description,
      fileUrl,
      fileLink,
      fileType,
      user: req.user?.id,
    });

    await book.save();

    res.status(201).json(book);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET BOOKS =================
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
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
      const buffer = req.file.buffer;
      const originalExt = req.file.originalname.split(".").pop().toLowerCase();

      let finalBuffer = buffer;

      if (originalExt !== "pdf") {
        finalBuffer = await convertToPDF(buffer);
      }

const filename = `${Date.now()}-book`;
      const uploadResult = await uploadToCloudinary(finalBuffer, filename);

book.fileUrl = uploadResult.secure_url + "?fl_attachment"; // ✅ FIX
console.log("Updated file URL:", book.fileUrl);
      book.fileLink = null;
      book.fileType = "file";
    }

    if (fileLink) {
      book.fileUrl = fileLink;
      book.fileLink = fileLink;
      book.fileType = "link";
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    await book.save();

    res.json(book);
  } catch (err) {
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