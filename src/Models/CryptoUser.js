const mongoose = require("mongoose");
const cryptoUser = new mongoose.Schema({
  Address: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
  },
});

module.exports = mongoose.model("cryptoUser", cryptoUser);
