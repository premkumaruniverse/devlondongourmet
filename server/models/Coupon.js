const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumAmount: {
      type: Number,
      default: 0,
    },
    maximumDiscount: {
      type: Number,
      comment: "Maximum discount amount for percentage coupons",
    },
    usageLimit: {
      type: Number,
      comment: "Total number of times this coupon can be used",
    },
    usageLimitPerUser: {
      type: Number,
      default: 1,
      comment: "Times a single user can use this coupon",
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableTo: {
      type: String,
      enum: ["all", "new-users", "members-only", "specific-events"],
      default: "all",
    },
    applicableEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "GourmetClubEvent",
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });
CouponSchema.index({ isActive: 1 });

module.exports = mongoose.model("Coupon", CouponSchema);
