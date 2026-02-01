const mongoose = require("mongoose");

const QuoteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    guests: { type: Number, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", QuoteRequestSchema);
