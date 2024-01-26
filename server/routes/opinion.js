const express = require("express");
const { getClient } = require("../server");
const Opinion = require("../models/opinion.model");

const router = express.Router();
const client = getClient();

const calculateAverageRating = async () => {
  return await Opinion.aggregate([
    { $group: {
      _id: null,
      rating: { $avg: "$rate" }
    }},
    { $project: {
      _id: 0,
      rating: { $round: ["$rating", 2] }
    }}
  ]);
}

// adding opinions about this salon (using MQTT) and changes rating
router.post("/new", async (req, res) => {
  const opinion = new Opinion(req.body);

  try {
    const savedOpinion = await opinion.save();

    client.publish("opinions", JSON.stringify(savedOpinion));

    const averageRating = await calculateAverageRating();

    client.publish("opinions/rating", JSON.stringify(averageRating[0]), (err) => {
      if (err) {
        console.log(`Error publishing to opinions: ${err}`);
      } else {
        console.log('Successfully published to opinions');
      }
    });
    
    res.status(200).send(savedOpinion);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// getting opinions sorted from the latest to the oldest
router.get("/all", async (req, res) => {

  try {
    const opinions = await Opinion.find()
      .sort({ timestamp: -1 })

    res.status(200).json(opinions);
  } catch (error) {
    res.status(500).send(error.message)
  }
});

// get average rating from the opinions (the initial value)
router.get("/rating", async (req, res) => {
  try {
    const averageRating = await calculateAverageRating();

    res.status(200).send(averageRating[0]);
  } catch (error) {
    res.status(500).send(error.message)
  }
});

module.exports = router;