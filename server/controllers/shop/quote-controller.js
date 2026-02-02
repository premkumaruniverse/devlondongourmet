const QuoteRequest = require("../../models/QuoteRequest");
const { sendAdminEmail } = require("../../helpers/email");

const addQuoteRequest = async (req, res) => {
  try {
    const { name, email, serviceType, guests, message } = req.body;
    if (!name || !email || !serviceType || !guests) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const quote = new QuoteRequest({ name, email, serviceType, guests, message });
    await quote.save();

    const subject = `New Quote Request: ${serviceType}`;
    const html = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service Type:</strong> ${serviceType}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Message:</strong> ${message || "-"}</p>
      <p><em>Submitted at ${new Date().toLocaleString()}</em></p>
    `;

    try {
      await sendAdminEmail(subject, html, email, email, req.user?.email);
    } catch (err) {
      // continue even if email fails
      console.error("Email send failed:", err.message);
    }

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllQuoteRequests = async (req, res) => {
  try {
    const list = await QuoteRequest.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await QuoteRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addQuoteRequest, getAllQuoteRequests, deleteQuoteRequest };
