const express = require("express");

const {
  fetchActiveChefs,
  fetchChefById,
} = require("../../controllers/admin/chefs-controller");

const router = express.Router();

router.get("/get", fetchActiveChefs);
router.get("/get/:id", fetchChefById);

module.exports = router;
