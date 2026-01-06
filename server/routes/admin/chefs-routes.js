const express = require("express");

const {
  handleImageUpload,
  addChef,
  editChef,
  fetchAllChefs,
  fetchChefById,
  deleteChef,
} = require("../../controllers/admin/chefs-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addChef);
router.put("/edit/:id", editChef);
router.delete("/delete/:id", deleteChef);
router.get("/get", fetchAllChefs);
router.get("/get/:id", fetchChefById);

module.exports = router;
