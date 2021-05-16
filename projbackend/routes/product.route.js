const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product.controller");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user.controller");

//--------------middleware-------------
router.param("userId", getUserById);
router.param("productId", getProductById);

//--------------------Actual routes------------

//---------------------Create routes--------------------
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//---------------------------Read routes----------------
router.get("/product/:productId", getProduct);
//middleware for getting photo
router.get("/product/photo/:productId", photo);

//-----------------------------Delete route--------------------
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//-----------------------------Update route-------------------------
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//-----------------------------Listing route(Get all products)----------------------------
router.get("/products", getAllProducts);

//---------------getAllCategories--------------
router.get("/product/categories", getAllUniqueCategories);

module.exports = router;
