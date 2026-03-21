import axiosInstance from "./axiosInstance";

export const createApplication = async (data) => {
  const response = await axiosInstance(
    "POST",
    "/application/createApplication",
    data,
    {
      "Content-Type": "multipart/form-data",
    }
  );
  return response.data;
};
