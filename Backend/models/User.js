// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		// New fields for enrollment
		contactNo: {
			type: String,
			trim: true,
		},
		batch: {
			type: String,
			trim: true,
		},
		state: {
			type: String,
			trim: true,
		},
		college: {
			type: String,
			trim: true,
		},
		enrolledCourse: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},

		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
			trim: true,
		},

		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of "Admin" or "Student"
		accountType: {
			type: String,
			enum: ["Admin", "Student", "Employee", "Manager", "Super Admin"],
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		workshops: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Workshop",
			},
		],
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		image: {
			type: String,
			required: true,
		},
		courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],
		commissionBalance: {
			type: Number,
			default: 0,
		},

		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("user", userSchema);