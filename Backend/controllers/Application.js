const Application = require("../models/Application");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mailSender = require("../utils/mailSender");

exports.createApplication = async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobile,
            position,
            experience,
            location,
            coverMessage,
        } = req.body;
        const resume = req.files.resume;

        if (
            !fullName ||
            !email ||
            !mobile ||
            !position ||
            !experience ||
            !location ||
            !resume
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const resumeUrl = await uploadImageToCloudinary(
            resume,
            process.env.FOLDER_NAME
        );

        const newApplication = await Application.create({
            fullName,
            email,
            mobile,
            position,
            experience,
            location,
            resume: resumeUrl.secure_url,
            coverMessage,
        });

        await mailSender(
            "hr@example.com",
            `New Application for ${position}`,
            `
        <p>A new application has been submitted for the position of ${position}.</p>
        <p><b>Full Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Experience:</b> ${experience} years</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Cover Message:</b> ${coverMessage}</p>
        <p><b>Resume:</b> <a href="${resumeUrl.secure_url}">View Resume</a></p>
        `
        );

        return res.status(200).json({
            success: true,
            message: "Application submitted successfully",
            data: newApplication,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the application",
            error: error.message,
        });
    }
};
