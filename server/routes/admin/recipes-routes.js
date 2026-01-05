const express = require("express");
const {
  addRecipe,
  fetchAllRecipes,
  editRecipe,
  deleteRecipe,
} = require("../../controllers/admin/recipes-controller");

const router = express.Router();

router.post("/", addRecipe);
router.get("/", fetchAllRecipes);
router.put("/:id", editRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
