import mongoose from "mongoose";

const trafficIncidentSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  alt: Number,
  incident: Boolean,
  timestamp: { type: Date, default: Date.now() },
  iconCategory: Number,
  magnitudeOfDelay: Number,
  length: Number,
  delay: Number,
});

// assign model if not assigned already
export default mongoose.models.TrafficIncident ||
  mongoose.model("TrafficIncident", trafficIncidentSchema);
