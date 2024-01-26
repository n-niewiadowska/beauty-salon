const express = require("express");
const Service = require("../models/service.model.js");
const { verify, verifyRole } = require("../middleware/verify.js");

const router = express.Router();

// get all services (possibility of filtering by name and/or category and sorting by name or price)
router.get("/", async (req, res) => {
  try {
    let query = {};

    if (req.query.name) {
      query.name = { $regex: new RegExp(req.query.name, "i") };
    }

    if (req.query.category) {
      query.category = { $regex: new RegExp(req.query.category, "i") };
    }

    let sort = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split("_");
      sort[field] = order === "asc" ? 1 : -1;
    }

    let services = await Service.find(query).sort(sort);

    if (!services || services.length === 0) {
      return res.status(404).send("Service not found");
    }

    res.status(200).send(services);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get service by id
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById({_id: req.params.id});

    if (!service) {
      return res.status(404).send("Service not found");
    }

    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ADMIN

// add a new service
router.post("/new", verify, verifyRole, async (req, res) => {
  try {
    const existingService = await Service.find({ name: req.body.name });

    if (existingService.length > 0) {
      res.status(404).send("This service already exists.")
    }

    const service = new Service(req.body);
    await service.save();

    res.status(200).send(service);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// update service
router.put("/:id", verify, verifyRole, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!service) {
      return res.status(404).send("Service not found");
    }

    res.status(200).send(`Service updated successfully:\n ${service}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// delete service
router.delete("/:id", verify, verifyRole, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id});

    if (!service) {
      return res.status(404).send("Service not found");
    }

    res.status(200).send("Service deleted successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;