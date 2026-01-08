const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const GourmetClub = require("../models/GourmetClub");
const GourmetClubEvent = require("../models/GourmetClubEvent");
const Booking = require("../models/Booking");
const Review = require("../models/GourmetReview");
const Chef = require("../models/Chef");
const User = require("../models/User");

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get active hosts for dropdown
router.get("/hosts", async (req, res) => {
  try {
    const hosts = await Chef.find({ isActive: true })
      .select("_id name title image experience")
      .sort({ order: 1, name: 1 });
    
    res.json({
      success: true,
      data: hosts,
    });
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hosts",
    });
  }
});

// Get all clubs with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      experienceType,
      priceMin,
      priceMax,
      date,
      featured,
      membersOnly,
      search,
    } = req.query;

    const filter = { status: "live" };

    if (experienceType) filter.experienceType = experienceType;
    if (featured === "true") filter.featured = true;
    if (membersOnly === "true") filter.isMembersOnly = true;
    if (membersOnly === "false") filter.isMembersOnly = false;

    if (priceMin || priceMax) {
      filter.pricePerSeat = {};
      if (priceMin) filter.pricePerSeat.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerSeat.$lte = parseFloat(priceMax);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { theme: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const clubs = await GourmetClub.find(filter)
      .populate("host", "name title image bio")
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await GourmetClub.countDocuments(filter);

    // Get upcoming events for each club
    const clubsWithEvents = await Promise.all(
      clubs.map(async (club) => {
        const upcomingEvents = await GourmetClubEvent.find({
          club: club._id,
          date: { $gte: new Date() },
          status: { $in: ["scheduled", "live"] },
        })
          .sort({ date: 1 })
          .limit(3)
          .exec();

        return {
          ...club.toObject(),
          upcomingEvents,
        };
      })
    );

    res.json({
      clubs: clubsWithEvents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Error fetching clubs" });
  }
});

// Get single club by ID
router.get("/:id", async (req, res) => {
  try {
    const club = await GourmetClub.findById(req.params.id)
      .populate("host", "name title image bio experience specializations socialLinks")
      .exec();

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Get upcoming events
    const upcomingEvents = await GourmetClubEvent.find({
      club: club._id,
      date: { $gte: new Date() },
      status: { $in: ["scheduled", "live"] },
    })
      .sort({ date: 1 })
      .exec();

    // Get reviews
    const reviews = await Review.find({ club: club._id, status: "approved" })
      .populate("user", "userName")
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    res.json({
      ...club.toObject(),
      upcomingEvents,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching club:", error);
    res.status(500).json({ message: "Error fetching club" });
  }
});

// Create new club (for hosts and admins)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request headers:", req.headers);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'experienceType', 'theme', 'location', 'maxSeats', 'pricePerSeat', 'duration'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }
    
    const {
      name,
      description,
      host,
      experienceType,
      theme,
      tags,
      maxSeats,
      pricePerSeat,
      duration,
      location,
      address,
      cancellationPolicy,
      cancellationHours,
      dietaryNotes,
      menu,
      winePairing,
      isMembersOnly,
      recurring,
    } = req.body;

    // Validate numeric fields
    if (maxSeats && isNaN(parseInt(maxSeats))) {
      return res.status(400).json({ message: "maxSeats must be a valid number" });
    }
    
    if (pricePerSeat && isNaN(parseFloat(pricePerSeat))) {
      return res.status(400).json({ message: "pricePerSeat must be a valid number" });
    }
    
    if (duration && isNaN(parseFloat(duration))) {
      return res.status(400).json({ message: "duration must be a valid number" });
    }

    // Upload image to Cloudinary
    let imageUrl = "";
    if (req.file) {
      console.log("Processing image upload...");
      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "gourmet-clubs" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload success:", result.secure_url);
                resolve(result.secure_url);
              }
            }
          ).end(req.file.buffer)
        });
        imageUrl = result;
      } catch (uploadError) {
        console.error("Upload processing error:", uploadError);
        return res.status(500).json({ 
          message: "Error uploading image to Cloudinary", 
          error: uploadError.message 
        });
      }
    } else {
      console.log("No image file provided");
    }

    console.log("Final image URL:", imageUrl);

    // Parse and validate complex fields
    let parsedAddress, parsedWinePairing, parsedRecurring;
    
    try {
      parsedAddress = JSON.parse(address || "{}");
    } catch (e) {
      console.error("Error parsing address:", e);
      parsedAddress = {};
    }
    
    try {
      parsedWinePairing = JSON.parse(winePairing || "{}");
    } catch (e) {
      console.error("Error parsing winePairing:", e);
      parsedWinePairing = { included: false, description: "", additionalCost: 0 };
    }
    
    try {
      parsedRecurring = JSON.parse(recurring || "{}");
    } catch (e) {
      console.error("Error parsing recurring:", e);
      parsedRecurring = { isRecurring: false, frequency: "", endDate: "" };
    }

    const club = new GourmetClub({
      name,
      description,
      image: imageUrl,
      host,
      experienceType,
      theme,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      maxSeats: parseInt(maxSeats),
      pricePerSeat: parseFloat(pricePerSeat),
      duration: parseFloat(duration),
      location,
      address: parsedAddress,
      cancellationPolicy,
      cancellationHours: parseInt(cancellationHours),
      dietaryNotes,
      menu,
      winePairing: parsedWinePairing,
      isMembersOnly: isMembersOnly === "true",
      recurring: parsedRecurring,
    });

    console.log("Saving club:", club);
    
    try {
      await club.save();
      console.log("Club saved successfully");
      res.status(201).json(club);
    } catch (saveError) {
      console.error("Error saving club to database:", saveError);
      res.status(500).json({ 
        message: "Error saving club to database", 
        error: saveError.message 
      });
    }
  } catch (error) {
    console.error("Unexpected error in club creation:", error);
    res.status(500).json({ 
      message: "Unexpected error creating club", 
      error: error.message 
    });
  }
});

// Update club
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const club = await GourmetClub.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Handle image upload
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "gourmet-clubs" },
          (error, result) => {
            if (error) reject(error);
            resolve(result.secure_url);
          }
        ).end(req.file.buffer)
      });
      club.image = result;
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      if (key === "address" || key === "winePairing" || key === "recurring") {
        club[key] = JSON.parse(req.body[key]);
      } else if (key === "tags") {
        club[key] = req.body[key].split(",").map((tag) => tag.trim());
      } else if (key === "isMembersOnly") {
        club[key] = req.body[key] === "true";
      } else {
        club[key] = req.body[key];
      }
    });

    await club.save();
    res.json(club);
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).json({ message: "Error updating club" });
  }
});

// Delete club
router.delete("/:id", async (req, res) => {
  try {
    const club = await GourmetClub.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if there are any upcoming events
    const upcomingEvents = await GourmetClubEvent.countDocuments({
      club: club._id,
      date: { $gte: new Date() },
      status: { $in: ["scheduled", "live"] },
    });

    if (upcomingEvents > 0) {
      return res.status(400).json({
        message: "Cannot delete club with upcoming events",
      });
    }

    await GourmetClub.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Error deleting club" });
  }
});

// Get club statistics
router.get("/:id/stats", async (req, res) => {
  try {
    const clubId = req.params.id;

    const stats = await Promise.all([
      GourmetClubEvent.countDocuments({ club: clubId }),
      GourmetClubEvent.countDocuments({
        club: clubId,
        date: { $gte: new Date() },
      }),
      Booking.countDocuments({ club: clubId }),
      Booking.aggregate([
        { $match: { club: clubId, status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]),
      Review.aggregate([
        { $match: { club: clubId, status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating.overall" } } },
      ]),
    ]);

    res.json({
      totalEvents: stats[0],
      upcomingEvents: stats[1],
      totalBookings: stats[2],
      totalRevenue: stats[3][0]?.totalRevenue || 0,
      averageRating: stats[4][0]?.avgRating || 0,
    });
  } catch (error) {
    console.error("Error fetching club stats:", error);
    res.status(500).json({ message: "Error fetching club statistics" });
  }
});

module.exports = router;
