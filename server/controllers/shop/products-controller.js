const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], subcategory = [], sortBy = "price-lowtohigh", isSubscriptionEligible, includeAll } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    } else if (isSubscriptionEligible === undefined && includeAll !== 'true') {
      // Exclude ayu-bite from general listing by default if no category/subscription filter is specified and includeAll is not set
      filters.category = { $ne: "ayu-bite" };
    }

    if (isSubscriptionEligible !== undefined) {
      filters.isSubscriptionEligible = isSubscriptionEligible === 'true';
    }

    if (subcategory.length) {
      filters.subcategory = { $in: subcategory.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
