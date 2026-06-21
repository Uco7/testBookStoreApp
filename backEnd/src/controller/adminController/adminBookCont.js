import Book from "../../models/book.js";
import userTimetable from "../../models/userTimetable.js";

export const getAllUploadedBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .populate(
  "user",
  "username email fullName premium"
)

    const booksWithTimetable = await Promise.all(
      books.map(async (book) => {
        const timetable = await userTimetable.findOne({
          user: book.user?._id,
        });

        return {
          ...book.toObject(),
          hasTimetable: !!timetable,
        };
      })
    );

    res.status(200).json(booksWithTimetable);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// import Book from "../../models/book.js";

// export const getAllUploadedBooks = async (req, res) => {
//     try {
//         // 1. Correctly chain find, sort (newest first), and populate user fields
//         const uploadedFiles = await Book.find()
//             .sort({ createdAt: -1 })
//             .populate("user", "username email fullName"); // Grabs only safe public fields

//         // 2. Check if the array is empty (Mongoose find() returns [] if no data exists)
//         if (uploadedFiles.length === 0) {
//             return res.status(404).json({
//                 message: "No uploaded files found"
//             });
//         }

//         // 3. Log success and return the populated files to your dashboard
//         console.log("Uploaded files with user profiles fetched successfully.");
//         return res.status(200).json(uploadedFiles);

//     } catch (err) {
//         console.error("Error inside getAllUploadedBooks:", err);
        
//         return res.status(500).json({
//             message: err.message || "Internal server error"
//         });
//     }
// };


/* ---------- Get Single Book by ID with Uploader Info ---------- */
export const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the book by its ID and populate the uploader's safe data fields
        const book = await Book.findById(id).populate("user", "username email fullName");

        if (!book) {
            return res.status(404).json({
                message: "Book record not found"
            });
        }

        res.status(200).json(book);

    } catch (err) {
        console.error("Get Single Book Error:", err);

        // Handle poorly formatted MongoDB ObjectIds gracefully
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid Book ID format" });
        }

        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};

/* ---------- Delete Book by ID ---------- */
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the book file reference from your collection
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found or already deleted"
            });
        }

        res.status(200).json({
            message: `The book titled '${deletedBook.title}' has been successfully deleted.`
        });

    } catch (err) {
        console.error("Delete Book Error:", err);

        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid Book ID format" });
        }

        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};