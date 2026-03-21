import axiosInstance from "./axiosInstance";
import { toast } from "react-hot-toast";

export const createJob = async (data: any) => {
  try {
    const response = await axiosInstance.post("/job/create", data);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getAllJobs = async () => {
  try {
    const response = await axiosInstance.get("/job");
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const getJobById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/job/${id}`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const updateJob = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/job/${id}`, data);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const deleteJob = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/job/${id}`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
  }
};

export const submitJobApplication = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/job-application/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to submit application");
    throw error;
  }
};
