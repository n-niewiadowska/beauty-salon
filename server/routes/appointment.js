const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const { verify, verifyRole } = require("../middleware/verify");
const Appointment = require("../models/appointment.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const { getClient } = require("../server");

const router = express.Router();
const client = getClient();

// USER:

// book an appointment
router.post("/new", verify, async (req, res) => {
  try {
    const service = await Service.findOne({ name: req.body.serviceName });

    if (!service) {
      return res.status(404).send("Service not found.");
    }

    if (!service.availability) {
      return res.status(400).send("This service is currently not available.");
    }

    const date = new Date(req.body.date);

    if (date.getDay() === 0 || date.getDay() === 6) {
      return res.status(400).send("You cannot schedule an appointment on weekends.");
    }

    const hours = date.getHours();

    if (hours < 8 || hours >= 17) {
      return res.status(400).send("You can only schedule appointments between 8 AM and 5 PM.");
    }

    const existingAppointment = await Appointment.findOne({ date: req.body.date });
    
    if (existingAppointment) {
      return res.status(400).send("This date is booked.");
    }

    const appointment = new Appointment({
      service: service._id,
      user: req.user.id,
      date: req.body.date,
      duration: service.lengthInMinutes,
      price: service.price
    });

    const savedAppointment = await appointment.save();

    fs.appendFile("logs.txt", 
      `${new Date().toLocaleString()} : User ${req.user.nickname} booked an appointment.\n`,
      (error) => {
        if (error) {
          console.log(error);
        }
      });

    res.status(200).send(savedAppointment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all booked appointments (necessary for a calendar)
router.get("/booked", verify, async (req, res) => {
  try {
    const appointments = await Appointment.find();

    const booked = appointments.map(appointment => ({
      start: appointment.date,
      end: new Date(appointment.date.getTime() + appointment.duration * 60000)
    }));
  
    res.status(200).json(booked);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get the history of user's appointments
router.get("/user/all", verify, async (req, res) => {
  try {
    const sort = req.query.sort === "asc" ? 1 : -1;
    const appointments = await Appointment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      { $unwind: "$service" },
      { $sort: { createdAt: sort } },
      {
        $project: {
          _id: 1,
          date: 1,
          state: 1,
          serviceName: "$service.name",
          duration: 1,
          price: 1
        }
      }
    ]);

    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get an appointment by id
router.get("/:id", verify, async (req, res) => {
  try {
    const appointment = await Appointment.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      { $unwind: "$service" },
      {
        $project: {
          _id: 1,
          date: 1,
          state: 1,
          serviceName: "$service.name",
          duration: 1,
          price: 1
        }
      }
    ]);

    res.status(200).send(appointment[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit an appointment
router.put("/:id/edit", verify, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).send("Appointment not found.");
    }

    if (appointment.state === "Accepted") {
      return res.status(403).send("You cannot edit an appointment accepted by admin.");
    }

    const fieldsToUpdate = {};

    if (req.body.serviceName) {
      const service = await Service.findOne({ name: req.body.serviceName });
      if (!service) {
        return res.status(404).send("Service not found.");
      }
      fieldsToUpdate.service = service._id;
    }

    if (req.body.date) {
      fieldsToUpdate.date = req.body.date;
    }

    await Appointment.updateOne(
      { _id: req.params.id, user: req.user.id },
      fieldsToUpdate
    );

    res.status(200).send("Appointment updated.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Confirm an appointment
router.put("/:id/confirm", verify, async (req, res) => {
  try {
    const appointment = await Appointment.findOne(
      { _id: new mongoose.Types.ObjectId(req.params.id), user: new mongoose.Types.ObjectId(req.user.id) }
    );

    if (!appointment) {
      return res.status(404).send("No appointment found.");
    }

    if (appointment.state === "Accepted") {
      return res.status(403).send("You cannot confirm an already accepted appointment.");
    }

    appointment.state = "Confirmed";
    await appointment.save();

    client.publish("appointments/stateUpdate", JSON.stringify({
      appointmentId: appointment._id,
      newState: appointment.state
    }));

    res.status(200).send("Appointment confirmed.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an appointment
router.delete("/:id/delete", verify, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).send("Appointment not found.");
    }

    if (appointment.state === "Accepted") {
      return res.status(403).send("You cannot delete an appointment accepted by admin.");
    }
    const deletedAppointment = await Appointment.findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.params.id), user: new mongoose.Types.ObjectId(req.user.id) }
    );

    if (!deletedAppointment) {
      return res.status(404).send("Appointment not found.");
    }

    fs.appendFile("logs.txt", 
      `${new Date().toLocaleString()} : User ${req.user.nickname} deleted the appointment ${deletedAppointment._id}.\n`,
      (error) => {
        if (error) {
          console.log(error);
        }
      });

    res.status(200).send(`Appointment deleted successfully:\n ${deletedAppointment}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ADMIN

// Show all appointments
router.get("/admin/all", verify, verifyRole, async (req, res) => {
  try {
    const sort = req.query.sort === "asc" ? 1 : -1;
    const appointments = await Appointment.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$service" },
      { $unwind: "$user" },
      { $sort: { createdAt: sort } },
      {
        $project: {
          _id: 1,
          date: 1,
          state: 1,
          serviceName: "$service.name",
          userName: "$user.name",
          userSurname: "$user.surname",
          duration: 1,
          price: 1
        }
      }
    ]);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// Accept an appointment
router.put("/:id/accept", verify, verifyRole, async (req, res) => {
  try {
    const updateResult = await Appointment.updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { state: "Accepted" }
    );

    if (updateResult.nModified == 0) {
      return res.status(404).send("No appointment found.");
    }

    const updatedAppointment = await Appointment.findById(req.params.id);

    client.publish("appointments/stateUpdate", JSON.stringify({
      appointmentId: updatedAppointment._id,
      newState: updatedAppointment.state
    }));

    res.status(200).send(updatedAppointment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Edit a user's appointment
router.put("/admin/:id/edit", verify, verifyRole, async (req, res) => {
  try {
    const fieldsToUpdate = {};

    if (req.body.serviceName) {
      const service = await Service.findOne({ name: req.body.serviceName });
      if (!service) {
        return res.status(404).send("Service not found.");
      }
      fieldsToUpdate.service = service._id;
    }

    if (req.body.date) {
      fieldsToUpdate.date = req.body.date;
    }

    const updatedAppointment = await Appointment.updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      fieldsToUpdate
    );

    if (updatedAppointment.nModified == 0) {
      return res.status(404).send("No appointment found.");
    }

    res.status(200).send("Appointment updated.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a user's appointment
router.delete("/admin/:id/delete", verify, verifyRole, async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.params.id) }
    );

    if (!deletedAppointment) {
      return res.status(404).send("Appointment not found.");
    }

    res.status(200).send(`Appointment deleted successfully:\n ${deletedAppointment}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get statistics for all clients
router.get("/admin/statistics", verify, verifyRole, async (req, res) => {
  try {
    const generalStats = await Appointment.aggregate([
      { $group: {
        _id: null,
        totalAppointments: { $sum: 1 },
        avgTime: { $avg: "$duration" },
        totalPrice: { $sum: "$price" },
        avgPrice: { $avg: "$price" }
      }},
      { $project: {
        _id: 0,
        totalAppointments: 1,
        avgTime: { $round: ["$avgTime", 2] },
        totalPrice: 1,
        avgPrice: { $round: ["$avgPrice", 2] }
      }}
    ]);

    const categoryStats = await Appointment.aggregate([
      { $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service"
      }},
      { $unwind: "$service" },
      { $group: {
        _id: "$service.category",
        categoryCount: { $sum: 1 }
      }},
      { $sort: {
        categoryCount: -1 
      }},
      { $project: {
        _id: 0,
        category: "$_id",
        categoryCount: 1
      }}
    ]);

    res.status(200).json({ generalStats, categoryStats });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get statistics for a single client
router.get("/admin/statistics/:nickname", verify, verifyRole, async (req, res) => {
  try {
    const user = await User.findOne({ nickname: req.params.nickname });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const stats = await Appointment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user._id) } },
      { $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }},
      { $unwind: "$user" },
      { $group: {
        _id: "$user.nickname",
        totalAppointments: { $sum: 1 },
        avgTime: { $avg: "$duration" },
        totalPrice: { $sum: "$price" },
        avgPrice: { $avg: "$price" },
        lastAppointment: { $max: "$date" }
      }},
      { $project: {
        _id: 0,
        nickname: "$_id",
        totalNumberOfAppointments: "$totalAppointments",
        averageTime: { $round: ["$avgTime", 2] },
        totalPrice: "$totalPrice",
        averagePrice: { $round: ["$avgPrice", 2] },
        lastAppointmentDate: "$lastAppointment"
      }}
    ]);

    if (stats.length === 0) {
      return res.status(404).send("No appointments found for this user.");
    }

    res.status(200).send(stats[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;