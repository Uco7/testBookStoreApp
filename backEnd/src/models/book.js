import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    description: { type: String },
    fileUrl: { type: String },        // uploaded file URL
    fileType: { type: String },
    originalFormat: { type: String },
    fileLink: { type: String },       // external link
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema); 
