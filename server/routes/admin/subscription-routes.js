const express = require("express");
const {
    getAllSubscriptions,
    updateSubscriptionByAdmin,
    getSubscriptionAnalytics,
} = require("../../controllers/admin/subscription-controller");

const router = express.Router();

router.get("/list", getAllSubscriptions);
router.put("/update/:id", updateSubscriptionByAdmin);
router.get("/analytics", getSubscriptionAnalytics);

module.exports = router;
