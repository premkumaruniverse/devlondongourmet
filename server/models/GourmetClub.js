const mongoose = require("mongoose");

const GourmetClubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },
    experienceType: {
      type: String,
      enum: [
        "monthly-supper-club",
        "chefs-table",
        "wine-tasting",
        "cooking-masterclass",
        "farm-to-table",
        "members-exclusive",
      ],
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ["draft", "approved", "live", "fully-booked", "completed", "archived"],
      default: "draft",
    },
    isMembersOnly: {
      type: Boolean,
      default: false,
    },
    maxSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      comment: "Duration in hours",
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict"],
      default: "moderate",
    },
    cancellationHours: {
      type: Number,
      default: 48,
      comment: "Hours before event for free cancellation",
    },
    dietaryNotes: {
      type: String,
    },
    menu: {
      type: String,
      required: true,
    },
    winePairing: {
      included: {
        type: Boolean,
        default: false,
      },
      description: String,
      additionalCost: {
        type: Number,
        default: 0,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    images: [{
      type: String,
    }],
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly"],
      },
      endDate: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GourmetClub", GourmetClubSchema);
