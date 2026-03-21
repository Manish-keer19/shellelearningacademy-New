const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
  {
    courseName: { type: String },
    courseDescription: { type: String },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    whatYouWillLearn: { type: String },
    courseContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    // 💰 Pricing logic
    originalPrice: { type: Number, required: true }, // e.g. 2499
    discountedPrice: { type: Number, default: 0 },   // e.g. 1799
    discountPercent: { type: Number, default: 0 },   // auto-calculated
    finalPrice: { type: Number, default: 0 },        // after coupon (e.g. 1559)

    thumbnail: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    upcomingClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseClass" }],
    status: { type: String, enum: ["Draft", "Published"] },
    courseOverview: { type: String, required: true },
    courseLevel: { type: String, required: true },
    courseDuration: { type: String, required: true },
    brochures: {
      type: String,
      required: true
    },
    studentCount: {
      type: String,
      required: true
    },
    ratingValue: {
      type: String,
      required: true
    },

  },
  { timestamps: true }
);

// 🔁 Auto-calculate discountPercent
coursesSchema.pre("save", function (next) {
  if (this.discountedPrice && this.originalPrice) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
    this.finalPrice = this.discountedPrice; // default (before coupon)
  } else {
    this.discountPercent = 0;
    this.finalPrice = this.originalPrice;
  }
  next();
});

module.exports = mongoose.model("Course", coursesSchema);
