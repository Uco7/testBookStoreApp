import libreoffice from "libreoffice-convert";
import util from "util";

const convert = util.promisify(libreoffice.convert);
if(convert){
   console.log("")
   console.log("convert",convert)
}

export const convertoPDF = async (buffer) => {
  try {
    const pdf= await convert(buffer, ".pdf", undefined);
    if(!pdf){
      console.log("pdf convert faied")
    }
    console.log("pdf converted",pdf)
    return pdf;
  } catch (err) {
    console.error("Conversion failed:", err.message);
    throw err;
  }
};


// import libreoffice from "libreoffice-convert";
// import util from "util";

// const convertAsync = util.promisify(libreoffice.convert);

// export const convertoPDF = async (buffer) => {
//   try {
//     const pdfBuffer = await convertAsync(
//       buffer,
//       ".pdf",
//       undefined
//     );

//     return pdfBuffer;
//   } catch (error) {
//     console.error("PDF conversion failed:", error);
//     return null;
//   }
// };