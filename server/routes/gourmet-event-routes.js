const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const GourmetClubEvent = require("../models/GourmetClubEvent");
const GourmetClub = require("../models/GourmetClub");
const Booking = require("../models/Booking");

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all events with filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      club,
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
      experienceType,
      featured,
      status,
    } = req.query;

    const filter = {};

    if (club) filter.club = club;
    if (status) filter.status = status;
    if (featured === "true") filter.featured = true;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    } else {
      // Default to future events
      filter.date = { $gte: new Date() };
    }

    if (priceMin || priceMax) {
      filter.pricePerSeat = {};
      if (priceMin) filter.pricePerSeat.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerSeat.$lte = parseFloat(priceMax);
    }

    // If experienceType is specified, filter by club's experienceType
    if (experienceType) {
      const clubs = await GourmetClub.find({ experienceType }).select("_id");
      filter.club = { $in: clubs.map((club) => club._id) };
    }

    const events = await GourmetClubEvent.find(filter)
      .populate("club", "name experienceType theme image host isMembersOnly")
      .populate({
        path: "club",
        populate: {
          path: "host",
          select: "name title image",
        },
      })
      .sort({ date: 1, featured: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await GourmetClubEvent.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await GourmetClubEvent.findById(req.params.id)
      .populate("club")
      .populate({
        path: "club",
        populate: {
          path: "host",
          select: "name title image bio experience specializations socialLinks",
        },
      })
      .exec();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get booking count
    const bookingCount = await Booking.countDocuments({
      event: event._id,
      status: { $in: ["confirmed", "completed"] },
    });

    // Get reviews for this event
    const reviews = await Booking.find({
      event: event._id,
      status: "completed",
      reviewSubmitted: true,
    })
      .populate("user", "userName")
      .populate("review")
      .exec();

    res.json({
      ...event.toObject(),
      availableSeats: event.totalSeats - bookingCount,
      bookingCount,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// Create new event
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const {
      club,
      title,
      description,
      date,
      startTime,
      endTime,
      totalSeats,
      pricePerSeat,
      specialNotes,
      menu,
      dietaryAccommodations,
      instantBooking,
    } = req.body;

    // Verify club exists
    const clubDoc = await GourmetClub.findById(club);
    if (!clubDoc) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Upload images to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "gourmet-events" },
          (error, result) => {
            if (error) throw error;
            return result.secure_url;
          }
        ).end(file.buffer)
      );

      images = await Promise.all(uploadPromises);
    }

    const event = new GourmetClubEvent({
      club,
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      specialNotes,
      menu,
      dietaryAccommodations: dietaryAccommodations ? dietaryAccommodations.split(",") : [],
      instantBooking: instantBooking === "true",
      images,
    });

    await event.save();
    
    // Populate club info for response
    await event.populate("club", "name experienceType theme image host isMembersOnly");
    await event.populate({
      path: "club",
      populate: {
        path: "host",
        select: "name title image",
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
});

// Update event
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const event = await GourmetClubEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event can be modified
    if (event.status === "completed" || event.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot modify completed or cancelled events",
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "gourmet-events" },
          (error, result) => {
            if (error) throw error;
            return result.secure_url;
          }
        ).end(file.buffer)
      );

      const newImages = await Promise.all(uploadPromises);
      event.images = [...event.images, ...newImages];
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      if (key === "date") {
        event[key] = new Date(req.body[key]);
      } else if (key === "dietaryAccommodations") {
        event[key] = req.body[key].split(",");
      } else if (key === "instantBooking") {
        event[key] = req.body[key] === "true";
      } else {
        event[key] = req.body[key];
      }
    });

    // Update available seats if total seats changed
    if (req.body.totalSeats && req.body.totalSeats !== event.totalSeats) {
      const bookingCount = await Booking.countDocuments({
        event: event._id,
        status: { $in: ["confirmed", "completed"] },
      });
      
      event.totalSeats = parseInt(req.body.totalSeats);
      event.availableSeats = event.totalSeats - bookingCount;
    }

    await event.save();
    
    // Populate club info for response
    await event.populate("club", "name experienceType theme image host isMembersOnly");
    await event.populate({
      path: "club",
      populate: {
        path: "host",
        select: "name title image",
      },
    });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const event = await GourmetClubEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if there are any bookings
    const bookingCount = await Booking.countDocuments({
      event: event._id,
      status: { $in: ["confirmed", "completed"] },
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        message: "Cannot delete event with existing bookings",
      });
    }

    await GourmetClubEvent.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// Get available dates for a club
router.get("/club/:clubId/available-dates", async (req, res) => {
  try {
    const { clubId } = req.params;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await GourmetClubEvent.find({
      club: clubId,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ["scheduled", "live"] },
    })
      .populate("club", "maxSeats")
      .exec();

    const availableDates = await Promise.all(
      events.map(async (event) => {
        const bookingCount = await Booking.countDocuments({
          event: event._id,
          status: { $in: ["confirmed", "completed"] },
        });

        return {
          date: event.date,
          availableSeats: event.totalSeats - bookingCount,
          totalSeats: event.totalSeats,
          pricePerSeat: event.pricePerSeat,
          startTime: event.startTime,
          endTime: event.endTime,
        };
      })
    );

    res.json(availableDates);
  } catch (error) {
    console.error("Error fetching available dates:", error);
    res.status(500).json({ message: "Error fetching available dates" });
  }
});

module.exports = router;
