// // import Book from "../models/book.js";
// // import { convertoPDF } from "../config/convert.js";
// // import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
// // import sanitizeHtml from 'sanitize-html';
// // import { fileTypeFromBuffer } from "file-type";



// // const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
// // const textRegex = /^[A-Za-z0-9\s.,'-]+$/;

// // const allowedRealMimeTypes = [
// //   "application/pdf",
// //   "application/msword",
// //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// //   "application/vnd.ms-powerpoint",
// //   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
// //   "image/jpeg",
// //   "image/png"
// // ];

// // export const createBook = async (req, res) => {
// //     try {
// //         const {title,author,description, fileLink}=req.body
// //         if(!title)return res.status(400).json({
// //                 message:" title field is required"
// //             })
// //              console.log("reg body",req.body)

    
// //         if(typeof title!=="string"||title.trim()==""){
// //             return res.status(400).json({
// //                 message:"valide title field is required"
// //             })
// //         }
// //         if(!textRegex.test(title))return res.status(400).json({
// //                 message:"valide title field is required"
// //             })
// //             if(author!=null){
// //                 const trimed=author.trim()
// //                 if(typeof author!=="string"
// //                     ||trimed==""
// //                     ||!textRegex.test(trimed)){
// //                     return res.status(400).json({
// //                 message:"valide author field is required"
// //             })
            
// //         }
        

// //             }
// //             if(description!=null){
// //                 const trimed=description.trim()
// //                 if(typeof description!=="string"||
                   
// //                     !textRegex.test(trimed)
// //                      ){

// //                     return res.status(400).json({
// //                 message:"valide descripion field is required"
// //             })
            
// //         }
        
// //     }
    

// //             const cleanDescription=description?sanitizeHtml(description,{
// //                 allowedTags:[],
// //                 allowedAttributes:{}
// //             }):""
// //    let fileUrl=null;
// //    let fileType=null;
// //    if(req.file){
// //     const buffer=req.file.buffer;
// //       const detectedType = await fileTypeFromBuffer(buffer);
    
// //           if (!detectedType) {
// //             return res.status(400).json({
// //               message: "Unable to detect actual file type"
// //             });
// //           }
    
// //           if (!allowedRealMimeTypes.includes(detectedType.mime)) {
// //             return res.status(400).json({
// //               message: "Actual file type is not allowed"
// //             });
// //           }
// //     // console.log("file buffer",buffer)
// //     // const fileOriginalNameAndExt=req.file.originalname.split(".").pop().toLowerCase();
// //     // console.log("fileoriginal name",fileOriginalNameAndExt);
// //     let finalBuffer=buffer;
// //     let fileName=`${Date.now()}-book`;
// //       if (detectedType.mime !== "application/pdf") {

// //     // if(fileOriginalNameAndExt!=="pdf"){
// //         finalBuffer= await convertoPDF(buffer);
// //         console.log("final buffer",finalBuffer)

// //     }
// //     const uploadTOcloudinaryResult= await uploadToCloudinary(finalBuffer,fileName)
// //     console.log("uploaded url",uploadTOcloudinaryResult)
// //     fileUrl=uploadTOcloudinaryResult.secure_url +"?fl_attachment"
// //     if(!fileUrl){
// //      console.log("file url",fileUrl)
// //     }
    
// //     fileType=uploadTOcloudinaryResult?uploadTOcloudinaryResult.original_filename:"file";
// //     console.log("filet type",fileType)
// //    }
// //    if(fileLink!=null){
// //     if(typeof fileLink!=="string"||fileLink.trim()===""){
// //        return  res.status(400).json({
// //             message:"only a valid http link is allow"
// //         })
// //     }
// //     const trimedLink=fileLink.trim()
// //     let cleanUrl;
     
// //    try {
// //     cleanUrl=new URL(trimedLink)
// //     if(cleanUrl.protocol!=="https:"){
// //         return res.status(400).json({
// //             message:"provide a valid url format"
// //         })
// //     }
// //     console.log("url file",cleanUrl)
    
// //    } catch (error) {
// //     console.log("url error")
// //     res.status(400).json({
// //         message:"invailid url format"
// //     })
    
// //    }
    
   
// //    fileUrl=cleanUrl
// //    fileType="link"
// //    }
  
// //       const book = new Book({
// //          title,
// //          author,
// //          description,
// //          fileUrl,
// //          fileLink,
// //          fileType,
// //          user: req.user?.id,
// //        });
   
// //        await book.save();
// //        console.log("book",book)
   
// //        res.status(201).json(book);
            
        
// //     } catch (error) {
// //         console.log(error)
// //         res.status(500).json({
// //             message:"network connection error|| server error"
// //         })
        
// //     }

// // }

// // export const getBooks=async(req,res)=>{
// //     try {
// //         const books=await Book.find({user:req.user.id}).sort({createdAt:-1});
// //         if(!books){
// //             return res.status(400).json({
// //                 message:"no data upload  file or docs"
// //             })
// //         }
// //         console.log("book",books)
// //         res.json(books)
// //     } catch (err) {
// //         res.status(500).json({
// //             message:err.message 
// //         })
        
// //     }
// // }

// // export const updateBook=async(req,res)=>{
// //     const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
// //     const textRegex = /^[A-Za-z0-9\s.,'-]+$/;
// //     try {
// //         const { title, author, description, fileLink}=req.body;
// //          console.log("reg body",req.body)

// //         if(title!=null){
// //             const cleanField=title.trim();
// //             if(!textRegex.test(cleanField)
// //                 ||cleanField===""
// //                 ||typeof cleanField!=="string"){
// //                     return res.status(400).json({
// //                         message:"invalid title field"
// //                     })
// //                 }
// //         }

// //         if(author!=null){
// //             const cleanField=author.trim();
// //             if(!textRegex.test(cleanField)
// //                 ||cleanField===""
// //                 ||typeof cleanField!=="string"){
// //                     return res.status(400).json({
// //                         message:"invalid author field"
// //                     })
// //                 }
// //             }
// //             if(description!=null){
// //                 const cleanField=description.trim();
// //                 if(!descriptionRegex.test(cleanField)
// //                     ||cleanField===""
// //                 ||typeof cleanField!=="string"){
// //                     return res.status(400).json({
// //                         message:"invalid description field"
// //                     })
// //                 }
// //             }
// //             const cleanDescription=description? sanitizeHtml(description,{
// //                 allowedTags:[],
// //                 allowedAttributes:{}
// //             }):""
// //             const book=await Book.findById(req.params.id);
// //             if(!book){
// //                 return res.status(400).json({
// //                     message:"book not found"
// //                 })
// //             }
// //         let fileUrl=null;
// //         let fileType=null;
// //         if(req.file!=null){
// //             const buffer=req.file.buffer;
// //             // const fileOrigianalNameExt=req.file.originalname.split(".").pop().toLowerCase()
// //                   const detectedType = await fileTypeFromBuffer(buffer);
// //              if (!detectedType) {
// //         return res.status(400).json({
// //           message: "Unable to detect actual file type"
// //         });
// //       }
// //             let finalBuffer=buffer
// //                   if (detectedType.mime !== "application/pdf") {

// //             // if(fileOrigianalNameExt!=="pdf"){
                
          
// //             finalBuffer =await convertoPDF(buffer)
// //         }
// //         const filename=`${Date.now()}-book`;
// //         const uploadTocloudinaryUlr=await uploadToCloudinary(finalBuffer,filename)

// //        book.fileUrl=uploadTocloudinaryUlr.secure_url +"?fl_attachment"
// //       book.fileLink = null;
// //       book.fileType="file"
     
// //         console.log("to cloudnary",book.fileUrl)
// // }
// // if(fileLink!=null){
    
// //     try {
// //         const trimedLink=fileLink.trim()
// //         const cleanLink=new URL(trimedLink)
// //         if(cleanLink.protocol!=="https:"){
// //             return res.status(400).json({
// //                 message:"provid a  valid link"
// //             })
// //         }
// //         book.fileLink=cleanLink
// //         book.fileType="link";
        
        
        
// //     } catch (err) {
// //         res.status(500).json({
// //             message:err.message 
// //         })
        
// //     }
// // }
// // book.title = title || book.title;
// // book.author = author || book.author;
// // book.description = description || book.description;
// // await book.save();

// // res.json(book);
// //     } catch (err) {
// //           res.status(500).json({
// //             message:err.message 
// //         })
        
// //     }


// // }





// import Book from "../models/book.js";
// import { convertoPDF } from "../config/convert.js";
// import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
// import sanitizeHtml from "sanitize-html";
// import { fileTypeFromBuffer } from "file-type";

// import ClamScan from "clamscan";
// import fs from "fs/promises";
// import path from "path";
// import os from "os";

// /* =========================
//    REGEX + ALLOWLIST
// ========================= */

// const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
// const textRegex = /^[A-Za-z0-9\s.,'-]+$/;

// const allowedRealMimeTypes = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/vnd.ms-powerpoint",
//   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   "image/jpeg",
//   "image/png"
// ];

// /* =========================
//    CLAMAV INIT (SAFE)
// ========================= */

// const initClamAV = async () => {
//   try {
//     const clam = await new ClamScan().init({
//       preference: "clamscan",
//       clamscan: {
//         path: "/usr/bin/clamscan",
//         active: true
//       },
//       clamdscan: { active: false }
//     });

//     return clam;
//   } catch (err) {
//     console.log("ClamAV not available (dev mode)");
//     return null;
//   }
// };

// /* =========================
//    CREATE BOOK
// ========================= */

// export const createBook = async (req, res) => {
//   try {
//     const { title, author, description, fileLink } = req.body;

//     if (!title || typeof title !== "string" || title.trim() === "") {
//       return res.status(400).json({ message: "Valid title is required" });
//     }

//     if (!textRegex.test(title.trim())) {
//       return res.status(400).json({ message: "Invalid title format" });
//     }

//     let fileUrl = null;
//     let fileType = null;

//     /* =========================
//        FILE HANDLING + SCAN
//     ========================= */

//     if (req.file) {
//       const buffer = req.file.buffer;

//       const detectedType = await fileTypeFromBuffer(buffer);

//       if (!detectedType) {
//         return res.status(400).json({
//           message: "Unable to detect actual file type"
//         });
//       }

//       if (!allowedRealMimeTypes.includes(detectedType.mime)) {
//         return res.status(400).json({
//           message: "Actual file type is not allowed"
//         });
//       }

//       // TEMP FILE
//       const tempPath = path.join(
//         os.tmpdir(),
//         `${Date.now()}-${req.file.originalname}`
//       );

//       await fs.writeFile(tempPath, buffer);

//       // VIRUS SCAN
//       const clam = await initClamAV();

//       if (process.env.ENABLE_VIRUS_SCAN === "true" && clam) {
//         const isInfected = await clam.isInfected(tempPath);

//         if (isInfected) {
//           await fs.unlink(tempPath);
//           return res.status(400).json({
//             message: "File contains malware"
//           });
//         }
//       }

//       // CONVERT
//       let finalBuffer = buffer;

//       if (detectedType.mime !== "application/pdf") {
//         finalBuffer = await convertoPDF(buffer);
//       }

//       // UPLOAD
//       const upload = await uploadToCloudinary(
//         finalBuffer,
//         `${Date.now()}-book`
//       );

//       fileUrl = upload.secure_url + "?fl_attachment";
//       fileType = "file";

//       await fs.unlink(tempPath);
//     }

//     /* =========================
//        LINK HANDLING
//     ========================= */

//     if (fileLink) {
//       if (typeof fileLink !== "string" || fileLink.trim() === "") {
//         return res.status(400).json({
//           message: "Only a valid HTTPS link is allowed"
//         });
//       }

//       let cleanUrl;

//       try {
//         cleanUrl = new URL(fileLink.trim());
//       } catch {
//         return res.status(400).json({
//           message: "Invalid URL format"
//         });
//       }

//       if (cleanUrl.protocol !== "https:") {
//         return res.status(400).json({
//           message: "Only HTTPS links allowed"
//         });
//       }

//       fileUrl = cleanUrl.href;
//       fileType = "link";
//     }

//     /* =========================
//        SAVE
//     ========================= */

//     const book = new Book({
//       title: title.trim(),
//       author: author?.trim() || "",
//       description: description
//         ? sanitizeHtml(description, {
//             allowedTags: [],
//             allowedAttributes: {}
//           })
//         : "",
//       fileUrl,
//       fileType,
//       user: req.user?.id
//     });

//     await book.save();

//     res.status(201).json(book);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

// /* =========================
//    GET BOOKS
// ========================= */

// export const getBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ user: req.user.id }).sort({
//       createdAt: -1
//     });

//     res.json(books);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

// /* =========================
//    UPDATE BOOK
// ========================= */

// export const updateBook = async (req, res) => {
//   try {
//     const { title, author, description, fileLink } = req.body;

//     const book = await Book.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({
//         message: "Book not found"
//       });
//     }

//     /* =========================
//        UPDATE TEXT
//     ========================= */

//     if (title) {
//       if (!textRegex.test(title.trim())) {
//         return res.status(400).json({
//           message: "Invalid title"
//         });
//       }
//       book.title = title.trim();
//     }

//     if (author) {
//       if (!textRegex.test(author.trim())) {
//         return res.status(400).json({
//           message: "Invalid author"
//         });
//       }
//       book.author = author.trim();
//     }

//     if (description) {
//       if (!descriptionRegex.test(description.trim())) {
//         return res.status(400).json({
//           message: "Invalid description"
//         });
//       }

//       book.description = sanitizeHtml(description, {
//         allowedTags: [],
//         allowedAttributes: {}
//       });
//     }

//     /* =========================
//        FILE UPDATE + SCAN
//     ========================= */

//     if (req.file) {
//       const buffer = req.file.buffer;

//       const detectedType = await fileTypeFromBuffer(buffer);

//       if (!detectedType) {
//         return res.status(400).json({
//           message: "Unable to detect file type"
//         });
//       }

//       if (!allowedRealMimeTypes.includes(detectedType.mime)) {
//         return res.status(400).json({
//           message: "Invalid file type"
//         });
//       }

//       const tempPath = path.join(
//         os.tmpdir(),
//         `${Date.now()}-${req.file.originalname}`
//       );

//       await fs.writeFile(tempPath, buffer);

//       const clam = await initClamAV();
//       console.log("ClamAV initialized for update:", !!clam);

//       if (process.env.ENABLE_VIRUS_SCAN === "true" && clam) {
//         const isInfected = await clam.isInfected(tempPath);

//         if (isInfected) {
//           console.log("File is infected");
//           await fs.unlink(tempPath);
//           return res.status(400).json({
//             message: "File contains malware"
//           });
//         }
//       }

//       let finalBuffer = buffer;

//       if (detectedType.mime !== "application/pdf") {
//         finalBuffer = await convertoPDF(buffer);
//       }

//       const upload = await uploadToCloudinary(
//         finalBuffer,
//         `${Date.now()}-book`
//       );

//       book.fileUrl = upload.secure_url + "?fl_attachment";
//       book.fileType = "file";
//       book.fileLink = null;

//       await fs.unlink(tempPath);
//     }

//     /* =========================
//        LINK UPDATE
//     ========================= */

//     if (fileLink) {
//       let url;

//       try {
//         url = new URL(fileLink.trim());
//       } catch {
//         return res.status(400).json({
//           message: "Invalid URL"
//         });
//       }

//       if (url.protocol !== "https:") {
//         return res.status(400).json({
//           message: "Only HTTPS allowed"
//         });
//       }

//       book.fileLink = url.href;
//       book.fileUrl = null;
//       book.fileType = "link";
//     }

//     await book.save();

//     res.json(book);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };




import Book from "../models/book.js";
import { convertoPDF } from "../config/convert.js";
import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
import sanitizeHtml from "sanitize-html";
import { fileTypeFromBuffer } from "file-type";

import ClamScan from "clamscan";
import fs from "fs/promises";
import path from "path";
import os from "os";

/* =========================
   CONFIG
========================= */

const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
const textRegex = /^[A-Za-z0-9\s.,'-]+$/;

const allowedRealMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png"
];

/* =========================
   CLAMAV INIT (STRICT)
========================= */

const initClamAV = async () => {
  try {
    const clam = await new ClamScan().init({
      preference: "clamscan",
      clamscan: {
        path: "/usr/bin/clamscan",
        active: true
      }
    });
    console.log("ClamAV initialized successfully");

    return clam;
  } catch (err) {
    console.warn("ClamAV not available - skipping scan");
    return null; // NEVER throw
  }
};

/* =========================
   SAFE PDF CONVERSION
========================= */

const convertWithTimeout = async (buffer, timeoutMs = 10000) => {
  return Promise.race([
    convertoPDF(buffer),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Conversion timeout")), timeoutMs)
    )
  ]);
};

/* =========================
   CREATE BOOK
========================= */

export const createBook = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, author, description, fileLink } = req.body;

    if (!title || typeof title !== "string" || !textRegex.test(title.trim())) {
      return res.status(400).json({ message: "Invalid title" });
    }

    let fileUrl = null;
    let fileType = null;

    /* ========= FILE ========= */
    if (req.file) {
      const buffer = req.file.buffer;
      const detected = await fileTypeFromBuffer(buffer);

      if (!detected || !allowedRealMimeTypes.includes(detected.mime)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      const tempPath = path.join(
        os.tmpdir(),
        `${Date.now()}-${req.file.originalname}`
      );

      let clam;
      try {
        await fs.writeFile(tempPath, buffer);

        clam = await initClamAV();

        if (process.env.ENABLE_VIRUS_SCAN === "true"&& clam) {
          console.log("ClamAV initialized for create:", !!clam);
          const infected = await clam.isInfected(tempPath);
          if (infected) {
            console.log("Malware detected in uploaded file");
            return res.status(400).json({ message: "Malware detected" });
          }
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
      } finally {
        await fs.unlink(tempPath).catch(() => {});
      }
    }

    /* ========= LINK ========= */
    if (fileLink) {
      let url;
      try {
        url = new URL(fileLink.trim());
      } catch {
        return res.status(400).json({ message: "Invalid URL" });
      }

      if (url.protocol !== "https:") {
        return res.status(400).json({ message: "HTTPS only" });
      }

      fileUrl = url.href;
      fileType = "link";
    }

    const book = await Book.create({
      title: title.trim(),
      author: author?.trim() || "",
      description: description
        ? sanitizeHtml(description, { allowedTags: [], allowedAttributes: {} })
        : "",
      fileUrl,
      fileType,
      user: req.user.id
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET BOOKS
========================= */

export const getBooks = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const books = await Book.find({ user: req.user.id }).sort({
      createdAt: -1
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE BOOK (SECURE)
========================= */

export const updateBook = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, author, description, fileLink } = req.body;

    // ✅ FIXED: ownership check
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({ message: "Not found" });
    }

    if (title && textRegex.test(title.trim())) {
      book.title = title.trim();
    }

    if (author && textRegex.test(author.trim())) {
      book.author = author.trim();
    }

    if (description && descriptionRegex.test(description.trim())) {
      book.description = sanitizeHtml(description, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }

    /* ========= FILE ========= */
    if (req.file) {
      const buffer = req.file.buffer;
      const detected = await fileTypeFromBuffer(buffer);

      if (!detected || !allowedRealMimeTypes.includes(detected.mime)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      const tempPath = path.join(
        os.tmpdir(),
        `${Date.now()}-${req.file.originalname}`
      );

      try {
        await fs.writeFile(tempPath, buffer);

        const clam = await initClamAV();

        if (process.env.ENABLE_VIRUS_SCAN === "true"&&clam) {
          console.log("ClamAV initialized for update:", !!clam);
          const infected = await clam.isInfected(tempPath);
          if (infected) {
            console.warn("Malware detected in uploaded file");
            return res.status(400).json({ message: "Malware detected" });
          }
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
      } finally {
        await fs.unlink(tempPath).catch(() => {});
      }
    }

    /* ========= LINK ========= */
    if (fileLink) {
      let url;
      try {
        url = new URL(fileLink.trim());
      } catch {
        return res.status(400).json({ message: "Invalid URL" });
      }

      if (url.protocol !== "https:") {
        return res.status(400).json({ message: "HTTPS only" });
      }

      book.fileUrl = url.href;
      book.fileType = "link";
    }

    await book.save();
    res.json(book);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};