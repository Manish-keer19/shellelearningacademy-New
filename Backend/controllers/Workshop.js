const Workshop = require("../models/Workshop");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/imageUploader");

// Create Workshop (Admin Only)
exports.createWorkshop = async (req, res) => {
    try {
        const userId = req.user.id;
        let {
            title,
            description,
            date,
            time,
            mode,
            type,
            price,
            status,
            whatYouWillLearn,
            whoShouldAttend,
            certification,
            meetingLink,
            location,
        } = req.body;

        const thumbnail = req.files?.thumbnail;

        // Validation
        if (!title || !description || !date || !time || !mode || !type || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory.",
            });
        }

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can create workshops.",
            });
        }

        // Upload Thumbnail
        const thumbnailImage = await uploadFileToCloudinary(
            thumbnail,
            "shellElearning/workshops"
        );

        // Create Workshop
        const newWorkshop = await Workshop.create({
            title,
            description,
            instructor: userId,
            date,
            time,
            mode,
            type,
            price: type === "Paid" ? price : 0,
            thumbnail: thumbnailImage.secure_url,
            // status: status || "Draft",
            status: status || "Published",
            whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [],
            whoShouldAttend: whoShouldAttend ? JSON.parse(whoShouldAttend) : [],
            certification: certification === "true",
            meetingLink,
            location,
        });

        res.status(201).json({
            success: true,
            message: "Workshop created successfully!",
            data: newWorkshop,
        });
    } catch (error) {
        console.error("Error creating workshop:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create workshop.",
            error: error.message,
        });
    }
};

// Get All Workshops
exports.getAllWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({ status: "Published" })
            .populate("instructor", "fullName email image")
            .sort({ createdAt: -1 });

        console.log("all workshops", workshops)

        res.status(200).json({
            success: true,
            message: "Workshops fetched successfully",
            data: workshops,
        });
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch workshops",
            error: error.message,
        });
    }
};

// Get Single Workshop Details
exports.getWorkshopDetails = async (req, res) => {
    try {
        const { workshopId } = req.body;
        const workshop = await Workshop.findById(workshopId)
            .populate("instructor", "fullName email image")
            .populate("studentsEnrolled", "fullName email image");

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: "Workshop not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Workshop details fetched successfully",
            data: workshop,
        });
    } catch (error) {
        console.error("Error fetching workshop details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch workshop details",
            error: error.message,
        });
    }
};

// Enroll in Workshop
exports.enrollWorkshop = async (req, res) => {
    try {
        const { workshopId } = req.body;
        const userId = req.user.id;

        if (!workshopId) {
            return res.status(400).json({
                success: false,
                message: "Workshop ID is required",
            });
        }

        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: "Workshop not found",
            });
        }

        // Check if already enrolled
        if (workshop.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled",
            });
        }

        // Add student to workshop
        workshop.studentsEnrolled.push(userId);
        await workshop.save();

        // Add workshop to user
        await User.findByIdAndUpdate(userId, {
            $push: { workshops: workshopId },
        });

        // Send email (Optional - can be added later)

        res.status(200).json({
            success: true,
            message: "Enrolled in workshop successfully",
        });
    } catch (error) {
        console.error("Error enrolling in workshop:", error);
        res.status(500).json({
            success: false,
            message: "Failed to enroll in workshop",
            error: error.message,
        });
    }
};

// Update Workshop (Admin Only)
exports.updateWorkshop = async (req, res) => {
    try {
        const { workshopId } = req.params;
        const userId = req.user.id;
        let {
            title,
            description,
            date,
            time,
            mode,
            type,
            price,
            status,
            whatYouWillLearn,
            whoShouldAttend,
            certification,
            meetingLink,
            location,
        } = req.body;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can update workshops.",
            });
        }

        // Find workshop
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: "Workshop not found",
            });
        }

        // Prepare update data
        const updateData = {
            title: title || workshop.title,
            description: description || workshop.description,
            date: date || workshop.date,
            time: time || workshop.time,
            mode: mode || workshop.mode,
            type: type || workshop.type,
            price: type === "Paid" ? (price || workshop.price) : 0,
            status: status || workshop.status,
            whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : workshop.whatYouWillLearn,
            whoShouldAttend: whoShouldAttend ? JSON.parse(whoShouldAttend) : workshop.whoShouldAttend,
            certification: certification !== undefined ? certification === "true" : workshop.certification,
            meetingLink: meetingLink !== undefined ? meetingLink : workshop.meetingLink,
            location: location !== undefined ? location : workshop.location,
        };

        // Upload new thumbnail if provided
        if (req.files?.thumbnail) {
            const thumbnailImage = await uploadFileToCloudinary(
                req.files.thumbnail,
                "shellElearning/workshops"
            );
            updateData.thumbnail = thumbnailImage.secure_url;
        }

        // Update Workshop
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            workshopId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Workshop updated successfully!",
            data: updatedWorkshop,
        });
    } catch (error) {
        console.error("Error updating workshop:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update workshop.",
            error: error.message,
        });
    }
};

// Delete Workshop (Admin Only)
exports.deleteWorkshop = async (req, res) => {
    try {
        const { workshopId } = req.params;
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can delete workshops.",
            });
        }

        // Find and delete workshop
        const workshop = await Workshop.findByIdAndDelete(workshopId);
        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: "Workshop not found",
            });
        }

        // Remove workshop from all enrolled users
        await User.updateMany(
            { workshops: workshopId },
            { $pull: { workshops: workshopId } }
        );

        res.status(200).json({
            success: true,
            message: "Workshop deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting workshop:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete workshop.",
            error: error.message,
        });
    }
};

// Get All Workshops for Admin (including drafts)
exports.getAllWorkshopsAdmin = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can access all workshops.",
            });
        }

        const workshops = await Workshop.find()
            .populate("instructor", "fullName email image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Workshops fetched successfully",
            data: workshops,
        });
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch workshops",
            error: error.message,
        });
    }
};
