const WorkshopRegistration = require("../models/WorkshopRegistration");
const Workshop = require("../models/Workshop");
const User = require("../models/User");

// Register for Workshop
exports.registerForWorkshop = async (req, res) => {
    try {
        const { workshopId, name, email, phone, college, year } = req.body;
        const userId = req.user?.id; // Optional - user might not be logged in

        // Validation
        if (!workshopId || !name || !email || !phone || !college || !year) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (workshopId, name, email, phone, college, year)",
            });
        }

        // Check if workshop exists
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: "Workshop not found",
            });
        }

        // Check if already registered
        const existingRegistration = await WorkshopRegistration.findOne({
            workshop: workshopId,
            email: email.toLowerCase(),
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: "You have already registered for this workshop",
            });
        }

        // Create registration
        const registration = await WorkshopRegistration.create({
            workshop: workshopId,
            user: userId || null,
            name,
            email,
            phone,
            college,
            year,
        });

        // Automatically enroll the user in the workshop
        if (userId && !workshop.studentsEnrolled.includes(userId)) {
            workshop.studentsEnrolled.push(userId);
            await workshop.save();

            // Add workshop to user's workshops array
            await User.findByIdAndUpdate(userId, {
                $push: { workshops: workshopId },
            });
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Our team will contact you shortly.",
            data: registration,
        });
    } catch (error) {
        console.error("Error registering for workshop:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register for workshop",
            error: error.message,
        });
    }
};

// Get All Workshop Registrations (Admin Only)
exports.getAllWorkshopRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can view all registrations",
            });
        }

        const registrations = await WorkshopRegistration.find()
            .populate("workshop", "title date time mode type price")
            .populate("user", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Registrations fetched successfully",
            data: registrations,
        });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch registrations",
            error: error.message,
        });
    }
};

// Get Registrations for a Specific Workshop (Admin Only)
exports.getWorkshopRegistrations = async (req, res) => {
    try {
        const { workshopId } = req.params;
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can view registrations",
            });
        }

        const registrations = await WorkshopRegistration.find({ workshop: workshopId })
            .populate("user", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Workshop registrations fetched successfully",
            data: registrations,
        });
    } catch (error) {
        console.error("Error fetching workshop registrations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch workshop registrations",
            error: error.message,
        });
    }
};

// Get My Workshop Registrations (Student)
exports.getMyWorkshopRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;

        const registrations = await WorkshopRegistration.find({ user: userId })
            .populate("workshop", "title date time mode type price thumbnail")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Your registrations fetched successfully",
            data: registrations,
        });
    } catch (error) {
        console.error("Error fetching user registrations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch your registrations",
            error: error.message,
        });
    }
};
