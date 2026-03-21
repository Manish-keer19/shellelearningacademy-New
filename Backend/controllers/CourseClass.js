const CourseClass = require("../models/CourseClass");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { uploadFileToCloudinary } = require("../utils/imageUploader");

// Create a new class
exports.createClass = async (req, res) => {
    try {
        const { courseId, className, classDescription, classUrl, classDate, recordingUrl } = req.body;

        if (!courseId || !className || !classDescription || !classUrl || !classDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Handle PDF document upload if provided
        console.log('📁 req.files:', req.files);
        console.log('📁 req.body:', req.body);

        let documentFile = null;
        if (req.files && req.files.documentFile) {
            const pdfFile = req.files.documentFile;
            console.log('📄 PDF file received:', pdfFile.name, pdfFile.size);

            // Upload PDF to Cloudinary
            const uploadedPdf = await uploadFileToCloudinary(
                pdfFile,
                "class_documents",
                null,
                null,
                true // isPdf flag
            );

            console.log('✅ PDF uploaded to Cloudinary:', uploadedPdf.secure_url);

            documentFile = {
                secure_url: uploadedPdf.secure_url,
                public_id: uploadedPdf.public_id,
            };
        } else {
            console.log('⚠️ No document file in request');
        }

        const newClass = await CourseClass.create({
            course: courseId,
            className,
            classDescription,
            classUrl,
            classDate,
            recordingUrl: recordingUrl || null,
            documentFile: documentFile,
        });

        // Add class to course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { upcomingClasses: newClass._id },
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create class",
            error: error.message,
        });
    }
};

// Update a class
exports.updateClass = async (req, res) => {
    try {
        console.log('\n🔄 ========== UPDATE CLASS REQUEST ==========');
        console.log('📋 Headers:', req.headers);
        console.log('📋 Content-Type:', req.headers['content-type']);
        console.log('📋 req.body keys:', Object.keys(req.body));
        console.log('📋 req.files:', req.files);
        console.log('📋 req.body:', req.body);
        console.log('==========================================\n');

        const { classId, className, classDescription, classUrl, classDate, recordingUrl } = req.body;

        if (!classId) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required",
            });
        }

        // Prepare update data
        const updateData = {
            className,
            classDescription,
            classUrl,
            classDate,
            recordingUrl,
        };

        // Handle PDF document upload if provided
        console.log('📁 UPDATE - req.files:', req.files);
        console.log('📁 UPDATE - req.body:', req.body);

        if (req.files && req.files.documentFile) {
            const pdfFile = req.files.documentFile;
            console.log('📄 UPDATE - PDF file received:', pdfFile.name, pdfFile.size);

            // Upload new PDF to Cloudinary
            const uploadedPdf = await uploadFileToCloudinary(
                pdfFile,
                "class_documents",
                null,
                null,
                true // isPdf flag
            );

            console.log('✅ UPDATE - PDF uploaded to Cloudinary:', uploadedPdf.secure_url);

            updateData.documentFile = {
                secure_url: uploadedPdf.secure_url,
                public_id: uploadedPdf.public_id,
            };
        } else {
            console.log('⚠️ UPDATE - No document file in request');
        }

        const updatedClass = await CourseClass.findByIdAndUpdate(
            classId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update class",
            error: error.message,
        });
    }
};

// Delete a class
exports.deleteClass = async (req, res) => {
    try {
        const { classId, courseId } = req.body;

        if (!classId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Class ID and Course ID are required",
            });
        }

        await CourseClass.findByIdAndDelete(classId);

        // Remove from course
        await Course.findByIdAndUpdate(courseId, {
            $pull: { upcomingClasses: classId },
        });

        return res.status(200).json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete class",
            error: error.message,
        });
    }
};


// Get all classes for a course
exports.getClassesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const classes = await CourseClass.find({ course: courseId }).sort({ classDate: 1 });

        // Ensure backward compatibility - convert old documentUrl to documentFile format
        const processedClasses = classes.map(cls => {
            const classObj = cls.toObject();

            // If documentUrl exists but documentFile doesn't, convert it
            if (classObj.documentUrl && !classObj.documentFile) {
                classObj.documentFile = {
                    secure_url: classObj.documentUrl,
                    public_id: null
                };
            }

            return classObj;
        });

        return res.status(200).json({
            success: true,
            message: "Classes fetched successfully",
            data: processedClasses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get classes",
            error: error.message,
        });
    }
};

// Mark class as complete
exports.markClassAsComplete = async (req, res) => {
    try {
        const { courseId, classId } = req.body;
        const userId = req.user.id;

        if (!courseId || !classId) {
            return res.status(400).json({
                success: false,
                message: "Course ID and Class ID are required",
            });
        }

        // Find or create course progress
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userID: userId,
        });

        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                courseID: courseId,
                userID: userId,
                completedVideos: [],
                completedClasses: [classId],
            });
        } else {
            // Check if already completed
            if (courseProgress.completedClasses.includes(classId)) {
                return res.status(400).json({
                    success: false,
                    message: "Class already marked as complete",
                });
            }

            // Add to completed classes
            courseProgress.completedClasses.push(classId);
            await courseProgress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Class marked as complete",
            data: courseProgress,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark class as complete",
            error: error.message,
        });
    }
};
