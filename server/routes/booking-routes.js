const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const GourmetClubEvent = require("../models/GourmetClubEvent");
const GourmetClub = require("../models/GourmetClub");
const Coupon = require("../models/Coupon");
const Review = require("../models/GourmetReview");
const User = require("../models/User");

// Create booking
router.post("/", async (req, res) => {
  try {
    const {
      eventId,
      userId,
      numberOfGuests,
      guests,
      contactPhone,
      contactEmail,
      specialRequests,
      couponCode,
      paymentMethod,
      paymentDetails,
    } = req.body;

    // Get event and club details
    const event = await GourmetClubEvent.findById(eventId).populate("club");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check availability
    const currentBookings = await Booking.countDocuments({
      event: eventId,
      status: { $in: ["confirmed", "completed"] },
    });

    if (currentBookings + numberOfGuests > event.totalSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Check if booking is still allowed (cancellation deadline)
    const lastBookingDate = new Date(event.date);
    lastBookingDate.setHours(lastBookingDate.getHours() - (event.club.cancellationHours || 48));
    
    if (new Date() > lastBookingDate) {
      return res.status(400).json({ message: "Booking period has ended" });
    }

    // Calculate pricing
    let totalPrice = event.pricePerSeat * numberOfGuests;
    let couponDiscount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      // Check usage limits
      const userBookings = await Booking.countDocuments({
        user: userId,
        coupon: { code: couponCode },
      });

      if (userBookings >= coupon.usageLimitPerUser) {
        return res.status(400).json({ message: "Coupon usage limit exceeded" });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon has been fully used" });
      }

      // Check minimum amount
      if (totalPrice < coupon.minimumAmount) {
        return res.status(400).json({
          message: `Minimum amount of ${coupon.minimumAmount} required for this coupon`,
        });
      }

      // Apply discount
      if (coupon.discountType === "percentage") {
        couponDiscount = (totalPrice * coupon.discountValue) / 100;
        if (coupon.maximumDiscount) {
          couponDiscount = Math.min(couponDiscount, coupon.maximumDiscount);
        }
      } else {
        couponDiscount = coupon.discountValue;
      }

      totalPrice -= couponDiscount;

      // Update coupon usage
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { usedCount: 1 },
      });
    }

    // Create booking
    const booking = new Booking({
      event: eventId,
      club: event.club._id,
      user: userId,
      host: event.club.host,
      numberOfGuests,
      guests,
      totalPrice,
      pricePerGuest: event.pricePerSeat,
      paymentMethod,
      paymentDetails,
      contactPhone,
      contactEmail,
      specialRequests,
      coupon: couponCode ? {
        code: couponCode,
        discount: couponDiscount,
        type: coupon?.discountType || "fixed",
      } : undefined,
    });

    // Update event availability
    const newAvailableSeats = event.totalSeats - (currentBookings + numberOfGuests);
    await GourmetClubEvent.findByIdAndUpdate(eventId, {
      availableSeats: newAvailableSeats,
      status: newAvailableSeats === 0 ? "fully-booked" : "live",
    });

    await booking.save();

    // Populate related data for response
    await booking.populate([
      { path: "event", populate: { path: "club", populate: { path: "host" } } },
      { path: "user", select: "userName email" },
      { path: "host", select: "name title email" },
    ]);

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
});

// Get user bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("event", "date startTime endTime title")
      .populate("club", "name theme image experienceType")
      .populate("host", "name title image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Get single booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event")
      .populate("club")
      .populate("host", "name title image email")
      .populate("user", "userName email")
      .exec();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking" });
  }
});

// Update booking status (for confirmation, cancellation, etc.)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Validate status transition
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: ["refunded"],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    // Handle cancellation
    if (status === "cancelled") {
      const event = await GourmetClubEvent.findById(booking.event);
      const now = new Date();
      const eventDate = new Date(event.date);
      const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

      // Check cancellation policy
      const cancellationHours = event.club.cancellationHours || 48;
      
      if (hoursUntilEvent >= cancellationHours) {
        // Full refund
        booking.refundAmount = booking.totalPrice;
      } else {
        // No refund or partial refund based on policy
        booking.refundAmount = 0;
      }

      booking.cancellationReason = cancellationReason;
      booking.cancellationDate = now;

      // Update event availability
      const currentBookings = await Booking.countDocuments({
        event: booking.event,
        status: { $in: ["confirmed", "completed"] },
      });

      await GourmetClubEvent.findByIdAndUpdate(booking.event, {
        availableSeats: event.totalSeats - currentBookings,
        status: "live",
      });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status" });
  }
});

// Add review to booking
router.post("/:id/review", async (req, res) => {
  try {
    const { rating, comment, highlights, wouldRecommend, images } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only review completed events" });
    }

    if (booking.reviewSubmitted) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    // Create review
    const review = new Review({
      booking: booking._id,
      event: booking.event,
      club: booking.club,
      user: booking.user,
      host: booking.host,
      rating,
      comment,
      highlights,
      wouldRecommend,
      images,
    });

    await review.save();

    // Update booking
    booking.reviewSubmitted = true;
    await booking.save();

    // Update club and event ratings
    await updateRatings(booking.club, booking.event);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review" });
  }
});

// Helper function to update ratings
async function updateRatings(clubId, eventId) {
  try {
    // Update club rating
    const clubReviews = await Review.find({ club: clubId, status: "approved" });
    const clubAvgRating = clubReviews.reduce((sum, review) => sum + review.rating.overall, 0) / clubReviews.length;
    
    await GourmetClub.findByIdAndUpdate(clubId, {
      "rating.average": clubAvgRating,
      "rating.count": clubReviews.length,
    });

    // Update event rating (if needed)
    const eventReviews = await Review.find({ event: eventId, status: "approved" });
    const eventAvgRating = eventReviews.reduce((sum, review) => sum + review.rating.overall, 0) / eventReviews.length;
    
    await GourmetClubEvent.findByIdAndUpdate(eventId, {
      rating: eventAvgRating,
    });
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
}

module.exports = router;
