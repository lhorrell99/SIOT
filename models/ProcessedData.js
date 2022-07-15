import mongoose from "mongoose";

// never used to create docs, just used to retrieve data processed with python
const processedDataSchema = new mongoose.Schema({});

// assign model if not assigned already
export default mongoose.models.ProcessedData ||
  mongoose.model("ProcessedData", processedDataSchema);
