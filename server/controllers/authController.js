// MODULES
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// USER SIGN UP
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render("signup", {
        layout: "layouts/main",
        title: "Sign Up",
        error: "Username and password are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).render("signup", {
        layout: "layouts/main",
        title: "Sign Up",
        error: "A user with this username already exists. Please try again.",
      });
    }

    // create new user
    const user = new User({ username, password });
    await user.save();

    // Generate token after signup
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Include username
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1 hour

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message || "Error creating user" });
  }
};

// USER LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("login", {
        layout: "layouts/main",
        title: "Login",
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });
    console.log("User Found:", user);

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render("login", {
        layout: "layouts/main",
        title: "Login",
        error: "Invalid username or password. Please try again.",
      });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Generate the JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Include username
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    // Redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).render("login", {
      layout: "layouts/main",
      title: "Login",
      error: "An unexpected error occurred. Please try again.",
    });
  }
};
