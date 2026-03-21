const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
// Method for updating a profile

exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber = "", firstName, lastName, gender = "" } = req.body;
		const id = req.user.id;

		// Find the user
		const userDetails = await User.findById(id);
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Update profile fields using findByIdAndUpdate
		const profile = await Profile.findByIdAndUpdate(
			userDetails.additionalDetails,
			{
				dateOfBirth: dateOfBirth || undefined,
				about: about || undefined,
				gender: gender || undefined,
				contactNumber: contactNumber || undefined,
			},
			{ new: true, omitUndefined: true }
		);

		// Update user fields using findByIdAndUpdate
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				firstName: firstName || undefined,
				lastName: lastName || undefined,
			},
			{ new: true, omitUndefined: true }
		).populate("additionalDetails");

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
			userDetails: updatedUser
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		const id = req.user.id;
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		// console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully", error: error.message });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		// console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getEnrolledCourses = async (req, res) => {
	try {
		const id = req.user.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		const enrolledCourses = await User.findById(id).populate({
			path: "courses",
			populate: {
				path: "courseContent",
			}
		}).populate({
			path: "courses",
			populate: {
				path: "upcomingClasses"
			}
		})
			.populate("courseProgress").exec();
		// console.log(enrolledCourses);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: enrolledCourses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
	try {

		const id = req.user.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		const image = req.files.pfp;
		if (!image) {
			return res.status(404).json({
				success: false,
				message: "Image not found",
			});
		}
		const uploadDetails = await uploadFileToCloudinary(
			image,
			"StudyNotionCollage/Profiles"
		);
		// console.log(uploadDetails);

		const updatedImage = await User.findByIdAndUpdate({ _id: id }, { image: uploadDetails.secure_url }, { new: true });

		res.status(200).json({
			success: true,
			message: "Image updated successfully",
			data: updatedImage,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});

	}



}

//admin dashboard
exports.instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const courseData = await Course.find({ instructor: id });
		const courseDetails = courseData.map((course) => {
			totalStudents = course?.studentsEnrolled?.length;
			totalRevenue = course?.price * totalStudents;
			const courseStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudents,
				totalRevenue,
			};
			return courseStats;
		});
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}
// Update Password (requires current password verification)
exports.updatePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user.id;

		// Validation
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Current password and new password are required",
			});
		}

		// Validate new password strength
		if (newPassword.length < 6) {
			return res.status(400).json({
				success: false,
				message: "New password must be at least 6 characters long",
			});
		}

		// Find user with password field
		const user = await User.findById(userId).select("+password");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Verify current password
		const bcrypt = require("bcryptjs");
		const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		// Check if new password is same as current
		const isSamePassword = await bcrypt.compare(newPassword, user.password);
		if (isSamePassword) {
			return res.status(400).json({
				success: false,
				message: "New password cannot be the same as current password",
			});
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update password using findByIdAndUpdate to avoid validation issues
		await User.findByIdAndUpdate(
			userId,
			{ password: hashedPassword },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		console.error("Error updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update password",
			error: error.message,
		});
	}
};

