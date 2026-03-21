const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		headerImage: {
			type: String, // URL/Path to image
		},
		footerImage: {
			type: String, // URL/Path to image
		},
		status: {
			type: String,
			enum: ["Draft", "Published", "Closed"],
			default: "Draft",
		},
		thankYouMessage: {
			type: String,
			default: "Thank you for your response!",
		},
		expiryDate: {
			type: Date,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		
	},
	{ timestamps: true }
);

// Index for slug for fast lookup
formSchema.index({ slug: 1 });

module.exports = mongoose.model("ShellForm", formSchema);
