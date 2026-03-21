import axiosInstance from "./axiosInstance";

export const createPopupData = async (data: any) => {
  const response = await axiosInstance.post("/popup/createPopup", data);
  return response.data;
};
