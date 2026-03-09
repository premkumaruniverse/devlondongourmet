const express = require("express");
const {
    createSubscription,
    getSubscriptions,
    updateSubscriptionStatus,
} = require("../../controllers/shop/subscription-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/create", authMiddleware, createSubscription);
router.get("/list", authMiddleware, getSubscriptions);
router.put("/update-status/:id", authMiddleware, updateSubscriptionStatus);

module.exports = router;
