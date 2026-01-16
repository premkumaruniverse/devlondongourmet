const express = require("express");
const {
  fetchLiveClubs,
  fetchClubDetails,
  addClubReview,
  getClubReviews,
} = require("../../controllers/shop/club-controller");
const router = express.Router();

router.get("/get", fetchLiveClubs);
router.get("/details/:id", fetchClubDetails);
router.post("/review/:clubId", addClubReview);
router.get("/reviews/:clubId", getClubReviews);

module.exports = router;
