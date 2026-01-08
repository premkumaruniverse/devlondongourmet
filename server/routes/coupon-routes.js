const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

// Get all coupons (for admins)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, search } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";
    
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const coupons = await Coupon.find(filter)
      .populate("createdBy", "userName")
      .populate("applicableEvents", "title date")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Coupon.countDocuments(filter);

    res.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Error fetching coupons" });
  }
});

// Validate coupon
router.post("/validate", async (req, res) => {
  try {
    const { code, userId, eventAmount, eventId } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    }).populate("applicableEvents");

    if (!coupon) {
      return res.status(400).json({ 
        valid: false,
        message: "Invalid or expired coupon" 
      });
    }

    // Check if coupon applies to this event
    if (coupon.applicableTo === "specific-events" && eventId) {
      const isApplicable = coupon.applicableEvents.some(
        (event) => event._id.toString() === eventId
      );
      if (!isApplicable) {
        return res.status(400).json({ 
          valid: false,
          message: "Coupon not applicable to this event" 
        });
      }
    }

    // Check minimum amount
    if (eventAmount < coupon.minimumAmount) {
      return res.status(400).json({ 
        valid: false,
        message: `Minimum amount of ${coupon.minimumAmount} required for this coupon` 
      });
    }

    // Check usage limits
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        valid: false,
        message: "Coupon has been fully used" 
      });
    }

    // Check user-specific usage (if userId provided)
    if (userId && coupon.usageLimitPerUser > 0) {
      const Booking = require("../../models/Booking");
      const userUsage = await Booking.countDocuments({
        user: userId,
        "coupon.code": code,
      });

      if (userUsage >= coupon.usageLimitPerUser) {
        return res.status(400).json({ 
          valid: false,
          message: "You have reached the usage limit for this coupon" 
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (eventAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        maximumDiscount: coupon.maximumDiscount,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Error validating coupon" });
  }
});

// Create new coupon (for admins)
router.post("/", async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      usageLimitPerUser,
      validFrom,
      validUntil,
      applicableTo,
      applicableEvents,
      createdBy,
    } = req.body;

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      usageLimitPerUser,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableTo,
      applicableEvents: applicableEvents || [],
      createdBy,
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Error creating coupon" });
  }
});

// Update coupon
router.put("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    Object.assign(coupon, req.body);
    if (req.body.code) {
      coupon.code = req.body.code.toUpperCase();
    }

    await coupon.save();
    res.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Error updating coupon" });
  }
});

// Delete coupon
router.delete("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Soft delete by deactivating
    coupon.isActive = false;
    await coupon.save();

    res.json({ message: "Coupon deactivated successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Error deleting coupon" });
  }
});

module.exports = router;
