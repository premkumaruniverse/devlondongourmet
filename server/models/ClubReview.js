const mongoose = require("mongoose");

const ClubReviewSchema = new mongoose.Schema(
  {
    club_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    review_message: {
      type: String,
      required: true,
    },
    review_value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    event_schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventSchedule',
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClubReview", ClubReviewSchema);
