const express = require("express");
const router = express.Router();
const Book = require("../models/BookSchema");
const multer = require("multer");
const { auth } = require("../auth/middleware");

// ================= IMAGE UPLOAD =================

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

// ================= CREATE BOOK =================

router.post(
  "/createBook",
  auth("admin"),
  upload.single("coverImage"),

  async (req, res) => {
    try {
      const { title, author, description, price, stock, isFeatured, isOnSale, discountPercentage, category } = req.body;

      if (!title || !author || !description || !price) {
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

        isFeatured: isFeatured === "true",

        isOnSale: isOnSale === "true",

        discountPercentage: discountPercentage || "0",

        category,

        // حفظ اسم الصورة في قاعدة البيانات
        coverImage: req.file ? req.file.filename : "",
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
  },
);

// ================= GET ALL BOOKS =================

router.get("/getBooks", async (req, res) => {
  try {
    const books = await Book.find().populate("category", "name");

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= GET ONE BOOK =================

router.get("/getBook/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name");

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= UPDATE BOOK =================

router.put(
  "/updateBook/:id",

  auth("admin"),

  upload.single("coverImage"),

  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      book.title = req.body.title;

      book.author = req.body.author;

      book.description = req.body.description;

      book.price = req.body.price;

      book.stock = req.body.stock;

      book.category = req.body.category;

      book.discountPercentage = req.body.discountPercentage || "0";

      book.isFeatured = req.body.isFeatured === "true";

      book.isOnSale = req.body.isOnSale === "true";

      // لو رفع صورة جديدة حدثها
      if (req.file) {
        book.coverImage = req.file.filename;
      }

      await book.save();

      res.json({
        message: "Book updated successfully",

        book,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },
);

// ================= DELETE BOOK =================

router.delete(
  "/delateBook/:id",

  async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);

      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      res.json({
        message: "Book deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = router;
