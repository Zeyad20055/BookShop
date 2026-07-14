const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cookAuth } = require("../auth/middleware");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
        role: newUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1w" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const role = user.role || "user";

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1w" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectPath = role === "admin" ? "/admin" : "/";

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Signin successfully",
      token,
      user: userData,
      role,
      redirect: redirectPath,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/verify",cookAuth,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User verified successfully",
      user:{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
message:"invalid token"    });
    
  }

});
router.post("/logout",  (req, res) => {
  try {
    res.clearCookie("token" ,{


      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
sameSite: "lax",   });
res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});


// Get User By ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
