const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: true,
    },
    bestAdvice: {
      type: String,
      required: false,
    },
    memberships: [{
      type: String,
    }],
    recognition: [{
      type: String,
    }],
    specializations: [{
      type: String,
    }],
    email: {
      type: String,
      required: false,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chef", ChefSchema);
