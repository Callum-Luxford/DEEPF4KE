// MODULES
const express = require("express");
const { signup, login } = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

// Middleware to redirect logged-in users
const redirectIfAuthenticated = (req, res, next) => {
  if (req.user) {
    console.log("User is authenticated. Redirecting to dashboard...");
    return res.redirect("/dashboard");
  }
  next();
};

// ROUTES
router.get("/signup", redirectIfAuthenticated, (req, res) => {
  console.log("Auth Route - res.locals.user:", res.locals.user);
  res.render("signup", {
    layout: "layouts/main",
    title: "SIGN UP",
  });
});
router.post("/signup", signup);

router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("login", { layout: "layouts/main", title: "LOGIN DETAILS" });
});
router.post("/login", login);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
