const Service = require("../../models/Service");
const { imageUploadUtil } = require("../../helpers/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const originalName = (req.file.originalname || "").toLowerCase();
    const isPdf =
      req.file.mimetype === "application/pdf" ||
      originalName.endsWith(".pdf") ||
      req.file.mimetype === "application/octet-stream";

    const resourceType = isPdf ? "raw" : "auto";

    const result = await imageUploadUtil(url, resourceType);

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

const addService = async (req, res) => {
  try {
    const { image, title, description, content, pdfUrl } = req.body;

    const newService = new Service({
      image,
      title,
      description,
      content,
      pdfUrl,
    });

    await newService.save();
    res.status(201).json({
      success: true,
      data: newService,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const fetchAllServices = async (req, res) => {
  try {
    const listOfServices = await Service.find({});
    res.status(200).json({
      success: true,
      data: listOfServices,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, description, content, pdfUrl } = req.body;

    let findService = await Service.findById(id);
    if (!findService)
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });

    findService.title = title || findService.title;
    findService.description = description || findService.description;
    findService.content = content || findService.content;
    findService.image = image || findService.image;
    findService.pdfUrl = pdfUrl || findService.pdfUrl;

    await findService.save();
    res.status(200).json({
      success: true,
      data: findService,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service)
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
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
  handleImageUpload,
  addService,
  fetchAllServices,
  editService,
  deleteService,
};
