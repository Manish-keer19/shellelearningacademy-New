// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    expiryDate: { type: Date, required: true },
    applicableCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    // 👇 Only once use
    isUsed: { type: Boolean, default: false },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
