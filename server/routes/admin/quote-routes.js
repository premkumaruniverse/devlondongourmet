const express = require("express");
const { getAllQuoteRequests, deleteQuoteRequest } = require("../../controllers/shop/quote-controller");

const router = express.Router();

router.get("/get", getAllQuoteRequests);
router.delete("/delete/:id", deleteQuoteRequest);

module.exports = router;
