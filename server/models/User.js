// MODULES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// DEFINE USER SCHEMA
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// HASH PASSWORD BEFORE SAVING (MIDDLEWARE)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// COMPARE PASSWORD FOR LOGIN
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Candidate Password:", candidatePassword);
  console.log("Stored Password:", this.password);
  return bcrypt.compare(candidatePassword, this.password);
};

// EXPORT USER MODEL
module.exports = mongoose.model("User", userSchema);
