import axiosInstance from "./axiosInstance";

class AdminService {
  public async createCatagory(data: any, token: string) {
    console.log("token is in adminservice", token)
    try {
      const res = await axiosInstance.post(`/course/createCategory`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async createCourse(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/createCourse`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllCatagory(token: string) {
    try {
      const res = await axiosInstance.get(`/course/showAllCategories`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
  public async createSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/addSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async createSubSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/addSubSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async editCourse(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/editCourse`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAdminCourses(token: string) {
    try {
      const res = await axiosInstance.get(`/course/getAdminCourses`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllCourses() {
    try {
      const res = await axiosInstance.get(`/course/getAllCourses`)
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getCourseDetails(courseId: string) {
    try {
      const res = await axiosInstance.post(`/course/getCourseDetails`, { courseId })
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getFullCourseDetails(courseId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course/getFullCourseDetails`, { courseId },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteCourse(courseId: string, token: string) {
    try {
      const res = await axiosInstance.delete(`/course/deleteCourse`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          data: { courseId }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async updateSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/deleteSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async updateSubSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateSubSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteSubSection(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/deleteSubSection`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  // New Admin Methods for User Creation and Enrollment
  public async createUserAndEnroll(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/admin/create-user-and-enroll`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async enrollUserInCourse(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/admin/enroll-user`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllUsers(token: string) {
    try {
      const res = await axiosInstance.get(`/admin/users`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllCoursesForEnrollment(token: string) {
    try {
      const res = await axiosInstance.get(`/admin/courses`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async updateCategory(data: any, token: string) {
    try {
      const res = await axiosInstance.post(`/course/updateCategory`, data,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteCategory(categoryId: string, token: string) {
    try {
      const res = await axiosInstance.post(`/course/deleteCategory`, { categoryId },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

}

export const adminService = new AdminService();
