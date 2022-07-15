import mongoose from "mongoose";

const pmSensorSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  pm1_0: Number,
  pm2_5: Number,
  pm10_0: Number,
});

// assign model if not assigned already
export default mongoose.models.PMSensor ||
  mongoose.model("PMSensor", pmSensorSchema);
