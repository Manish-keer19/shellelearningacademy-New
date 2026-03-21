import axiosInstance from "./axiosInstance";

class CourseService {
  // Get all courses (public)
  public async getAllCourses() {
    try {
      const res = await axiosInstance.get(`/course/getAllCourses`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get basic course info (ID, name, thumbnail, description) - Lightweight
  public async getCoursesBasicInfo() {
    try {
      const res = await axiosInstance.get(`/course/getCoursesBasicInfo`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get course details (public)
  public async getCourseDetails(courseId: string) {
    try {
      const res = await axiosInstance.post(`/course/getCourseDetails`, { courseId });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get full course details (authenticated)
  public async getFullCourseDetails(courseId: string, token: string) {
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

  // Search courses
  public async searchCourses(searchQuery: string) {
    try {
      const res = await axiosInstance.post(`/course/searchCourse`, { searchQuery });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Admin: Create course
  public async createCourse(data: FormData, token: string) {
    try {
      const res = await axiosInstance.post(`/course/createCourse`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Admin: Edit course
  public async editCourse(data: FormData, token: string) {
    try {
      const res = await axiosInstance.post(`/course/editCourse`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Admin: Get admin courses
  public async getAdminCourses(token: string) {
    try {
      const res = await axiosInstance.get(`/course/getAdminCourses`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Admin: Delete course
  public async deleteCourse(courseId: string, token: string) {
    try {
      const res = await axiosInstance.delete(`/course/deleteCourse`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        data: { courseId }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Categories
  public async getAllCategories() {
    try {
      // console.log("Fetching categories...");
      const res = await axiosInstance.get(`/course/showAllCategories`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async createCategory(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/createCategory`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getCategoryPageDetails(categoryId: string) {
    try {
      const res = await axiosInstance.post(`/course/getCategoryPageDetails`, { categoryId });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Student: Mark lecture as complete
  public async markLectureComplete(courseId: string, subSectionId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateCourseProgress`, {
        courseId,
        subSectionId
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

  // Student: Mark class as complete
  public async markClassComplete(courseId: string, classId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course-class/mark-complete`, {
        courseId,
        classId
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

  // Sections
  public async createSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/addSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async updateSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/deleteSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // SubSections
  public async createSubSection(data: FormData, token: string) {
    try {
      const res = await axiosInstance.post(`/course/addSubSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async updateSubSection(data: FormData, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateSubSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteSubSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/deleteSubSection`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Ratings and Reviews
  public async createRating(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/createRating`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAverageRating(courseId: string) {
    try {
      const res = await axiosInstance.get(`/course/getAverageRating?courseId=${courseId}`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllReviews() {
    try {
      const res = await axiosInstance.get(`/course/getReviews`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const courseService = new CourseService();