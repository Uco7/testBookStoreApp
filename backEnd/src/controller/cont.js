import Book from "../models/book.js"
import { updateBook } from "./bookController"
export const uploadBook= async(req,res)=>{
    if(!req.file)return res.status(400).json({message:"no file object"})
        const  {title,author,desription}=req.body
    if(!title||!author||!desription)return console.log("some formdata are missing",title,author,desription)
    const fileUrl=`${req.protocol}://${req.get("host")}/uploads${req.file.filename}`
console.log("fileUrl",fileUrl)
try {
    
    const book=await Book.create({
        title,author,desription,fileUrl,
        type:file.type||file.mimeType||`application/pdf`,
        name:file.nmae
    })
    if(book){
        console.log("newBook:",book)
        return res.status(200).json(book)
    }
    console.log("failed to create book")
} catch (error) {
    console.log("error:",error)
    res.status(500).json({message:error.message})
    
}

    }
    export const getBooks= async(req,res)=>{
        console.log("req.user in getbook=",req.user,req.user.id)
        if(!req.user||!req.user.id){
            console.log("no req.user or req.user.id",req.user,req.user.id)
            return res.status(401).json({message:"missing auth parameter"})}
            try {
                const books=await Book.find({user:req.user.id})
                if(!books){
                    console.log("no book data=",books);
                    return res.status(404).json({message:"null book data"})
                }
                console.log("user books=",books)
                res.json(books)
                
            } catch (error) {
                console.log("error",error)
                res.status(500).json({message:error.message})
                
            }
            }
            export const deleteBoook=async(req,res)=>{

                if(!req.user||!req.user.id){
            console.log("no req.user or req.user.id",req.user,req.user.id)

            return res.status(401).json({message:"missing auth parameter"})}
            const {id}=req.params
            if(!id) return res.status(400).json({message:"missing params paramiters"})
            try {
                const book=await Book.findOne({_id:id,user:req.user.id})
                if(!book)return res.status(404).json({message:"paramiters might be null"})
                const isDelete=await Book.deleteOne({_id:book._id})
            if(!isDelete){
                console.log("book deletiton error")
            }
            console.log("book deleted successfully")
            res.status(200).json({message:"book deleted"})
            } catch (error) {
                 console.log("error",error)
                res.status(500).json({message:error.message})
                
                
            }
            }
   export  const updateBook=async(req,res)=>{
    const {id}=req.params
    if(!id)return res.status(400).json({message:"missing paramiters"})
        if(!req.user||!req.user.id){
            console.log("no req.user or req.user.id",req.user,req.user.id)  
            return res.status(401).json({message:"missing auth parameter"})
        }
    const    {title,author,desription}=req.body

   }
