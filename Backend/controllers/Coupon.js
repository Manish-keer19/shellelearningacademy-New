// controllers/CouponController.js
const Coupon = require("../models/Coupon");
const Course = require("../models/Course");
const User = require("../models/User");

// Create a new coupon (Admin only)
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate, applicableCourses } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const adminDetails = await User.findById(userId);
    if (!adminDetails || adminDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create coupons",
      });
    }

    // Validate required fields
    if (!code || !discountPercent || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Code, discount percent, and expiry date are required",
      });
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // Validate applicable courses if provided
    let validatedCourses = [];
    if (applicableCourses && applicableCourses.length > 0) {
      validatedCourses = await Promise.all(
        applicableCourses.map(async (courseId) => {
          const course = await Course.findById(courseId);
          if (!course) {
            throw new Error(`Invalid course ID: ${courseId}`);
          }
          return course._id;
        })
      );
    }

    // Create the coupon
    const newCoupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent: parseFloat(discountPercent),
      expiryDate: new Date(expiryDate),
      applicableCourses: validatedCourses,
    });

    res.status(201).json({
      success: true,
      data: newCoupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};


exports.createBulkcopon = async (req, res) => {
  try {
    const { coupons } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const adminDetails = await User.findById(userId);
    if (!adminDetails || adminDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create coupons",
      });
    }

    if (!coupons || coupons.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No coupons provided",
      });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < coupons.length; i++) {
      const couponData = coupons[i];
      try {
        const { code, discountPercent, expiryDate, applicableCourses } = couponData;

        // Validate required fields
        if (!code || !discountPercent || !expiryDate) {
          errors.push({ index: i, error: "Code, discount percent, and expiry date are required" });
          continue;
        }

        // Check if code already exists
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
          errors.push({ index: i, error: `Coupon code '${code}' already exists` });
          continue;
        }

        // Validate applicable courses if provided
        let validatedCourses = [];
        if (applicableCourses && applicableCourses.length > 0) {
          validatedCourses = await Promise.all(
            applicableCourses.map(async (courseId) => {
              const course = await Course.findById(courseId);
              if (!course) {
                throw new Error(`Invalid course ID: ${courseId}`);
              }
              return course._id;
            })
          );
        }

        // Create the coupon
        const newCoupon = await Coupon.create({
          code: code.toUpperCase(),
          discountPercent: parseFloat(discountPercent),
          expiryDate: new Date(expiryDate),
          applicableCourses: validatedCourses,
        });

        results.push(newCoupon);
      } catch (error) {
        errors.push({ index: i, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        created: results,
        errors: errors,
        totalProcessed: coupons.length,
        successCount: results.length,
        errorCount: errors.length,
      },
      message: `Bulk coupon creation completed. ${results.length} created, ${errors.length} failed.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create bulk coupons",
      error: error.message,
    });
  }
};
















// Get all coupons (Admin only)
exports.getAllCoupons = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const adminDetails = await User.findById(userId);
    if (!adminDetails || adminDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view coupons",
      });
    }

    const allCoupons = await Coupon.find({}).populate("applicableCourses");

    res.status(200).json({
      success: true,
      data: allCoupons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

// Apply/Validate coupon for a course
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, courseId } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!couponCode || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and course ID are required",
      });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon is expired
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }

    // Check if coupon is already used
    if (coupon.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Coupon has already been used",
      });
    }

    // Check if applicable to this course
    if (coupon.applicableCourses.length > 0 && !coupon.applicableCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon not applicable to this course",
      });
    }

    // Calculate discounted price
    // Use finalPrice as base (which is already discountedPrice or originalPrice)
    const basePrice = course.finalPrice;
    const discountAmount = (basePrice * coupon.discountPercent) / 100;
    const couponDiscountedPrice = Math.max(0, basePrice - discountAmount);

    // Note: Do not set isUsed here; it should be set after successful payment in verifySignature

    res.status(200).json({
      success: true,
      data: {
        coupon,
        originalPrice: course.originalPrice,
        discountedPrice: course.finalPrice,
        couponDiscountedPrice,
        discountPercent: coupon.discountPercent,
      },
      message: "Coupon applied successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: error.message,
    });
  }
};

// Redeem coupon (Call this after successful payment to mark as used)
exports.redeemCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (coupon.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Coupon already redeemed",
      });
    }

    // Mark as used
    coupon.isUsed = true;
    await coupon.save();

    res.status(200).json({
      success: true,
      data: coupon,
      message: "Coupon redeemed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to redeem coupon",
      error: error.message,
    });
  }
};