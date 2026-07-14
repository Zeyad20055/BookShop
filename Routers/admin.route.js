const express = require("express");
const router = express.Router();
const Book = require("../models/BookSchema");
const multer = require("multer");
const {auth} = require("../auth/middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "_" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/createBook",auth("admin"), upload.single("coverImage"), async (req, res) => {
  try {
    const { title, author, description, price, stock, isFeautured, isOnSale, category } = req.body;

    if (!title || !author || !description || !price || !stock) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newBook = new Book({
      title,
      author,
      description,
      price,
      stock,
      isFeautured,
      isOnSale,
      category,
      coverImage: req.file?.filename,
    });

    await newBook.save();

    return res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/getBooks",auth("admin"), async (req, res) => {
  try {
    const books = await Book.find().populate("category", "name"); // populate the category field
    return res.json(books);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name");
    if (!book) {
      return res.status(404).json({ massage: "book not found" });
    }
    return res.json(book);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/updateBook/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true }).populate("category", "name");
    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    return res.json({ massage: "book updated successfully", book });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/delateBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    return res.json({ massage: "book deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
