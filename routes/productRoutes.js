import express from "express";
import {
  addReviewController,
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getCategoryProductsController,
  getProductController,
  getProductIdController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  updateProductQuantities,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// create product routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
// update product routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// update product quantities
router.post("/api/v1/product/update-quantities", updateProductQuantities);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);
router.get("/get-productId/:id", getProductIdController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//get category products
router.get("/category-products/:slug", getCategoryProductsController);


//delete product
router.delete("/delete-product/:pid", requireSignIn, deleteProductController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


//product reviews
router.put("/rating", requireSignIn, addReviewController);


export default router;
