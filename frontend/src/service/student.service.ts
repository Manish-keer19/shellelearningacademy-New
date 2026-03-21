import axiosInstance from "./axiosInstance";

class StudentService {
  // Enroll in a course (this would typically be handled through payments)
  public async enrollInCourse(courseId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/payment/capturePayment`, { courses: [courseId] }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  // Verify payment and complete enrollment
  public async verifyPayment(paymentData: any, token: string) {
    try {
      const res = await axiosInstance.post(`/payment/verifyPayment`, paymentData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  };

  // Send payment success email
  public async sendPaymentSuccessEmail(paymentData: any, token: string) {
    try {
      const res = await axiosInstance.post(`/payment/sendPaymentSuccessEmail`, paymentData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get enrolled courses
  public async getEnrolledCourses(token: string) {
    try {
      const res = await axiosInstance.get(`/profile/getEnrolledCourses`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get course progress
  public async getCourseProgress(courseId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course/getFullCourseDetails`, { courseId }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Mark lecture as complete
  public async markLectureComplete(courseId: string, subSectionId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateCourseProgress`, {
        courseId,
        subSectionId,
        userId: null // Will be extracted from token in backend
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const studentService = new StudentService();