const Subscription = require("../../models/Subscription");
const SubscriptionPlan = require("../../models/SubscriptionPlan");
const SubscriptionEvent = require("../../models/SubscriptionEvent");
const Order = require("../../models/Order");

const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate("userId", "userName email")
            .populate("productId", "title image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const updateSubscriptionByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, nextBillingDate, nextDeliveryDate, price, frequency, note } = req.body;

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        const previousState = { ...subscription.toObject() };
        if (status) subscription.status = status;
        if (nextBillingDate) subscription.nextBillingDate = nextBillingDate;
        if (nextDeliveryDate) subscription.nextDeliveryDate = nextDeliveryDate;
        if (price) subscription.price = price;
        if (frequency) subscription.frequency = frequency;

        await subscription.save();

        // Log event
        const event = new SubscriptionEvent({
            subscriptionId: subscription._id,
            adminId: req.user.id,
            eventType: "admin_update",
            previousState,
            newState: subscription,
            note,
        });
        await event.save();

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const getSubscriptionAnalytics = async (req, res) => {
    try {
        const totalActive = await Subscription.countDocuments({ status: "active" });
        const totalPaused = await Subscription.countDocuments({ status: "paused" });
        const totalCancelled = await Subscription.countDocuments({ status: "cancelled" });

        // Simple MRR calculation
        const activeSubs = await Subscription.find({ status: "active" });
        let mrr = 0;
        activeSubs.forEach((sub) => {
            if (sub.frequency === "weekly") mrr += sub.price * 4;
            else if (sub.frequency === "monthly") mrr += sub.price;
            else if (sub.frequency === "bi-monthly") mrr += sub.price / 2;
            else if (sub.frequency === "quarterly") mrr += sub.price / 3;
        });

        res.status(200).json({
            success: true,
            data: {
                totalActive,
                totalPaused,
                totalCancelled,
                mrr,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

module.exports = {
    getAllSubscriptions,
    updateSubscriptionByAdmin,
    getSubscriptionAnalytics,
};
