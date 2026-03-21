const questionService = require("./question.service");

class QuestionController {
	async addQuestion(req, res) {
		try {
			const questionData = {
				...req.body,
				formId: req.params.formId || req.body.formId,
			};
			const question = await questionService.addQuestion(questionData);
			res.status(201).json({ success: true, data: question });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async updateQuestion(req, res) {
		try {
			const question = await questionService.updateQuestion(req.params.id, req.body);
			res.status(200).json({ success: true, data: question });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async deleteQuestion(req, res) {
		try {
			await questionService.deleteQuestion(req.params.id);
			res.status(200).json({ success: true, message: "Question deleted successfully" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async reorderQuestions(req, res) {
		try {
			await questionService.reorderQuestions(req.params.formId, req.body.orderMap);
			res.status(200).json({ success: true, message: "Questions reordered" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async getQuestionsByFormId(req, res) {
		try {
			const questions = await questionService.getQuestionsByFormId(req.params.formId);
			res.status(200).json({ success: true, data: questions });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}

module.exports = new QuestionController();
