/**
 * Seed Function: Update Student Count for All Courses
 * 
 * This function updates the studentCount field for all courses
 * to a random value between 200 and 500.
 * 
 * Usage in index.js:
 *   const { updateStudentCount } = require('./seeds/updateStudentCount');
 *   updateStudentCount(); // Call this after DB connection
 */

const Course = require('../models/Course');

// Generate random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Main function to update student counts
const updateStudentCount = async () => {
    try {
        console.log('\n🚀 Starting Student Count Update...\n');

        // Fetch all courses
        const courses = await Course.find({});

        if (!courses || courses.length === 0) {
            console.log('⚠️  No courses found in the database.');
            return;
        }

        console.log(`📚 Found ${courses.length} courses to update.\n`);

        let updatedCount = 0;

        // Update each course
        for (const course of courses) {
            const oldStudentCount = course.studentCount;
            const newStudentCount = getRandomInt(300, 600);

            // Update the course
            course.studentCount = newStudentCount.toString();
            await course.save();

            updatedCount++;

            console.log(`✅ [${updatedCount}/${courses.length}] Updated: "${course.courseName}"`);
            console.log(`   Old Count: ${oldStudentCount} → New Count: ${newStudentCount}\n`);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log(`🎉 Successfully updated ${updatedCount} courses!`);
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error updating student counts:', error.message);
        throw error;
    }
};

// Export the function
module.exports = { updateStudentCount };
