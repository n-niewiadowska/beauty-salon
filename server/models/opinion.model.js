const mongoose = require("mongoose");

const OpinionSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous"
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  description: String,
  timestamp: {
    type: Date,
    default: () => new Date()
  }
});

module.exports = mongoose.model("Opinion", OpinionSchema);