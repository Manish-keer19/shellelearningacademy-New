const ShellForm = require("./form.model");
const ShellQuestion = require("../questions/question.model");

class FormService {
	async createForm(formData) {
		if (!formData.slug && formData.title) {
			formData.slug = formData.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
		}

		// Ensure unique slug
		let slug = formData.slug;
		let existing = await ShellForm.findOne({ slug });
		if (existing) {
			formData.slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
		}

		const form = new ShellForm(formData);
		return await form.save();
	}

	async getForms(query = {}) {
		return await ShellForm.find(query).sort({ createdAt: -1 });
	}

	async getFormById(id) {
		return await ShellForm.findById(id);
	}

	async getFormBySlug(slug) {
		return await ShellForm.findOne({ slug, status: "Published" });
	}

	async updateForm(id, updateData) {
		if (updateData.slug) {
			const existing = await ShellForm.findOne({ slug: updateData.slug, _id: { $ne: id } });
			if (existing) {
				updateData.slug = `${updateData.slug}-${Math.random().toString(36).substring(2, 6)}`;
			}
		}
		return await ShellForm.findByIdAndUpdate(id, updateData, { new: true });
	}

	async deleteForm(id) {
		// Delete form questions too
		await ShellQuestion.deleteMany({ formId: id });
		return await ShellForm.findByIdAndDelete(id);
	}
}

module.exports = new FormService();
