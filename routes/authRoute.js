import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  GetAllUsersDetails,
  updateUserRoleController,
  DeleteUserController,
  updateOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});


// get all users 
router.get("/users", requireSignIn, GetAllUsersDetails, (req, res) => {
  res.status(200).send({ ok: true });
  
});

// delete user using userId
router.delete("/delete-user/:userId", requireSignIn, isAdmin,DeleteUserController, (req, res) => {
  res.status(200).send({ ok: true });

});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController); 

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//update order 
router.route("/update-order/:id", requireSignIn, updateOrderController);


//update role
router.put("/update-role/:userId", requireSignIn, isAdmin, updateUserRoleController);


// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;