const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experience_type: {
      type: String,
      enum: ['SUPPER_CLUB', 'CHEFS_TABLE', 'WINE_TASTING', 'MASTERCLASS', 'FARM_TO_TABLE'],
      required: true,
    },
    theme: {
      type: String,
      required: false,
    },
    cuisine_type: {
      type: String,
      required: false,
    },
    images: [{
      type: String,
    }],
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chef',
      required: true,
    },
    is_members_only: {
      type: Boolean,
      default: false,
    },
    includes_alcohol: {
      type: Boolean,
      default: false,
    },
    location: {
      address: {
        type: String,
        required: false,
      },
      neighborhood: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    menu_details: {
      type: String,
      required: false,
    },
    dietary_notes: {
      type: String,
      required: false,
    },
    cancellation_policy: {
      type: String,
      required: false,
    },
    guest_requirements: {
      type: String,
      required: false,
    },
    whats_included: [{
      type: String,
    }],
    whats_not_included: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['DRAFT', 'LIVE', 'CANCELLED'],
      default: 'DRAFT',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    default_duration: {
      type: String,
      default: "2-3 hours",
    },
    default_group_size: {
      type: String,
      default: "2-8 guests",
    },
    default_location_description: {
      type: String,
      default: "Private residence - details provided after booking",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", ClubSchema);
