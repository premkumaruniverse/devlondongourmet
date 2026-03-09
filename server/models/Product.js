const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    subcategory: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    isSubscriptionEligible: {
      type: Boolean,
      default: false,
    },
    subscriptionOptions: {
      frequencies: [
        {
          type: String,
          enum: ["weekly", "monthly", "bi-monthly", "quarterly", "one-time"],
        },
      ],
      discounts: {
        weekly: Number,
        monthly: Number,
        "bi-monthly": Number,
        quarterly: Number,
      },
      shippingDays: [String],
      cutoffDays: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
