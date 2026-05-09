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

