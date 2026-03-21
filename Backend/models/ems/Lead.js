const mongoose = require("mongoose");

const emsLeadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        employeeDescription: {
            type: String,
            trim: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Interested", "Converted", "Enrolled", "Lost"],
            default: "New",
        },
        enrolledCourse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        enrollmentDate: {
            type: Date,
        },
        enrollmentAmount: {
            type: Number,
        },
        isEnrollmentVerified: {
            type: Boolean,
            default: false,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        isStatusUpdated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EMSLead", emsLeadSchema);
