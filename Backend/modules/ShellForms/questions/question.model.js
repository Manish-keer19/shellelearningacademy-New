const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		formId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ShellForm",
			required: true,
		},
		questionText: {
			type: String,
			required: true,
			trim: true,
		},
		questionType: {
			type: String,
			enum: [
				"short_text",
				"long_text",
				"email",
				"phone",
				"number",
				"dropdown",
				"radio",
				"checkbox",
				"date",
				"rating",
				"multiple_choice",
				"paragraph",
			],
			required: true,
		},
		required: {
			type: Boolean,
			default: false,
		},
		options: [
			{
				label: String,
				value: String,
			},
		],
		order: {
			type: Number,
			required: true,
		},
		validationRules: {
			min: Number,
			max: Number,
			pattern: String,
			customError: String,
		},
		placeholder: {
			type: String,
			trim: true,
		},
		defaultValue: {
			type: mongoose.Schema.Types.Mixed,
		},
	},
	{ timestamps: true }
);

// Indexes for performance
questionSchema.index({ formId: 1, order: 1 });

module.exports = mongoose.model("ShellQuestion", questionSchema);
