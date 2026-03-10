const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variantId: String, // Can be extended to a Variant model if needed
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
        },
        status: {
            type: String,
            enum: ["active", "paused", "skipped", "payment_failed", "cancelled", "expired"],
            default: "active",
        },
        frequency: {
            type: String,
            enum: ["weekly", "monthly", "bi-monthly", "quarterly", "one-time"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        nextBillingDate: {
            type: Date,
            required: true,
        },
        nextDeliveryDate: {
            type: Date,
        },
        cutoffDate: {
            type: Date,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        pausedAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
        addressInfo: {
            addressId: String,
            address: String,
            city: String,
            pincode: String,
            phone: String,
            notes: String,
        },
        paymentMethodId: String, // Stripe/Razorpay payment method ID
        lastTransactionId: String,
        metadata: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
