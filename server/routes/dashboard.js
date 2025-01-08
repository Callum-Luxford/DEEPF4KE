const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");

// Dashbaord routes
router.get("/", authenticateUser, (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  console.log("Dashboard Route - User:", req.user);
  res.render("dashboard", {
    layout: "layouts/main",
    title: "Dashboard",
    user: res.locals.user,
  });
});

module.exports = router;
