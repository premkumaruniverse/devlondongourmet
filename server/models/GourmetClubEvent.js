const mongoose = require("mongoose");

const GourmetClubEventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GourmetClub",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      comment: "Format: HH:MM",
    },
    endTime: {
      type: String,
      required: true,
      comment: "Format: HH:MM",
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "fully-booked", "completed", "cancelled"],
      default: "scheduled",
    },
    specialNotes: {
      type: String,
    },
    menu: {
      type: String,
    },
    dietaryAccommodations: [{
      type: String,
      enum: ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "halal", "kosher"],
    }],
    lastBookingDate: {
      type: Date,
      default: function() {
        const date = new Date(this.date);
        const club = this.club;
        if (club && club.cancellationHours) {
          date.setHours(date.getHours() - club.cancellationHours);
        } else {
          date.setHours(date.getHours() - 48);
        }
        return date;
      },
    },
    instantBooking: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: [{
      type: String,
    }],
  },
  { timestamps: true }
);

GourmetClubEventSchema.index({ club: 1, date: 1 });
GourmetClubEventSchema.index({ date: 1 });
GourmetClubEventSchema.index({ status: 1 });

module.exports = mongoose.model("GourmetClubEvent", GourmetClubEventSchema);
