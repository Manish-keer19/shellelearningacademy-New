const mongoose = require('mongoose');
const CourseClass = require('../models/CourseClass');
const Course = require('../models/Course');
require('dotenv').config();

async function checkCourseData() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB\n');

        const courseId = '69156456ebb6eca7c6c429bb';

        // Check if course exists
        const course = await Course.findById(courseId).populate('upcomingClasses');

        if (!course) {
            console.log('❌ Course not found!');
            await mongoose.connection.close();
            return;
        }

        console.log('✅ Course found:', course.courseName);
        console.log('📚 Number of upcomingClasses:', course.upcomingClasses?.length || 0);

        if (course.upcomingClasses && course.upcomingClasses.length > 0) {
            console.log('\n📋 Classes Details:');
            course.upcomingClasses.forEach((cls, index) => {
                console.log(`\n--- Class ${index + 1} ---`);
                console.log('ID:', cls._id);
                console.log('Name:', cls.className);
                console.log('Date:', cls.classDate);
                console.log('Has documentUrl?', !!cls.documentUrl);
                console.log('documentUrl:', cls.documentUrl || 'null');
                console.log('Has documentFile?', !!cls.documentFile);
                console.log('documentFile:', cls.documentFile || 'null');
            });
        } else {
            console.log('\n⚠️ No classes found in upcomingClasses array');
        }

        // Also check all classes for this course directly
        console.log('\n\n🔍 Checking CourseClass collection directly:');
        const allClasses = await CourseClass.find({ course: courseId }).sort({ classDate: 1 });
        console.log('Total classes found:', allClasses.length);

        if (allClasses.length > 0) {
            allClasses.forEach((cls, index) => {
                console.log(`\n--- Direct Class ${index + 1} ---`);
                console.log('ID:', cls._id);
                console.log('Name:', cls.className);
                console.log('Date:', cls.classDate);
                console.log('Has documentUrl?', !!cls.documentUrl);
                console.log('documentUrl:', cls.documentUrl || 'null');
                console.log('Has documentFile?', !!cls.documentFile);
                console.log('documentFile:', JSON.stringify(cls.documentFile, null, 2) || 'null');
            });
        }

        await mongoose.connection.close();
        console.log('\n\n✅ Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

checkCourseData();
