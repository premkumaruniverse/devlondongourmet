const express = require("express");

const {
  handleImageUpload,
  addService,
  editService,
  fetchAllServices,
  deleteService,
} = require("../../controllers/admin/service-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addService);
router.put("/edit/:id", editService);
router.delete("/delete/:id", deleteService);
router.get("/get", fetchAllServices);

module.exports = router;
