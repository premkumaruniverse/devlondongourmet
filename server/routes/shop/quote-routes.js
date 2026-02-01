const express = require("express");
const { addQuoteRequest } = require("../../controllers/shop/quote-controller");

const router = express.Router();

router.post("/add", addQuoteRequest);

module.exports = router;
