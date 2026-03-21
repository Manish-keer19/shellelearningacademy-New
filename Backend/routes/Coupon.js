const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  applyCoupon,
  redeemCoupon,
} = require("../controllers/Coupon");

const { auth } = require("../middlewares/auth");

// Admin routes
router.post("/create", auth, createCoupon);
router.get("/all", auth, getAllCoupons);

// User routes
router.post("/apply", auth, applyCoupon);
router.post("/redeem", auth, redeemCoupon);

module.exports = router;