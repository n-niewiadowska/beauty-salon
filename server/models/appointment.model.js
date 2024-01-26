const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: {
    type: Date,
    validate: {
      validator: function(value) {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        return value > threeDaysFromNow;
      },
      message: "Appointment date must be at least 3 days in the future."
    },
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    enum: ["Booked", "Confirmed", "Accepted"],
    default: "Booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);