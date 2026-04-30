// import cloudinary from "./cloudinary.js";

// export const uploadToCloudinary = (buffer, filename) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw", // ✅ IMPORTANT FIX
//         public_id: filename,
//         folder: "BookStoreApp",
//         access_mode: "public", // ✅ prevents ACL/401 issues
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     ).end(buffer);
//   });
// };



// import { response } from "express";

import cloudinary from "./cloudinary.js";
export const uploadToCloudinary=(buffer,filename)=>{
  const respons=new Promise((resolve,reject)=>{
    cloudinary.uploader.upload_stream({
      resource_type:"raw",
      public_id:filename,
      folder:"BookStoreApp",
      access_mode:"public",

    },
    (error,result)=>{
      if(error)return reject(error);
      resolve(result)
    }
   
    
  
  ).end(buffer)
  
})
console.log("response from upload stram to cloadnary",respons)
return respons

}

