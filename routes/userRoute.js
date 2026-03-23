const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//indexPage
router.get("/", async (req, res) => {
  res.render("home");
});

// Candidates Page
router.get("/candidatesPage", async (req, res) => {
  res.render("candidates");
});

//signUp
router.get("/signUpPage", async (req, res) => {
  res.render("signUp");
});

//signup logic
router.post("/signup", async (req, res) => {
  const { name, age, email, mobile, address, aadharCardNumber, password } =
    req.body;

  try {
    // 🔍 Check if user already exists (you can check by email or Aadhaar)
    const existingUser = await User.findOne({
      $or: [{ email: email }, { aadharCardNumber: aadharCardNumber }],
    });

    if (existingUser) {
      return res.send("User already exists!");
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      age,
      email,
      mobile,
      address,
      aadharCardNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

//userPage
router.get("/userPage", async (req, res) => {
  res.render("user");
});

//login
router.get("/login", async (req, res) => {
  res.render("login");
});

//login logic
router.post("/login", async (req, res) => {
  const { aadharCardNumber, password } = req.body;
  try {
    const user = await User.findOne({ aadharCardNumber });
    console.log(user);
    if (!user) {
      return res.send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Invalid Password");
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
