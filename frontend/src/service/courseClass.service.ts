import axiosInstance from "./axiosInstance";

export const courseClassService = {
    createClass: async (data: any, token: string) => {
        const headers: any = {
            Authorization: `Bearer ${token}`,
        };

        // If data is FormData, let browser set Content-Type with boundary
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axiosInstance.post(`/course-class/create`, data, {
            headers,
        });
        return response.data;
    },

    updateClass: async (data: any, token: string) => {
        const headers: any = {
            Authorization: `Bearer ${token}`,
        };

        // If data is FormData, let browser set Content-Type with boundary
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axiosInstance.put(`/course-class/update`, data, {
            headers,
        });
        return response.data;
    },

    deleteClass: async (data: any, token: string) => {
        const response = await axiosInstance.delete(`/course-class/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        });
        return response.data;
    },

    getClassesByCourse: async (courseId: string, token: string) => {
        const response = await axiosInstance.get(`/course-class/get/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
