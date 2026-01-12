const mongoose = require("mongoose");

const EventScheduleSchema = new mongoose.Schema(
  {
    club_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    seat_limit: {
      type: Number,
      required: true,
    },
    seats_booked: {
      type: Number,
      default: 0,
    },
    price_per_guest: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'FULL', 'CANCELLED', 'COMPLETED'],
      default: 'SCHEDULED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventSchedule", EventScheduleSchema);
