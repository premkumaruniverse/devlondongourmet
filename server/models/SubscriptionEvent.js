const mongoose = require("mongoose");

const SubscriptionEventSchema = new mongoose.Schema(
    {
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        eventType: {
            type: String,
            enum: ["created", "paused", "resumed", "skipped", "cancelled", "payment_succeeded", "payment_failed", "plan_changed", "address_changed", "payment_method_changed", "frequency_changed", "variant_changed"],
            required: true,
        },
        previousState: mongoose.Schema.Types.Mixed,
        newState: mongoose.Schema.Types.Mixed,
        note: String,
        metadata: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubscriptionEvent", SubscriptionEventSchema);
