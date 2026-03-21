const Lead = require("../models/Lead");
const User = require("../models/User");

// Create Lead
exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, college, year } = req.body;

        // Validation
        if (!name || !email || !phone || !college || !year) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (name, email, phone, college, year)",
            });
        }

        // Check if lead already exists with this email
        const existingLead = await Lead.findOne({ email: email.toLowerCase() });
        if (existingLead) {
            return res.status(200).json({
                success: true,
                message: "Lead already exists",
                data: existingLead,
            });
        }

        // Create lead
        const lead = await Lead.create({
            name,
            email,
            phone,
            college,
            year,
        });

        res.status(201).json({
            success: true,
            message: "Lead captured successfully!",
            data: lead,
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({
            success: false,
            message: "Failed to capture lead",
            error: error.message,
        });
    }
};

// Get All Leads (Admin Only)
exports.getAllLeads = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can view all leads",
            });
        }

        const leads = await Lead.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            data: leads,
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leads",
            error: error.message,
        });
    }
};

// Get Lead Stats (Admin Only)
exports.getLeadStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user is Admin
        const adminDetails = await User.findById(userId);
        if (!adminDetails || adminDetails.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only Admin can view lead stats",
            });
        }

        const totalLeads = await Lead.countDocuments();
        const todayLeads = await Lead.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalLeads,
                today: todayLeads,
            },
        });
    } catch (error) {
        console.error("Error fetching lead stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch lead stats",
            error: error.message,
        });
    }
};
