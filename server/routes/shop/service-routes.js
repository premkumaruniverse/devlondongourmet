const express = require("express");

const {
  getServices,
  getServiceDetails,
} = require("../../controllers/shop/service-controller");

const router = express.Router();

router.get("/get", getServices);
router.get("/get/:id", getServiceDetails);

module.exports = router;
