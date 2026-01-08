const express = require("express");
const router = express.Router();
const Review = require("../models/GourmetReview");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// Get reviews for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { "rating.overall": -1 },
      lowest: { "rating.overall": 1 },
      helpful: { helpful: -1 },
    };

    const reviews = await Review.find({ 
      event: eventId, 
      status: "approved" 
    })
      .populate("user", "userName avatar")
      .populate("host", "name")
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ 
      event: eventId, 
      status: "approved" 
    });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Get reviews for a club
router.get("/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { "rating.overall": -1 },
      lowest: { "rating.overall": 1 },
    };

    const reviews = await Review.find({ 
      club: clubId, 
      status: "approved" 
    })
      .populate("user", "userName avatar")
      .populate("event", "title date")
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ 
      club: clubId, 
      status: "approved" 
    });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Get reviews for a host
router.get("/host/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { "rating.overall": -1 },
      lowest: { "rating.overall": 1 },
    };

    const reviews = await Review.find({ 
      host: hostId, 
      status: "approved" 
    })
      .populate("user", "userName avatar")
      .populate("club", "name")
      .populate("event", "title date")
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ 
      host: hostId, 
      status: "approved" 
    });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Create a new review
router.post("/", auth, async (req, res) => {
  try {
    const {
      eventId,
      clubId,
      hostId,
      rating,
      comment,
      highlights,
      wouldRecommend,
      images,
    } = req.body;

    // Verify user has attended the event
    const booking = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: "completed",
    });

    if (!booking) {
      return res.status(403).json({ 
        message: "You must have attended this event to leave a review" 
      });
    }

    // Check if user has already reviewed this event
    const existingReview = await Review.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this event" 
      });
    }

    // Create review
    const review = new Review({
      booking: booking._id,
      event: eventId,
      club: clubId,
      user: req.user._id,
      host: hostId,
      rating,
      comment,
      highlights: highlights || [],
      wouldRecommend,
      images: images || [],
      verified: true, // Auto-verify since we confirmed booking
    });

    await review.save();

    // Update booking to mark review as submitted
    await Booking.findByIdAndUpdate(booking._id, {
      reviewSubmitted: true,
    });

    // Update club and event ratings
    await updateRatings(clubId, eventId);

    // Populate related data for response
    await review.populate([
      { path: "user", select: "userName avatar" },
      { path: "host", select: "name" },
    ]);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review" });
  }
});

// Mark review as helpful/unhelpful
router.post("/:reviewId/helpful", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isHelpful } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update helpful count (in a real app, you'd track which users voted)
    await Review.findByIdAndUpdate(reviewId, {
      $inc: { helpful: isHelpful ? 1 : -1 },
    });

    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording helpful vote:", error);
    res.status(500).json({ message: "Error recording vote" });
  }
});

// Report a review
router.post("/:reviewId/report", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // In a real app, you'd store reports in a separate collection
    // For now, we'll just mark the review as pending review
    await Review.findByIdAndUpdate(reviewId, {
      status: "pending",
    });

    // TODO: Send notification to admin team
    console.log(`Review ${reviewId} reported by user ${req.user._id}`);

    res.json({ message: "Review reported successfully" });
  } catch (error) {
    console.error("Error reporting review:", error);
    res.status(500).json({ message: "Error reporting review" });
  }
});

// Host response to review
router.post("/:reviewId/respond", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify user is the host of this review
    if (review.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: "Only the host can respond to this review" 
      });
    }

    // Add response
    await Review.findByIdAndUpdate(reviewId, {
      response: {
        comment,
        respondedAt: new Date(),
        respondedBy: req.user._id,
      },
    });

    res.json({ message: "Response added successfully" });
  } catch (error) {
    console.error("Error adding response:", error);
    res.status(500).json({ message: "Error adding response" });
  }
});

// Get review statistics for admin
router.get("/admin/stats", auth, async (req, res) => {
  try {
    const stats = await Promise.all([
      Review.countDocuments({ status: "approved" }),
      Review.countDocuments({ status: "pending" }),
      Review.countDocuments({ status: "rejected" }),
      Review.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating.overall" } } },
      ]),
      Review.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$wouldRecommend", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      totalApproved: stats[0],
      pendingReview: stats[1],
      rejected: stats[2],
      averageRating: stats[3][0]?.avgRating || 0,
      recommendationStats: stats[4],
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Get pending reviews for admin moderation
router.get("/admin/pending", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find({ status: "pending" })
      .populate("user", "userName")
      .populate("event", "title")
      .populate("club", "name")
      .populate("host", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ status: "pending" });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ message: "Error fetching pending reviews" });
  }
});

// Moderate review (approve/reject)
router.patch("/:reviewId/moderate", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { 
        status,
        moderationReason: reason,
        moderatedAt: new Date(),
        moderatedBy: req.user._id,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update ratings if approved
    if (status === "approved") {
      await updateRatings(review.club, review.event);
    }

    res.json(review);
  } catch (error) {
    console.error("Error moderating review:", error);
    res.status(500).json({ message: "Error moderating review" });
  }
});

// Helper function to update ratings
async function updateRatings(clubId, eventId) {
  try {
    // Update club rating
    const clubReviews = await Review.find({ 
      club: clubId, 
      status: "approved" 
    });
    
    if (clubReviews.length > 0) {
      const clubAvgRating = clubReviews.reduce(
        (sum, review) => sum + review.rating.overall, 
        0
      ) / clubReviews.length;
      
      await require("../../models/GourmetClub").findByIdAndUpdate(clubId, {
        "rating.average": clubAvgRating,
        "rating.count": clubReviews.length,
      });
    }

    // Update event rating
    const eventReviews = await Review.find({ 
      event: eventId, 
      status: "approved" 
    });
    
    if (eventReviews.length > 0) {
      const eventAvgRating = eventReviews.reduce(
        (sum, review) => sum + review.rating.overall, 
        0
      ) / eventReviews.length;
      
      await require("../../models/GourmetClubEvent").findByIdAndUpdate(eventId, {
        rating: eventAvgRating,
      });
    }
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
}

module.exports = router;
