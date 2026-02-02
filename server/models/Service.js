const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String, // Short description for the list view
    content: String,     // Extended content for the detail view (Deprecated)
    pdfUrl: String,      // URL to the uploaded PDF
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
