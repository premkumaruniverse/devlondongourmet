const Service = require("../../models/Service");

const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service)
      return res.status(404).json({
        success: false,
        message: "Service not found!",
      });

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getServices, getServiceDetails };
