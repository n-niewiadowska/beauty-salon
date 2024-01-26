const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mqtt = require("mqtt");

const app = express();
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
const token = process.env.JWT_TOKEN;

const client = mqtt.connect("ws://localhost:8000/mqtt", { keepalive: 120, protocolVersion: 4 });

client.on("connect", () => {
  console.log("MQTT client connected!");
});

const getClient = () => client;

module.exports = { token, getClient };

mongoose.connect(mongoUri)
  .then(() => {
    console.log("MongoDB connection established!");
  })
  .catch(err => console.log(err));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", require("./routes/user"));
app.use("/services", require("./routes/service"));
app.use("/appointments", require("./routes/appointment"));
app.use("/opinions", require("./routes/opinion"));
app.use((req, res) => {
  res.redirect("https://http.cat/404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});