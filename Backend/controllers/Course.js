

// controllers/CourseController.js
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");


// ✅ Create New Course (with thumbnail + \brochure PDF)
exports.createCourse = async (req, res) => {
  try {
    // 1️⃣ Extract user (Admin)
    const userId = req.user.id;

    // 2️⃣ Extract fields from body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      originalPrice,
      discountedPrice,
      tag,
      category,
      status,
      instructions,
      courseLevel,
      courseDuration,
      courseOverview,
    } = req.body;

    // 3️⃣ Extract files
    const thumbnail = req.files?.thumbnailImage;
    const brochure = req.files?.brochurePdf; // PDF

    // 4️⃣ Validate all required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !originalPrice ||
      !thumbnail ||
      !category ||
      !courseLevel ||
      !courseDuration ||
      !brochure ||
      !courseOverview
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields including thumbnail and brochure are mandatory.",
      });
    }

    // 5️⃣ Set default values
    if (!status) status = "Draft";
    discountedPrice = discountedPrice ? parseFloat(discountedPrice) : 0;

    // 6️⃣ Verify user is Admin
    const adminDetails = await User.findById(userId);
    if (!adminDetails || adminDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can create courses.",
      });
    }

    // 7️⃣ Validate category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid category ID.",
      });
    }




    // 8️⃣ Upload thumbnail image
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      "shellElearning/thumbnails",
      500,
      80,
      false // image
    );

    // 9️⃣ Upload brochure PDF
    const brochurePdf = await uploadFileToCloudinary(
      brochure,
      "shellElearning/brochures",
      null,
      null,
      true // pdf
    );

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getRandomFloat(min, max) {
      return +(Math.random() * (max - min) + min).toFixed(2);
    }


    const studentCount = getRandomInt(300, 600); // Random students between 25 and 120
    const ratingValue = getRandomFloat(3.5, 5.0); // Random rating > 3
    ;

    // 🔟 Create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: adminDetails._id,
      whatYouWillLearn,
      originalPrice: parseFloat(originalPrice),
      discountedPrice,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
      courseLevel,
      courseDuration,
      brochures: brochurePdf.secure_url,
      courseOverview: courseOverview,
      studentCount: studentCount,
      ratingValue: ratingValue
    });

    // 1️⃣1️⃣ Add course to Admin
    await User.findByIdAndUpdate(
      adminDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 1️⃣2️⃣ Add course to Category
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // ✅ 1️⃣3️⃣ Response
    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course.",
      error: error.message,
    });
  }
};


// 🧠 Controller: Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},

    )
      .populate({
        path: "instructor",
        select: "fullName email", // choose what fields you want to expose
      })
      .populate({
        path: "category",
        select: "name description", // customize based on your schema
      })
      .exec();

    // ✅ Handle case: no courses found
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    // ✅ Return success response
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
    });

  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.find({ _id: courseId })
      .populate("category")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .populate("studentsEnrolled")
      .exec();
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully now",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// 🧑‍🏫 Get All Courses Created by a Particular Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // 🆔 Extract user ID from request (injected by auth middleware)
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request.",
      });
    }

    // 🔍 Fetch all courses created by this instructor
    const allCourses = await Course.find({ instructor: userId })
      .populate("category", "name description")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .sort({ createdAt: -1 }) // latest courses first
      .exec();

    // ❌ If instructor has no courses
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this instructor.",
      });
    }

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Instructor courses fetched successfully.",
      data: allCourses,
    });
  } catch (error) {
    console.error("❌ Error fetching instructor courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses.",
      error: error.message,
    });
  }
};

// 🛠️ Controller: Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    // 🔍 Check if courseId is provided
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // 🔎 Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // 🖼️ If thumbnail image is uploaded, update it
    if (req.files && req.files.thumbnailImage) {
      // console.log("📸 Updating course thumbnail...");
      const thumbnail = req.files.thumbnailImage;
      const uploadedImage = await uploadFileToCloudinary(
        thumbnail,
        "shellElearning/thumbnails"
      );
      course.thumbnail = uploadedImage.secure_url;
    }

    // 🧠 Update only the fields that are sent in the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
          try {
            course[key] = JSON.parse(updates[key]); // handle array fields
          } catch {
            course[key] = updates[key];
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    // 💰 Recalculate discountPercent and finalPrice before saving
    if (course.originalPrice && course.discountedPrice) {
      course.discountPercent = Math.round(
        ((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100
      );
      course.finalPrice = course.discountedPrice;
    } else {
      course.discountPercent = 0;
      course.finalPrice = course.originalPrice;
    }

    // 💾 Save updates
    await course.save();

    // 🔁 Fetch updated course with all necessary relationships populated
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select: "fullName email additionalDetails",
        populate: {
          path: "additionalDetails",
          select: "about contactNumber gender dateOfBirth",
        },
      })
      .populate("category", "name description")

      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    // ✅ Return success response
    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("❌ Error while editing course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


// 📘 Controller: Get Full Course Details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // 🔍 Fetch full course with all relations
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        select: "fullName email additionalDetails",
        populate: {
          path: "additionalDetails",
          select: "about contactNumber gender dateOfBirth",
        },
      })
      .populate("category", "name description")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("upcomingClasses")
      .lean()
      .exec();

    // ❌ If no course found
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with ID: ${courseId}`,
      });
    }

    // 🔄 Manually fetch and populate upcomingClasses
    if (courseDetails.upcomingClasses && courseDetails.upcomingClasses.length > 0) {
      const CourseClass = require("../models/CourseClass");

      // Extract IDs - handle both ObjectId and already-populated objects
      const classIds = courseDetails.upcomingClasses.map(item => {
        // If it's already an object with _id, extract the _id
        if (item && typeof item === 'object' && item._id) {
          return item._id.toString();
        }
        // Otherwise it's just an ID
        return item.toString();
      });

      console.log('🔍 Looking for class IDs:', classIds);

      // Fetch all classes by their IDs
      const classes = await CourseClass.find({ _id: { $in: classIds } }).lean();

      console.log('📚 Fetched', classes.length, 'classes for course');

      // Apply backward compatibility transformation
      const transformedClasses = classes.map(cls => {
        // If documentUrl exists but documentFile doesn't, convert it
        if (cls.documentUrl && !cls.documentFile) {
          console.log('🔄 Converting documentUrl to documentFile for class:', cls.className);
          cls.documentFile = {
            secure_url: cls.documentUrl,
            public_id: null
          };
        }
        return cls;
      });

      // Replace IDs with actual class objects
      courseDetails.upcomingClasses = transformedClasses;
    } else {
      courseDetails.upcomingClasses = [];
    }

    // 🔢 Fetch user's course progress
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    // ⏱ Calculate total course duration
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((section) => {
      section.subSection.forEach((subSec) => {
        const duration = parseInt(subSec.timeDuration) || 0;
        totalDurationInSeconds += duration;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Full course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgress?.completedVideos || [],
        completedClasses: courseProgress?.completedClasses || [],
      },
    });
  } catch (error) {
    console.error("❌ Error fetching full course details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching course details.",
      error: error.message,
    });
  }
};

//Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    //Delete course id from Category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { courses: courseId },
    });
    //Delete course id from Admin
    await User.findByIdAndUpdate(course.instructor._id, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//search course by title,description and tags array
exports.searchCourse = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    // console.log("searchQuery : ", searchQuery)
    const courses = await Course.find({
      $or: [
        { courseName: { $regex: searchQuery, $options: "i" } },
        { courseDescription: { $regex: searchQuery, $options: "i" } },
        { tag: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate({
        path: "instructor",
      })
      .populate("category")

      .exec();
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//mark lecture as completed
exports.markLectureAsComplete = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;
  if (!courseId || !subSectionId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  try {
    let progressAlreadyExists = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });
    // If no progress exists, create new one
    if (!progressAlreadyExists) {
      progressAlreadyExists = await CourseProgress.create({
        userID: userId,
        courseID: courseId,
        completedVideos: [subSectionId],
      });
    } else {
      const completedVideos = progressAlreadyExists.completedVideos || [];
      if (!completedVideos.includes(subSectionId)) {
        await CourseProgress.findOneAndUpdate(
          {
            userID: userId,
            courseID: courseId,
          },
          {
            $push: { completedVideos: subSectionId },
          }
        );
      } else {
        return res.status(400).json({
          success: false,
          message: "Lecture already marked as complete",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get course names and IDs only
exports.getCourseNamesAndIds = async (req, res) => {
  try {
    const courses = await Course.find(
      { status: "Published" },
      { courseName: 1, _id: 1 }
    ).exec();

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Course names and IDs fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course names and IDs",
      error: error.message,
    });
  }
};

// Get basic course information (ID, name, thumbnail, description) for Manage Classes page
exports.getCoursesBasicInfo = async (req, res) => {
  try {
    // Only select the essential fields needed for the Manage Classes page
    const courses = await Course.find(
      {},
      {
        _id: 1,
        courseName: 1,
        thumbnail: 1,
        courseDescription: 1
      }
    )
      .sort({ createdAt: -1 }) // Latest courses first
      .exec();

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Basic course information fetched successfully",
    });
  } catch (error) {
    console.error("❌ Error fetching basic course info:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch basic course information",
      error: error.message,
    });
  }
};


// Update student count for all courses (300 to 600)
exports.updateAllCoursesStudentCount = async (req, res) => {
  try {
    console.log("Updating all courses with random studentCount (300-600)...");

    const courses = await Course.find({}); // fetch all courses

    for (const course of courses) {
      const studentCount = Math.floor(Math.random() * (600 - 300 + 1)) + 300; // 300-600

      // Also optionally update rating if needed, but user just requested studentCount
      // const ratingValue = parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)); 
      // course.ratingValue = ratingValue.toString();

      course.studentCount = studentCount.toString();

      await course.save(); // save each course
    }

    console.log("All courses updated successfully!");
    return res.status(200).json({
      success: true,
      message: "All courses updated successfully with new student counts",
    });
  } catch (err) {
    console.error("Error updating course student counts:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update course student counts",
      error: err.message,
    });
  }
};

