const express = require("express");
const {
  handleImageUpload,
  addClub,
  fetchAllClubs,
  fetchAllChefs,
  editClub,
  deleteClub,
  addEventSchedule,
  fetchEventSchedules,
} = require("../../controllers/admin/club-controller");
const { upload } = require("../../helpers/cloudinary");
const router = express.Router();

router.post("/upload-image", upload.single("image"), handleImageUpload);
router.post("/add", addClub);
router.get("/get", fetchAllClubs);
router.get("/chefs", fetchAllChefs);
router.put("/edit/:id", editClub);
router.delete("/delete/:id", deleteClub);
router.post("/add-schedule", addEventSchedule);
router.get("/schedules/:clubId", fetchEventSchedules);

module.exports = router;
