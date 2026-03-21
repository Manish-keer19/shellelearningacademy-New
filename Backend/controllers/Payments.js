const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  //get courses, couponCode and UserID
  const { courses, couponCode } = req.body;
  const userId = req.user.id;
  //validation
  //valid courseID
  try {
    if (!courses || courses.length === 0) {
      return res.json({
        success: false,
        message: "Please provide valid course IDs",
      });
    }

    let totalAmount = 0;
    let validatedCourses = [];
    let coupon = null;

    // Validate coupon if provided
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
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

      // Check applicability for all courses
      const applicableCourseIds = coupon.applicableCourses.map(id => id.toString());
      if (applicableCourseIds.length > 0) {
        const invalidCourses = courses.filter(courseId => !applicableCourseIds.includes(courseId.toString()));
        if (invalidCourses.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Coupon not applicable to all selected courses",
          });
        }
      }
    }

    for (const course_id of courses) {
      let course;
      try {
        course = await Course.findById(course_id);
        if (!course) {
          return res.json({
            success: false,
            message: "Could not find the course",
          });
        }

        //user already enrolled for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(200).json({
            success: false,
            message: "Student is already enrolled in one or more courses",
          });
        }

        let courseAmount = course.finalPrice;

        // Apply coupon discount if provided and applicable
        if (coupon) {
          const discountAmount = (courseAmount * coupon.discountPercent) / 100;
          courseAmount = Math.max(0, courseAmount - discountAmount);
        }

        totalAmount += courseAmount;
        validatedCourses.push({ id: course_id, amount: courseAmount });
      } catch (error) {
        console.error(" some error   ", error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    const options = {
      amount: Math.round(totalAmount * 100), // Ensure integer paise
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courses: courses.map(c => c.toString()),
        userId: userId.toString(),
        couponCode: couponCode || null,
      },
    };

    try {
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      // console.log("payment", paymentResponse);
      //return response
      return res.status(200).json({
        success: true,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
        couponCode: couponCode || null, // For frontend reference
      });
    } catch (error) {
      console.error("payment error=", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify the signature
exports.verifySignature = async (req, res) => {
  //get the payment details
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const { courses, couponCode } = req.body;
  const userId = req.user.id;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment details are incomplete",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const enrolleStudent = async (courses, userId, couponCode) => {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid courses and user ID",
      });
    }
    try {
      // If coupon used, mark it as used
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.isUsed = true;
          await coupon.save();
        }
      }

      let enrolledCourses = [];
      //update the course
      for (const course_id of courses) {
        // console.log("verify courses=", course_id);
        const course = await Course.findByIdAndUpdate(
          course_id,
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );
        //update the user
        const user = await User.updateOne(
          { _id: userId },
          { $push: { courses: course_id } },
          { new: true }
        );
        //set course progress
        const newCourseProgress = new CourseProgress({
          userID: userId,
          courseID: course_id,
        });
        await newCourseProgress.save();

        //add new course progress to user
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { courseProgress: newCourseProgress._id },
          },
          { new: true }
        );

        enrolledCourses.push({
          id: course._id,
          name: course.courseName,
          description: course.courseDescription,
          thumbnail: course.thumbnail
        });
      }
      return res.status(200).json({
        success: true,
        message: "Payment successful",
        enrolledCourses,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  try {
    //verify the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");
    if (generatedSignature === razorpay_signature) {
      await enrolleStudent(courses, userId, couponCode);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//send payment success (email removed)
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { amount, paymentId, orderId } = req.body;
  const userId = req.user.id;
  if (!amount || !paymentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid payment details",
    });
  }
  try {
    // Email sending removed - just return success
    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};