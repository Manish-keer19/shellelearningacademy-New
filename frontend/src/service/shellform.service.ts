import axiosInstance from "./axiosInstance";

const SHELLFORM_API = "/shellforms";
const PUBLIC_FORM_API = "/public/forms";

export const shellFormService = {
  // Admin Operations
  createForm: async (formData: any) => {
    const response = await axiosInstance.post(`${SHELLFORM_API}/forms`, formData);
    return response.data;
  },

  getForms: async () => {
    const response = await axiosInstance.get(`${SHELLFORM_API}/forms`);
    return response.data;
  },

  getFormById: async (id: string) => {
    const response = await axiosInstance.get(`${SHELLFORM_API}/forms/${id}`);
    return response.data;
  },

  updateForm: async (id: string, formData: any) => {
    const response = await axiosInstance.put(`${SHELLFORM_API}/forms/${id}`, formData);
    return response.data;
  },

  deleteForm: async (id: string) => {
    const response = await axiosInstance.delete(`${SHELLFORM_API}/forms/${id}`);
    return response.data;
  },

  // Question Operations
  getQuestions: async (formId: string) => {
    const response = await axiosInstance.get(`${SHELLFORM_API}/questions/form/${formId}`);
    return response.data;
  },

  createQuestion: async (questionData: any) => {
    const response = await axiosInstance.post(`${SHELLFORM_API}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (id: string, questionData: any) => {
    const response = await axiosInstance.put(`${SHELLFORM_API}/questions/${id}`, questionData);
    return response.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await axiosInstance.delete(`${SHELLFORM_API}/questions/${id}`);
    return response.data;
  },

  // Response Operations
  getResponses: async (formId: string) => {
    const response = await axiosInstance.get(`${SHELLFORM_API}/responses/form/${formId}`);
    return response.data;
  },

  // Public Operations
  getPublicForm: async (slug: string) => {
    const response = await axiosInstance.get(`${PUBLIC_FORM_API}/${slug}`);
    return response.data;
  },

  submitPublicForm: async (slug: string, answers: any) => {
    const response = await axiosInstance.post(`${PUBLIC_FORM_API}/${slug}/submit`, { answers });
    return response.data;
  },

  uploadFormFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(`${PUBLIC_FORM_API}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
