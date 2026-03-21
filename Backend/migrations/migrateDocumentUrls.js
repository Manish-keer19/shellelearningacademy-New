const mongoose = require('mongoose');
const CourseClass = require('../models/CourseClass');
require('dotenv').config();

/**
 * Migration script to convert documentUrl to documentFile format
 * This handles the schema change from String to Object { secure_url, public_id }
 */

async function migrateDocumentUrls() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);

        console.log('Connected to MongoDB');

        // Find all classes that have documentUrl but not documentFile
        const classesWithOldFormat = await CourseClass.find({
            documentUrl: { $exists: true, $ne: null, $ne: '' }
        });

        console.log(`Found ${classesWithOldFormat.length} classes with old documentUrl format`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const classDoc of classesWithOldFormat) {
            // Check if it already has documentFile
            if (classDoc.documentFile && classDoc.documentFile.secure_url) {
                console.log(`Skipping class ${classDoc._id} - already has documentFile`);
                skippedCount++;
                continue;
            }

            // Convert documentUrl to documentFile format
            const documentUrl = classDoc.documentUrl;

            // Extract public_id from Cloudinary URL if possible
            // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
            let public_id = null;
            if (documentUrl && documentUrl.includes('cloudinary.com')) {
                const urlParts = documentUrl.split('/');
                const uploadIndex = urlParts.indexOf('upload');
                if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
                    // Get everything after 'upload/v{version}/'
                    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                    // Remove file extension
                    public_id = pathAfterUpload.replace(/\.[^/.]+$/, '');
                }
            }

            // Update the document
            await CourseClass.findByIdAndUpdate(classDoc._id, {
                $set: {
                    documentFile: {
                        secure_url: documentUrl,
                        public_id: public_id || `legacy_${classDoc._id}`
                    }
                },
                $unset: {
                    documentUrl: 1 // Remove old field
                }
            });

            console.log(`Migrated class ${classDoc._id}: ${documentUrl}`);
            migratedCount++;
        }

        console.log('\n=== Migration Complete ===');
        console.log(`Total classes processed: ${classesWithOldFormat.length}`);
        console.log(`Successfully migrated: ${migratedCount}`);
        console.log(`Skipped (already migrated): ${skippedCount}`);

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run migration
migrateDocumentUrls();
