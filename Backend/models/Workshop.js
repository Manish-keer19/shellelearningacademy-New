const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        date: { type: String, required: true }, // e.g., "Oct 15, 2023" or ISO date string
        time: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
        mode: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            required: true,
        },
        type: {
            type: String,
            enum: ["Free", "Paid"],
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        status: {
            type: String,
            enum: ["Draft", "Published", "Completed", "Cancelled"],
            default: "Draft",
        },
        whatYouWillLearn: {
            type: [String],
        },
        whoShouldAttend: {
            type: [String],
        },
        certification: {
            type: Boolean,
            default: false,
        },
        meetingLink: {
            type: String, // For online workshops
        },
        location: {
            type: String, // For offline workshops
        },
        studentCount: {
            type: String,
            default: "0"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workshop", workshopSchema);
