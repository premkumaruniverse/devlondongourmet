const { imageUploadUtil } = require("../../helpers/cloudinary");
const Chef = require("../../models/Chef");

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

//add a new chef
const addChef = async (req, res) => {
  try {
    const {
      image,
      name,
      title,
      experience,
      bio,
      bestAdvice,
      memberships,
      recognition,
      specializations,
      email,
      socialLinks,
      isActive,
      order,
    } = req.body;

    const newlyCreatedChef = new Chef({
      image,
      name,
      title,
      experience,
      bio,
      bestAdvice,
      memberships: memberships ? memberships.split(',').map(item => item.trim()) : [],
      recognition: recognition ? recognition.split(',').map(item => item.trim()) : [],
      specializations: specializations ? specializations.split(',').map(item => item.trim()) : [],
      email,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    await newlyCreatedChef.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedChef,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all chefs
const fetchAllChefs = async (req, res) => {
  try {
    const listOfChefs = await Chef.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: listOfChefs,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch active chefs for public view
const fetchActiveChefs = async (req, res) => {
  try {
    const listOfChefs = await Chef.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: listOfChefs,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch single chef by ID
const fetchChefById = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await Chef.findById(id);
    
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chef,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a chef
const editChef = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      name,
      title,
      experience,
      bio,
      bestAdvice,
      memberships,
      recognition,
      specializations,
      email,
      socialLinks,
      isActive,
      order,
    } = req.body;

    let findChef = await Chef.findById(id);
    if (!findChef)
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });

    findChef.name = name || findChef.name;
    findChef.title = title || findChef.title;
    findChef.experience = experience || findChef.experience;
    findChef.bio = bio || findChef.bio;
    findChef.bestAdvice = bestAdvice || findChef.bestAdvice;
    findChef.memberships = memberships ? memberships.split(',').map(item => item.trim()) : findChef.memberships;
    findChef.recognition = recognition ? recognition.split(',').map(item => item.trim()) : findChef.recognition;
    findChef.specializations = specializations ? specializations.split(',').map(item => item.trim()) : findChef.specializations;
    findChef.email = email || findChef.email;
    findChef.socialLinks = socialLinks ? JSON.parse(socialLinks) : findChef.socialLinks;
    findChef.image = image || findChef.image;
    findChef.isActive = isActive !== undefined ? isActive : findChef.isActive;
    findChef.order = order !== undefined ? order : findChef.order;

    await findChef.save();
    res.status(200).json({
      success: true,
      data: findChef,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a chef
const deleteChef = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await Chef.findByIdAndDelete(id);

    if (!chef)
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });

    res.status(200).json({
      success: true,
      message: "Chef deleted successfully",
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
  addChef,
  fetchAllChefs,
  fetchActiveChefs,
  fetchChefById,
  editChef,
  deleteChef,
};
