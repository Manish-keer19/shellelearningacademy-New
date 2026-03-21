const mongoose = require("mongoose");

const courseClassSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        className: {
            type: String,
            required: true,
        },
        classDescription: {
            type: String,
            required: true,
        },
        classUrl: {
            type: String,
            required: true,
        },
        classDate: {
            type: Date,
            required: true,
        },
        recordingUrl: {
            type: String,
            default: null,
            trim: true,
        },
        // New format - object with secure_url and public_id
        documentFile: {
            type: {
                secure_url: String,
                public_id: String,
            },
            default: null,
        },
        // Keep old format for backward compatibility (will be removed in future)
        documentUrl: {
            type: String,
            default: null,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Pre-save hook to ensure backward compatibility
courseClassSchema.pre('save', function (next) {
    // If documentFile exists but documentUrl doesn't, sync it
    if (this.documentFile && this.documentFile.secure_url && !this.documentUrl) {
        this.documentUrl = this.documentFile.secure_url;
    }
    // If documentUrl exists but documentFile doesn't, convert it
    else if (this.documentUrl && !this.documentFile) {
        this.documentFile = {
            secure_url: this.documentUrl,
            public_id: null
        };
    }
    next();
});

module.exports = mongoose.model("CourseClass", courseClassSchema);
