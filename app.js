import express from "express";
import mqtt from "mqtt";
import mongoose from "mongoose";
import controllers from "./controllers.js";
import config from "./config.js";

const port = config.port || 8080;
const app = express();

// mongoDB
mongoose.connect(config.databaseURL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to database"));

// mqtt client
const client = mqtt.connect({
  clientId: "siot-server",
  host: "de4-siot.cloud.shiftr.io",
  port: config.mqttPort,
  username: config.mqttUsername,
  password: config.mqttPassword,
  keepalive: 120,
});

client.on("connect", function () {
  client.subscribe("#"); // subscribe to all topics
});

client.on("message", controllers.onMQTT);

// express
app.use("/", express.static("public")); // serve static content

app.get("/download/:collection", controllers.download);

app.listen(port, function () {
  console.log("listening");
});
