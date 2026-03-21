const mongoose = require("mongoose");
const ShellFormResponse = require("./response.model");

class ResponseService {
	async submitResponse(responseData) {
		const response = new ShellFormResponse(responseData);
		return await response.save();
	}

	async getResponsesByFormId(formId, options = {}) {
		const { page = 1, limit = 50 } = options;
		const skip = (page - 1) * limit;

		const responses = await ShellFormResponse.find({ formId })
			.sort({ submittedAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("answers.questionId");
		
		const total = await ShellFormResponse.countDocuments({ formId });

		return {
			responses,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		};
	}

	async getResponseStatistics(formId) {
		const stats = await ShellFormResponse.aggregate([
			{ $match: { formId: new mongoose.Types.ObjectId(formId) } },
			{
				$group: {
					_id: "$formId",
					submissionCount: { $sum: 1 },
					lastSubmission: { $max: "$submittedAt" },
				},
			},
		]);
		return stats[0] || { submissionCount: 0 };
	}
}

module.exports = new ResponseService();
