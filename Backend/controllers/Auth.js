const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");

const Profile = require("../models/Profile");
const { generateAccessToken, generateRefreshToken, generateEnrollmentToken } = require("../utils/token");
require("dotenv").config();

// Signup Controller for Registering Users with OTP verification
exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			fullName,
			email,
			password,
			accountType,
			contactNo,

		} = req.body;

		// Check if All Details are there or not
		if (!fullName || !email) {
			return res.status(403).send({
				success: false,
				message: "Full name and email are required",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Generate random password if not provided
		let userPassword = password;
		if (!password) {
			userPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(userPassword, 10);

		// Create the user
		let approved = true;

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: additionalDetails?.contactNumber || contactNumber || null
		});

		const user = await User.create({
			fullName,
			email,
			contactNumber,
			contactNo: contactNo || contactNumber,
			batch,
			state,
			college,
			password: hashedPassword,
			accountType: accountType || "Student",
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/6.x/initials/svg?seed=${fullName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
		});


		// Remove password from user object
		user.password = undefined;

		return res.status(200).json({
			success: true,
			token,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};



exports.PersonalInfoUserForEnrollment = async (req, res) => {
	try {
		const {
			fullName,
			email,
			contactNumber,
			contactNo,
			batch,
			state,
			college,
			additionalDetails,
		} = req.body;

		const primaryContact = contactNumber || contactNo;

		if (!fullName || !email || !primaryContact || !batch || !state || !college) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// CHECK IF ALREADY REGISTERED
		let existingUser = await User.findOne({ email });

		if (existingUser) {
			const payload = { id: existingUser._id, email: existingUser.email, accountType: existingUser.accountType };
			// Temporary enrollment token (not login token)
			const enrollmentToken = generateEnrollmentToken(payload);

			return res.status(200).json({
				success: true,
				existing: true,
				enrollmentToken,
				user: {
					fullName: existingUser.fullName,
					email: existingUser.email,
					id: existingUser._id,
				},
				message: "User exists. Continue enrollment.",
			});
		}

		// NEW USER FLOW
		const profileDetails = await Profile.create({
			about: additionalDetails || null,
			contactNumber: primaryContact,
			batch,
			state,
			college,
		});

		const encryptedPassword = await bcrypt.hash("temp", 10);

		const user = await User.create({
			fullName,
			email,
			contactNumber: primaryContact,
			batch,
			state,
			college,
			password: encryptedPassword,
			accountType: "Student",
			approved: false,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/6.x/initials/svg?seed=${fullName}-${profileDetails._id}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
		});


		const payload = { id: user._id, email: user.email, accountType: user.accountType };
		// Temporary enrollment token (not login token)
		const enrollmentToken = generateEnrollmentToken(payload);

		return res.status(200).json({
			success: true,
			existing: false,
			enrollmentToken,
			user: {
				fullName: user.fullName,
				email: user.email,
				id: user._id,
			},
			message: "Enrollment started successfully.",
		});

	} catch (error) {
		console.error("Enrollment Error:", error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};



exports.verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email and OTP are required",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

		if (response.length === 0) {
			return res.status(400).json({
				success: false,
				message: "OTP not found or expired",
			});
		}

		if (otp !== response[0].otp) {
			return res.status(400).json({
				success: false,
				message: "Invalid OTP",
			});
		}

		return res.status(200).json({
			success: true,
			message: "OTP verified successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Error verifying OTP",
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log("emaain and password in login",email,password)

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide email and password",
			});
		}

		let user = await User.findOne({ email }).populate("additionalDetails");

		if (user && user.accountType === "Student") {
			user = await User.findOne({ email })
				.populate("additionalDetails")
				.populate({
					path: "courses",
					select: "courseName courseDescription thumbnail"
				});
		}

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// console.log("password is ",password)
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const payload = { id: user._id, email: user.email, accountType: user.accountType };

		const accessToken = generateAccessToken(payload);
		console.log("accessToken", accessToken);
		const refreshToken = generateRefreshToken(payload);

		// Set Refresh Token in Cookie
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false, //
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		user.password = undefined;

		return res.status(200).json({
			success: true,
			accessToken,
			user,
			message: "Login successful",
		});

	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Login failed",
		});
	}
};
// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		// console.log("Result is Generate OTP Func");
		// console.log("OTP", otp);
		// console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		// console.log("OTP Body", otpBody);

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,

		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (oldPassword === newPassword) {
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}

		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"Study Notion - Password Updated",
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.fullName} ${updatedUserDetails.lastName}`
				)
			);
			// console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};


exports.refreshToken = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;

		if (!token) {
			return res.status(401).json({ success: false, message: "No refresh token" });
		}

		jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({ success: false, message: "Invalid refresh token" });
			}

			const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, accountType: decoded.accountType });

			return res.json({
				success: true,
				accessToken: newAccessToken
			});
		});

	} catch (error) {
		console.log("Refresh error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
