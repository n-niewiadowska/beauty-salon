const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  category: {
    type: String,
    enum: ["Facial treatments", "Manicure and pedicure", "Massage", "Hair removal", "Make up"],
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    min: [10, "The price must be at least 10"],
    required: true
  },
  lengthInMinutes: {
    type: Number,
    min: [5, "Length of the service must be longer than 5 minutes"],
    max: [300, "Length of the service must be shorter than 300 minutes"],
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Service", ServiceSchema);