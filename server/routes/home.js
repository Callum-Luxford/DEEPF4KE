const express = require("express");
const router = express.Router();
const particles = require("particles.js");

router.get("/", (req, res) => {
  console.log("res.locals.user:", res.locals.user); // Debugging
  res.render("home", {
    layout: "layouts/main",
    title: "Home - Deepf4ke Web App",
    // user: res.locals.user,
  });
});

module.exports = router;
