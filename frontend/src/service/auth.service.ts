import axiosInstance from "./axiosInstance";

class AuthService {
  public async login(data: any) {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async sendOTP(data: any) {
    try {
      const res = await axiosInstance.post("/auth/sendotp", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async signup(data: any) {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async enrollInCourse(data: any) {
    try {
      const res = await axiosInstance.post("/auth/enrollInCourse", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const authService = new AuthService();
