const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["sedan", "suv", "hatchback", "convertible", "truck", "other"],
  },
  color: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  registrationNo: {
    type: String,
    required: true,
    unique: true,
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
