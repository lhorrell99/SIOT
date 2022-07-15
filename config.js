import dotenv from "dotenv";
dotenv.config(); // parse the .env file and assign to process.env

export default {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.DATABASE_URL,
  tomtomApiKey: process.env.TOMTOM_API_KEY,
  mqttPort: process.env.MQTT_PORT,
  mqttUsername: process.env.MQTT_USERNAME,
  mqttPassword: process.env.MQTT_PASSWORD,
};
