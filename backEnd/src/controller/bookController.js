import Book from "../models/book.js";

export const uploadBook = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, author, description } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }

    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const fileUrl = `${protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const book = await Book.create({
      title,
      author,
      description,
      fileUrl,
      fileType: req.file.mimetype,
      user: req.user.id,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).sort("-createdAt");
    res.json(books);
  } catch (err) {
    console.error("Fetch books error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({ _id: id, user: req.user.id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.deleteOne({ _id: book._id });

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete book error:", err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};



export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description } = req.body;

    // Find the book belonging to the user
    const book = await Book.findOne({ _id: id, user: req.user.id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update fields if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (description !== undefined) book.description = description;

    // If a new file is uploaded
    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      book.fileUrl = fileUrl;
      book.fileType = req.file.mimetype;
    }

    await book.save();

    res.json(book);
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ message: "Failed to update book" });
  }
};
