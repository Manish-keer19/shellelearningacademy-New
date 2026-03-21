const HeroImage = require("../models/HeroImage");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;

/**
 * PUBLIC: Get all active hero images for the Hero section slider
 */
exports.getActiveHeroImages = async (req, res) => {
    try {
        const images = await HeroImage.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Hero images fetched successfully",
            data: images,
        });
    } catch (error) {
        console.error("Error in getActiveHeroImages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hero images",
            error: error.message,
        });
    }
};

/**
 * ADMIN: Get ALL hero images (active + inactive)
 */
exports.getAllHeroImages = async (req, res) => {
    try {
        const images = await HeroImage.find()
            .sort({ order: 1, createdAt: -1 })
            .populate("createdBy", "firstName lastName email")
            .lean();

        return res.status(200).json({
            success: true,
            message: "All hero images fetched successfully",
            data: images,
        });
    } catch (error) {
        console.error("Error in getAllHeroImages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hero images",
            error: error.message,
        });
    }
};

/**
 * ADMIN: Upload a new hero image
 */
exports.uploadHeroImage = async (req, res) => {
    try {
        const { order } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "Hero image file is required",
            });
        }

        const imageFile = req.files.image;

        // Upload to Cloudinary
        const uploadResult = await uploadFileToCloudinary(
            imageFile,
            "ShellElearning/hero-images",
            1080,
            80
        );

        const heroImage = await HeroImage.create({
            imageUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            order: order ? parseInt(order) : 0,
            createdBy: req.user.id,
            isActive: true,
        });

        return res.status(201).json({
            success: true,
            message: "Hero image uploaded successfully",
            data: heroImage,
        });
    } catch (error) {
        console.error("Error in uploadHeroImage:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload hero image",
            error: error.message,
        });
    }
};

/**
 * ADMIN: Update hero image (order, isActive, or replace the image file)
 */
exports.updateHeroImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { order, isActive } = req.body;

        const heroImage = await HeroImage.findById(id);
        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: "Hero image not found",
            });
        }

        // Replace image on Cloudinary if a new file is provided
        if (req.files && req.files.image) {
            try {
                await cloudinary.uploader.destroy(heroImage.cloudinaryPublicId);
            } catch (cdErr) {
                console.warn("Could not delete old Cloudinary image:", cdErr.message);
            }

            const uploadResult = await uploadFileToCloudinary(
                req.files.image,
                "ShellElearning/hero-images",
                1080,
                80
            );
            heroImage.imageUrl = uploadResult.secure_url;
            heroImage.cloudinaryPublicId = uploadResult.public_id;
        }

        if (order !== undefined) heroImage.order = parseInt(order);
        if (isActive !== undefined)
            heroImage.isActive = isActive === "true" || isActive === true;

        await heroImage.save();

        return res.status(200).json({
            success: true,
            message: "Hero image updated successfully",
            data: heroImage,
        });
    } catch (error) {
        console.error("Error in updateHeroImage:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update hero image",
            error: error.message,
        });
    }
};

/**
 * ADMIN: Delete a hero image
 */
exports.deleteHeroImage = async (req, res) => {
    try {
        const { id } = req.params;

        const heroImage = await HeroImage.findById(id);
        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: "Hero image not found",
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(heroImage.cloudinaryPublicId);
        } catch (cdErr) {
            console.warn("Could not delete Cloudinary image:", cdErr.message);
        }

        await HeroImage.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Hero image deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteHeroImage:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete hero image",
            error: error.message,
        });
    }
};

/**
 * ADMIN: Toggle active/inactive status
 */
exports.toggleHeroImageStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const heroImage = await HeroImage.findById(id);
        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: "Hero image not found",
            });
        }

        heroImage.isActive = !heroImage.isActive;
        await heroImage.save();

        return res.status(200).json({
            success: true,
            message: `Hero image ${heroImage.isActive ? "activated" : "deactivated"} successfully`,
            data: heroImage,
        });
    } catch (error) {
        console.error("Error in toggleHeroImageStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle hero image status",
            error: error.message,
        });
    }
};
