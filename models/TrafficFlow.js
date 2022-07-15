import mongoose from "mongoose";

const trafficFlowSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  alt: Number,
  timestamp: { type: Date, default: Date.now() },
  frc: String,
  currentSpeed: Number,
  freeFlowSpeed: Number,
  currentTravelTime: Number,
  freeFlowTravelTime: Number,
  confidence: Number,
  roadClosure: Boolean,
});

// assign model if not assigned already
export default mongoose.models.TrafficFlow ||
  mongoose.model("TrafficFlow", trafficFlowSchema);
