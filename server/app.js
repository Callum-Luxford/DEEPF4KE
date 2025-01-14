// MODULES
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const authenticateUser = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const { startCleanupTask } = require("../server/controllers/cleanupController");

// Start the cleanup task
startCleanupTask();


// INIT SERVER
const app = express();

// START CLEANUP TASK
startCleanupTask(); // Start the periodic cleanup

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(cookieParser());

app.use(authenticateUser); // Populate req.user
app.use((req, res, next) => {
  console.log("Middleware - req.user:", req.user); // Debug req.user
  res.locals.user = req.user || null; // Assign `null` if no user is logged in
  console.log("Middleware - res.locals.user:", res.locals.user); // Debug res.locals.user
  next();
});

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));

app.set("view cache", false);

// USE EXPRESS-EJS-LAYOUTS
app.use(expressLayouts);
app.set("layout", "layouts/main");

// DATABASE CONNECTION
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ROUTES
app.use("/", require("./routes/pages")); // Static pages
app.use("/auth", require("./routes/auth")); // Login/signup routes
app.use("/dashboard", require("./routes/dashboard")); // Dashbaord
app.use("/upload", require("./routes/upload")); // Upload routes
app.use("/process", require("./routes/process")); // Process routes


// UPLOADS STATIC PATH
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SERVER START
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
