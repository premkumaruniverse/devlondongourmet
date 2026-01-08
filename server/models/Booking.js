const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
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
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: [{
      name: {
        type: String,
        required: true,
      },
      dietaryRestrictions: [{
        type: String,
        enum: ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "halal", "kosher", "other"],
      }],
      allergies: [String],
      specialRequests: String,
    }],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerGuest: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "stripe", "apple-pay", "google-pay"],
    },
    paymentDetails: {
      transactionId: String,
      paymentIntentId: String,
      last4: String,
      brand: String,
    },
    coupon: {
      code: String,
      discount: Number,
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
    },
    cancellationReason: {
      type: String,
    },
    cancellationDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
    },
    specialRequests: {
      type: String,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      comment: "Internal notes for host/admin",
    },
  },
  { timestamps: true }
);

BookingSchema.index({ event: 1, user: 1 });
BookingSchema.index({ user: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Booking", BookingSchema);
