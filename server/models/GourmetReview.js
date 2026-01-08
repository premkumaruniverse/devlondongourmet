const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GourmetClubEvent",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GourmetClub",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },
    rating: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      food: {
        type: Number,
        min: 1,
        max: 5,
      },
      atmosphere: {
        type: Number,
        min: 1,
        max: 5,
      },
      hospitality: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    highlights: [{
      type: String,
      trim: true,
    }],
    wouldRecommend: {
      type: Boolean,
      required: true,
    },
    images: [{
      type: String,
    }],
    helpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    response: {
      comment: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chef",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ event: 1 });
ReviewSchema.index({ club: 1 });
ReviewSchema.index({ host: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ status: 1 });

module.exports = mongoose.model("Review", ReviewSchema);
