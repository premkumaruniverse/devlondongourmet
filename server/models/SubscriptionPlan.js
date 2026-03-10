const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: String,
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        frequency: {
            type: String,
            enum: ["weekly", "monthly", "bi-monthly", "quarterly"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        features: [String],
        cutoffDays: {
            type: Number,
            default: 3,
        },
        shippingDays: [String], // e.g. ["Monday", "Thursday"]
        minimumCommitment: {
            type: Number, // Number of cycles
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
