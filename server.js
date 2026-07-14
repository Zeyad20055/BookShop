const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// الصور
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/users", require("./Routers/User.route.js"));
app.use("/books", require("./Routers/Book.route.js"));
app.use("/category", require("./Routers/Category.route.js"));
app.use("/admin", require("./Routers/admin.route.js"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🟢`);
});
