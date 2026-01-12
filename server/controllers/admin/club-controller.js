const { imageUploadUtil } = require("../../helpers/cloudinary");
const Club = require("../../models/Club");
const EventSchedule = require("../../models/EventSchedule");
const ClubReview = require("../../models/ClubReview");
const Chef = require("../../models/Chef");
const mongoose = require("mongoose");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new club
const addClub = async (req, res) => {
  try {
    const {
      title,
      description,
      experience_type,
      theme,
      images,
      host_id,
      is_members_only,
      menu_details,
      dietary_notes,
      cancellation_policy,
    } = req.body;

    // Validate host_id is a valid ObjectId and exists in Chef collection
    if (!mongoose.Types.ObjectId.isValid(host_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid host ID format",
      });
    }

    const chef = await Chef.findById(host_id);
    if (!chef) {
      return res.status(400).json({
        success: false,
        message: "Host chef not found",
      });
    }

    const newlyCreatedClub = new Club({
      title,
      description,
      experience_type,
      theme,
      images: images ? (Array.isArray(images) ? images : [images]) : [],
      host_id,
      is_members_only,
      menu_details,
      dietary_notes,
      cancellation_policy,
    });

    await newlyCreatedClub.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedClub,
    });
  } catch (e) {
    console.log("Error adding club:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding club",
      error: e.message,
    });
  }
};

//fetch all clubs
const fetchAllClubs = async (req, res) => {
  try {
    const listOfClubs = await Club.find({}).populate('host_id', 'name title image bio');
    res.status(200).json({
      success: true,
      data: listOfClubs,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a club
const editClub = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      experience_type,
      theme,
      images,
      host_id,
      is_members_only,
      menu_details,
      dietary_notes,
      cancellation_policy,
      status,
    } = req.body;

    let findClub = await Club.findById(id);
    if (!findClub)
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });

    findClub.title = title || findClub.title;
    findClub.description = description || findClub.description;
    findClub.experience_type = experience_type || findClub.experience_type;
    findClub.theme = theme || findClub.theme;
    findClub.images = images || findClub.images;
    findClub.host_id = host_id || findClub.host_id;
    findClub.is_members_only = is_members_only !== undefined ? is_members_only : findClub.is_members_only;
    findClub.menu_details = menu_details || findClub.menu_details;
    findClub.dietary_notes = dietary_notes || findClub.dietary_notes;
    findClub.cancellation_policy = cancellation_policy || findClub.cancellation_policy;
    findClub.status = status || findClub.status;

    await findClub.save();
    res.status(200).json({
      success: true,
      data: findClub,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a club
const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    const club = await Club.findByIdAndDelete(id);

    if (!club)
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });

    // Also delete related event schedules and reviews
    await EventSchedule.deleteMany({ club_id: id });
    await ClubReview.deleteMany({ club_id: id });

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//add event schedule for a club
const addEventSchedule = async (req, res) => {
  try {
    const {
      club_id,
      date,
      start_time,
      duration,
      seat_limit,
      price_per_guest,
    } = req.body;

    const newlyCreatedSchedule = new EventSchedule({
      club_id,
      date,
      start_time,
      duration,
      seat_limit,
      price_per_guest,
    });

    await newlyCreatedSchedule.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedSchedule,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch event schedules for a club
const fetchEventSchedules = async (req, res) => {
  try {
    const { clubId } = req.params;
    const schedules = await EventSchedule.find({ club_id: clubId }).sort({ date: 1 });
    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all chefs for dropdown
const fetchAllChefs = async (req, res) => {
  try {
    const listOfChefs = await Chef.find({ isActive: true }).select('_id name title');
    res.status(200).json({
      success: true,
      data: listOfChefs,
    });
  } catch (e) {
    console.log("Error fetching chefs:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching chefs",
    });
  }
};

module.exports = {
  handleImageUpload,
  addClub,
  fetchAllClubs,
  fetchAllChefs,
  editClub,
  deleteClub,
  addEventSchedule,
  fetchEventSchedules,
};
