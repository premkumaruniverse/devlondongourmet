const express = require("express");
const { getAllRecipes, getRecipeById } = require("../../controllers/shop/recipes-controller");

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

module.exports = router;
