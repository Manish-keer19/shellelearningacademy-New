const User = require("../models/User");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const bcrypt = require("bcryptjs");

/**
 * Admin Controller: Create User and Enroll in Course
 * This allows admin to create a new user and enroll them in a course without payment
 */
exports.createUserAndEnroll = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            contactNo,
            batch,
            state,
            college,
            courseId,
            accountType = "Student",
        } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required",
            });
        }

        // Check if user already exists (using lean for faster query)
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNo || null,
        });

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            accountType,
            contactNo,
            batch,
            state,
            college,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
            approved: true,
            active: true,
        });

        // If courseId is provided, enroll the user
        if (courseId) {
            const course = await Course.findById(courseId).lean();
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            // Check if user is already enrolled
            if (course.studentsEnrolled.some(id => id.toString() === user._id.toString())) {
                return res.status(400).json({
                    success: false,
                    message: "User is already enrolled in this course",
                });
            }

            // Create course progress
            const newCourseProgress = await CourseProgress.create({
                userID: user._id,
                courseID: courseId,
            });

            // Perform all updates in a single batch operation
            await Promise.all([
                Course.findByIdAndUpdate(
                    courseId,
                    { $push: { studentsEnrolled: user._id } }
                ),
                User.findByIdAndUpdate(
                    user._id,
                    {
                        $push: {
                            courses: courseId,
                            courseProgress: newCourseProgress._id
                        }
                    }
                )
            ]);


            return res.status(201).json({
                success: true,
                message: "User created and enrolled in course successfully",
                data: {
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        accountType: user.accountType,
                    },
                    course: {
                        id: course._id,
                        name: course.courseName,
                    },
                },
            });
        }

        // If no course enrollment, just return user creation success
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    accountType: user.accountType,
                },
            },
        });
    } catch (error) {
        console.error("Error in createUserAndEnroll:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create user and enroll in course",
            error: error.message,
        });
    }
};

/**
 * Admin Controller: Enroll Existing User in Course
 * This allows admin to enroll an existing user in a course without payment
 */
exports.enrollUserInCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // Validation
        if (!userId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Course ID are required",
            });
        }

        // Fetch user and course in parallel (using lean for faster queries)
        const [user, course] = await Promise.all([
            User.findById(userId).lean(),
            Course.findById(courseId).lean()
        ]);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if course exists
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if user is already enrolled
        if (course.studentsEnrolled.some(id => id.toString() === userId.toString())) {
            return res.status(400).json({
                success: false,
                message: "User is already enrolled in this course",
            });
        }

        // Create course progress
        const newCourseProgress = await CourseProgress.create({
            userID: userId,
            courseID: courseId,
        });

        // Perform all updates in parallel
        await Promise.all([
            Course.findByIdAndUpdate(
                courseId,
                { $push: { studentsEnrolled: userId } }
            ),
            User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: newCourseProgress._id
                    }
                }
            )
        ]);


        return res.status(200).json({
            success: true,
            message: "User enrolled in course successfully",
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                },
                course: {
                    id: course._id,
                    name: course.courseName,
                },
            },
        });
    } catch (error) {
        console.error("Error in enrollUserInCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to enroll user in course",
            error: error.message,
        });
    }
};

/**
 * Admin Controller: Get All Users
 * This allows admin to view all users in the system (Students only, not Admins)
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Only fetch Student users, not Admin users
        const users = await User.find({ accountType: "Student" })
            .select("-password")
            .populate("additionalDetails")
            .populate("courses", "courseName thumbnail")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

/**
 * Admin Controller: Get All Courses for Enrollment
 * This returns all courses that can be used for enrollment
 */
exports.getAllCoursesForEnrollment = async (req, res) => {
    try {
        const courses = await Course.find({ status: "Published" })
            .select("courseName courseDescription thumbnail finalPrice price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses,
        });
    } catch (error) {
        console.error("Error in getAllCoursesForEnrollment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message,
        });
    }
};
