const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { getUserById } = require("../controllers/user.controller");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//-------------------Params---------------------
router.param("userId", getUserById); // It always get executed when find \:categoryId  & thus fill profile with user details
router.param("categoryId", getCategoryById);

//----------------------actual routes-----------------------

//----------------insert request route-------------------
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//----------------to read route-------------------

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//----------------update route-------------------
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//----------------delete route-------------------
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
