const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ShellQuestion",
		required: true,
	},
	value: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
});

const formResponseSchema = new mongoose.Schema(
	{
		formId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ShellForm",
			required: true,
		},
		submittedAt: {
			type: Date,
			default: Date.now,
		},
		submittedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user", // Optional: if user is logged in
		},
		answers: [answerSchema],
		metadata: {
			ip: String,
			userAgent: String,
		},
	},
	{ timestamps: true }
);

// Indexes
formResponseSchema.index({ formId: 1 });
formResponseSchema.index({ submittedAt: -1 });

module.exports = mongoose.model("ShellFormResponse", formResponseSchema);
module.exports.ShellAnswer = mongoose.model("ShellAnswer", answerSchema); // Usually not needed as standalone but requested in schema structure
