

import Book from "../models/book.js";
import { convertoPDF } from "../config/convert.js";
import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
import sanitizeHtml from "sanitize-html";
import { fileTypeFromBuffer } from "file-type";

/* =========================
   CONFIG
========================= */

const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
const textRegex = /^[A-Za-z0-9\s.,'-]+$/;

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png"
];

/* =========================
   SAFE CONVERSION (TIMEOUT)
========================= */

const convertWithTimeout = async (buffer, timeout = 30000) => {
  return Promise.race([
    convertoPDF(buffer),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Conversion timeout")), timeout)
    )
  ]);
};

/* =========================
   CREATE BOOK
========================= */

export const createBook = async (req, res) => {
  try {
    console.log("🔥 CREATE BOOK HIT");

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, author, description, fileLink } = req.body;

    if (!title || !textRegex.test(title.trim())) {
      return res.status(400).json({ message: "Invalid title" });
    }
    
        if(typeof title!=="string"||title.trim()==""){
            return res.status(400).json({
                message:"valide title field is required"
            })
        }
       
            if(author!=null){
                const trimed=author.trim()
                if(typeof author!=="string"
                    ||trimed==""
                    ||!textRegex.test(trimed)){
                    return res.status(400).json({
                message:"valide author field is required"
            })
            
        }
        

            }
            if(description!=null){
                const trimed=description.trim()
                if(typeof description!=="string"||
                   
                    !textRegex.test(trimed)
                     ){

                    return res.status(400).json({
                message:"valide descripion field is required"
            })
            
        }
        
    }
      const cleanDescription=description?sanitizeHtml(description,{
                allowedTags:[],
                allowedAttributes:{}
            }):""

    let fileUrl = null;
    let fileType = null;

    /* =========================
       FILE FLOW (MEMORY ONLY)
    ========================= */
    if (req.file) {
      const buffer = req.file.buffer;

      if (!buffer) {
        return res.status(400).json({
          message: "File buffer missing (check multer memoryStorage)"
        });
      }

      const detected = await fileTypeFromBuffer(buffer);

      if (!detected || !allowedMimeTypes.includes(detected.mime)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      let finalBuffer = buffer;

      if (detected.mime !== "application/pdf") {
        finalBuffer = await convertWithTimeout(buffer);
      }

      const upload = await uploadToCloudinary(
        finalBuffer,
        `${Date.now()}-book`
      );

      fileUrl = upload.secure_url + "?fl_attachment";
      fileType = "file";
    }

    /* =========================
       LINK FLOW
    ========================= */
    if (fileLink) {
      let url;

      try {
        url = new URL(fileLink.trim());
      } catch {
        return res.status(400).json({ message: "Invalid URL" });
      }

      if (url.protocol !== "https:") {
        return res.status(400).json({ message: "Only HTTPS allowed" });
      }

      fileUrl = url.href;
      fileType = "link";
    }

    /* =========================
       SAVE BOOK
    ========================= */
    const book = await Book.create({
      title: title.trim(),
      author: author?.trim() || "",
      description: description
        ? sanitizeHtml(description, {
            allowedTags: [],
            allowedAttributes: {}
          })
        : "",
      fileUrl,
      fileType,
      user: req.user.id
    });

    return res.status(201).json(book);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




/* =========================
   UPDATE BOOK
========================= */

export const updateBook = async (req, res) => {
  try {
    console.log("🔥 UPDATE BOOK HIT");

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
console.log("Request params:", req.params.id, "Request user:", req.user.id, "File included:", !!req.file);
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({ message: "Not found" });
    }

    const { title, author, description, fileLink } = req.body;
 if(typeof title!=="string"||title.trim()==""){
            return res.status(400).json({
                message:"valide title field is required"
            })
        }
       
            if(author!=null){
                const trimed=author.trim()
                if(typeof author!=="string"
                    ||trimed==""
                    ||!textRegex.test(trimed)){
                    return res.status(400).json({
                message:"valide author field is required"
            })
            
        }
        

            }
            if(description!=null){
                const trimed=description.trim()
                if(typeof description!=="string"||
                   
                    !textRegex.test(trimed)
                     ){

                    return res.status(400).json({
                message:"valide descripion field is required"
            })
            
        }
        
    }
      const cleanDescription=description?sanitizeHtml(description,{
                allowedTags:[],
                allowedAttributes:{}
            }):""


    /* =========================
       FILE UPDATE
    ========================= */
     let fileUrl=null;
        let fileType=null;
    if (req.file) {
      const buffer = req.file.buffer;

      if (!buffer) {
        return res.status(400).json({
          message: "File buffer missing"
        });
      }

      const detected = await fileTypeFromBuffer(buffer);

      if (!detected || !allowedMimeTypes.includes(detected.mime)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      let finalBuffer = buffer;

      if (detected.mime !== "application/pdf") {
        finalBuffer = await convertWithTimeout(buffer);
      }

      const upload = await uploadToCloudinary(
        finalBuffer,
        `${Date.now()}-book`
      );

      book.fileUrl = upload.secure_url + "?fl_attachment";
      book.fileType = "file";
      book.fileLink = null;
    }

    /* =========================
       LINK UPDATE
    ========================= */
    

if(fileLink!=null){
    
    try {
        const trimedLink=fileLink.trim()
        const cleanLink=new URL(trimedLink)
        if(cleanLink.protocol!=="https:"){
            return res.status(400).json({
                message:"provid a  valid link"
            })
        }
        book.fileLink=cleanLink
        book.fileType="link";
        
        
        
    } catch (err) {
        res.status(500).json({
            message:err.message 
        })
        
    }
}
book.title = title || book.title;
book.author = author || book.author;
book.description = description || book.description;
await book.save();

    return res.json(book);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
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