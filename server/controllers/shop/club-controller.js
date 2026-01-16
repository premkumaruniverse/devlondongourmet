const Club = require("../../models/Club");
const EventSchedule = require("../../models/EventSchedule");
const ClubReview = require("../../models/ClubReview");

//fetch all live clubs for public
const fetchLiveClubs = async (req, res) => {
  try {
    const { category, sort } = req.query;
    
    let query = { status: 'LIVE' };
    
    if (category) {
      query.experience_type = category;
    }
    
    // Get clubs with their upcoming schedules
    const clubs = await Club.find(query)
      .populate('host_id', 'name title image bio')
      .sort({ createdAt: -1 });
    
    // For each club, get the next upcoming schedule
    const clubsWithSchedules = await Promise.all(
      clubs.map(async (club) => {
        const nextSchedule = await EventSchedule.findOne({ 
          club_id: club._id, 
          date: { $gte: new Date() },
          status: 'SCHEDULED'
        }).sort({ date: 1 }).limit(1);
        
        return {
          ...club.toObject(),
          nextSchedule: nextSchedule,
          price_per_guest: nextSchedule?.price_per_guest || 0,
        };
      })
    );
    
    // Sort if needed
    if (sort === 'price-lowtohigh') {
      clubsWithSchedules.sort((a, b) => a.price_per_guest - b.price_per_guest);
    } else if (sort === 'price-hightolow') {
      clubsWithSchedules.sort((a, b) => b.price_per_guest - a.price_per_guest);
    }
    
    res.status(200).json({
      success: true,
      data: clubsWithSchedules,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch club details by id
const fetchClubDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const club = await Club.findById(id)
      .populate('host_id', 'name title image bio experience memberships recognition specializations socialLinks');
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    // Get upcoming event schedules
    const schedules = await EventSchedule.find({ 
      club_id: id, 
      date: { $gte: new Date() },
      status: 'SCHEDULED'
    }).sort({ date: 1 });
    
    // Get reviews
    const reviews = await ClubReview.find({ club_id: id })
      .populate('user_id', 'userName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        club,
        schedules,
        reviews,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//add review for a club
const addClubReview = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { reviewMessage, reviewValue, event_schedule_id, userId, userName } = req.body;
    
    const newReview = new ClubReview({
      club_id: clubId,
      user_id: userId,
      user_name: userName,
      review_message: reviewMessage,
      review_value: reviewValue,
      event_schedule_id,
    });
    
    await newReview.save();
    
    // Update club's average rating
    const reviews = await ClubReview.find({ club_id: clubId });
    const averageRating = reviews.reduce((sum, review) => sum + review.review_value, 0) / reviews.length;
    
    await Club.findByIdAndUpdate(clubId, {
      averageRating,
      totalReviews: reviews.length,
    });
    
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//get reviews for a club
const getClubReviews = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const reviews = await ClubReview.find({ club_id: clubId })
      .populate('user_id', 'userName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  fetchLiveClubs,
  fetchClubDetails,
  addClubReview,
  getClubReviews,
};
