exports.enrolleStudent = async (courses, userId, couponCode) => {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid courses and user ID",
      });
    }
    try {
      // If coupon used, mark it as used
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.isUsed = true;
          await coupon.save();
        }
      }

      let enrolledCourses = [];
      //update the course
      for (const course_id of courses) {
        // console.log("verify courses=", course_id);
        const course = await Course.findByIdAndUpdate(
          course_id,
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );
        //update the user
        const user = await User.updateOne(
          { _id: userId },
          { $push: { courses: course_id } },
          { new: true }
        );
        //set course progress
        const newCourseProgress = new CourseProgress({
          userID: userId,
          courseID: course_id,
        });
        await newCourseProgress.save();

        //add new course progress to user
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { courseProgress: newCourseProgress._id },
          },
          { new: true }
        );
        
        enrolledCourses.push({
          id: course._id,
          name: course.courseName,
          description: course.courseDescription,
          thumbnail: course.thumbnail
        });
        
        //send email
        const recipient = await User.findById(userId);
        // console.log("recipient=>", course);
        const courseName = course.courseName;
        const courseDescription = course.courseDescription;
        const thumbnail = course.thumbnail;
        const userEmail = recipient.email;
        const userName = recipient.fullName;
        const emailTemplate = courseEnrollmentEmail(
          courseName,
          userName,
          courseDescription,
          thumbnail
        );
        await mailSender(
          userEmail,
          `You have successfully enrolled for ${courseName}`,
          emailTemplate
        );
      }
      return res.status(200).json({
        success: true,
        message: "Payment successful",
        enrolledCourses,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };