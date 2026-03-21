/**
 * Seed Function: Update Student Count for All Workshops
 * 
 * This function updates the studentCount field for all workshops
 * to a random value between 100 and 300.
 * 
 * Usage in index.js:
 *   const { updateWorkshopStudentCount } = require('./seeds/updateWorkshopStudentCount');
 *   updateWorkshopStudentCount(); // Call this after DB connection
 */

const Workshop = require('../models/Workshop');

// Generate random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Main function to update workshop student counts
const updateWorkshopStudentCount = async () => {
    try {
        console.log('\n🚀 Starting Workshop Student Count Update...\n');

        // Fetch all workshops
        const workshops = await Workshop.find({});

        if (!workshops || workshops.length === 0) {
            console.log('⚠️  No workshops found in the database.');
            return;
        }

        console.log(`🎓 Found ${workshops.length} workshops to update.\n`);

        let updatedCount = 0;

        // Update each workshop
        for (const workshop of workshops) {
            const oldStudentCount = workshop.studentCount || "0";
            const newStudentCount = getRandomInt(100, 300);

            // Update the workshop
            workshop.studentCount = newStudentCount.toString();
            await workshop.save();

            updatedCount++;

            console.log(`✅ [${updatedCount}/${workshops.length}] Updated: "${workshop.title}"`);
            console.log(`   Old Count: ${oldStudentCount} → New Count: ${newStudentCount}\n`);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log(`🎉 Successfully updated ${updatedCount} workshops!`);
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error updating workshop student counts:', error.message);
        throw error;
    }
};

// Export the function
module.exports = { updateWorkshopStudentCount };
