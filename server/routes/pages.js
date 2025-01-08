const express = require("express");
const router = express.Router();

// Static Pages
router.get("/", (req, res) => {
  console.log("Pages Route - res.locals.user:", res.locals.user);
  res.render("home", {
    layout: "layouts/main",
    title: "Home",
  });
});
router.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main",
    title: "About Us",
  });
});
router.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main",
    title: "Contact Us",
  });
});

module.exports = router;
