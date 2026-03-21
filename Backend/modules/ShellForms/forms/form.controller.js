const mongoose = require("mongoose");
const formService = require("./form.service");
const questionService = require("../questions/question.service");

class FormController {
	async createForm(req, res) {
		try {
			const formData = {
				...req.body,
				createdBy: req.user.id, // Assuming auth middleware adds user to req
			};
			const form = await formService.createForm(formData);
			res.status(201).json({ success: true, data: form });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async getForms(req, res) {
		try {
			const forms = await formService.getForms({ createdBy: req.user.id });
			res.status(200).json({ success: true, data: forms });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async getFormById(req, res) {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return res.status(400).json({ success: false, message: "Invalid Form ID" });
			}
			const form = await formService.getFormById(req.params.id);
			if (!form) return res.status(404).json({ success: false, message: "Form not found" });
			
			const questions = await questionService.getQuestionsByFormId(form._id);
			res.status(200).json({ success: true, data: { ...form._doc, questions } });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async updateForm(req, res) {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return res.status(400).json({ success: false, message: "Invalid Form ID" });
			}
			const form = await formService.updateForm(req.params.id, req.body);
			res.status(200).json({ success: true, data: form });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async deleteForm(req, res) {
		try {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return res.status(400).json({ success: false, message: "Invalid Form ID" });
			}
			await formService.deleteForm(req.params.id);
			res.status(200).json({ success: true, message: "Form deleted successfully" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	// Public API
	async getPublicFormBySlug(req, res) {
		try {
			const form = await formService.getFormBySlug(req.params.slug);
			if (!form) return res.status(404).json({ success: false, message: "Form not found or closed" });
			
			const questions = await questionService.getQuestionsByFormId(form._id);
			res.status(200).json({ success: true, data: { ...form._doc, questions } });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}

module.exports = new FormController();
