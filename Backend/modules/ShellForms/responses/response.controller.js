const responseService = require("./response.service");
const formService = require("../forms/form.service");
const { uploadFileToCloudinary } = require("../../../utils/imageUploader");
const ShellQuestion = require("../questions/question.model");
const EMSLead = require("../../../models/ems/Lead");
const User = require("../../../models/User");

class ResponseController {
	async submitResponse(req, res) {
		try {
			const form = await formService.getFormBySlug(req.params.slug);
			if (!form) return res.status(404).json({ success: false, message: "Form not found" });

			const responseData = {
				formId: form._id,
				answers: req.body.answers,
				submittedBy: req.user ? req.user.id : null,
				metadata: {
					ip: req.ip,
					userAgent: req.get("User-Agent"),
				},
			};

			const response = await responseService.submitResponse(responseData);

			try {
				const questions = await ShellQuestion.find({ formId: form._id });
				let name = "", email = "", phone = "";

				// Map answers to Lead fields by checking question text and type
				req.body.answers.forEach(ans => {
					const q = questions.find(q => q._id.toString() === ans.questionId.toString());
					if (q) {
						const qText = q.questionText.toLowerCase();
						const qType = q.questionType;
						
						if (qType === 'email' || qText.includes('email')) {
							email = ans.value;
						} else if (qType === 'phone' || qText.includes('phone') || qText.includes('mobile') || qText.includes('number')) {
							phone = ans.value;
						} else if (qText.includes('name') && !name) {
							name = ans.value;
						}
					}
				});

				// We need name, email, and phone to create a valid EMSLead based on the schema requirements
				// But we'll allow partials by handling potential validation issues or just provide defaults
				if (name || email || phone) {
					// Fallback to "Super Admin" if no req.user
					let createdBy = req.user ? req.user.id : null;
					if (!createdBy) {
						const superAdmin = await User.findOne({ accountType: "Super Admin" });
						if (superAdmin) createdBy = superAdmin._id;
					}

					if (createdBy) {
						await EMSLead.create({
							name: name || "Unknown Lead",
							email: email || "no-email@example.com",
							mobile: phone || "0000000000",
							createdBy: createdBy,
							description: `Captured from ShellForm: ${form.title || form.slug || form._id}`,
						});
					}
				}
			} catch (leadError) {
				console.error("Error creating Lead from form response:", leadError);
				// Do not throw, as we still want to return the form response success
			}

			res.status(201).json({ success: true, data: response });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async getResponses(req, res) {
		try {
			const { page, limit } = req.query;
			const data = await responseService.getResponsesByFormId(req.params.formId, { page, limit });
			res.status(200).json({ success: true, data });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	async uploadFile(req, res) {
		try {
			if (!req.files || !req.files.file) {
				return res.status(400).json({ success: false, message: "No file uploaded" });
			}

			const file = req.files.file;
			const folder = process.env.FOLDER_NAME || "ShellForms";
			const uploadDetails = await uploadFileToCloudinary(file, folder);

			res.status(200).json({
				success: true,
				message: "File uploaded successfully",
				url: uploadDetails.secure_url,
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	}
}

module.exports = new ResponseController();
