const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mqtt = require("mqtt");
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");

const app = express();
require("dotenv").config({ path: "./config.env" });

Sentry.init({
  dsn: "https://6708d332f5567a40b8cb8e0e6fc7beaf@o4506638833942528.ingest.sentry.io/4506638836891648",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

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
  
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

app.get("/", (req, res) => {
  res.end("This is a Beauty Salon website!");
});

// verifying sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.use((req, res) => {
  res.redirect("https://http.cat/404");
});

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});