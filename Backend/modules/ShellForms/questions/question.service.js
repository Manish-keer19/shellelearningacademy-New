const ShellQuestion = require("./question.model");

class QuestionService {
	async addQuestion(questionData) {
		const lastQuestion = await ShellQuestion.findOne({ formId: questionData.formId })
			.sort({ order: -1 });
		
		const order = lastQuestion ? lastQuestion.order + 1 : 0;
		const question = new ShellQuestion({ ...questionData, order });
		return await question.save();
	}

	async getQuestionsByFormId(formId) {
		return await ShellQuestion.find({ formId }).sort({ order: 1 });
	}

	async updateQuestion(id, updateData) {
		return await ShellQuestion.findByIdAndUpdate(id, updateData, { new: true });
	}

	async deleteQuestion(id) {
		return await ShellQuestion.findByIdAndDelete(id);
	}

	async reorderQuestions(formId, questionOrderMap) {
		// questionOrderMap = { [questionId]: newOrder }
		const updates = Object.entries(questionOrderMap).map(([id, order]) =>
			ShellQuestion.findByIdAndUpdate(id, { order })
		);
		return await Promise.all(updates);
	}

	async bulkInsertQuestions(formId, questions) {
		const questionsWithFormId = questions.map((q, idx) => ({
			...q,
			formId,
			order: idx,
		}));
		return await ShellQuestion.insertMany(questionsWithFormId);
	}
}

module.exports = new QuestionService();
