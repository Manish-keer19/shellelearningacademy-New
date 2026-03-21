import axiosInstance from "./axiosInstance";

class WorkshopService {
    // Get all workshops (public)
    public async getAllWorkshops() {
        try {
            const res = await axiosInstance.get(`/workshop/getAllWorkshops`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Get workshop details (public/authenticated)
    public async getWorkshopDetails(workshopId: string) {
        try {
            const res = await axiosInstance.post(`/workshop/getWorkshopDetails`, { workshopId });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Create workshop
    public async createWorkshop(data: FormData, token: string) {
        try {
            const res = await axiosInstance.post(`/workshop/createWorkshop`, data, {
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

    // Student: Enroll in workshop
    public async enrollWorkshop(workshopId: string, token: string) {
        try {
            const res = await axiosInstance.post(`/workshop/enrollWorkshop`, { workshopId }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Register for workshop (works with or without authentication)
    public async registerForWorkshop(data: {
        workshopId: string;
        name: string;
        email: string;
        phone: string;
        college: string;
        year: string;
    }, token?: string) {
        try {
            const config = token ? {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            } : {};

            const res = await axiosInstance.post(`/workshop/registerForWorkshop`, data, config);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Get all workshop registrations
    public async getAllWorkshopRegistrations(token: string) {
        try {
            const res = await axiosInstance.get(`/workshop/getAllRegistrations`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Get registrations for specific workshop
    public async getWorkshopRegistrations(workshopId: string, token: string) {
        try {
            const res = await axiosInstance.get(`/workshop/getWorkshopRegistrations/${workshopId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Update registration status
    public async updateRegistrationStatus(registrationId: string, status: string, token: string) {
        try {
            const res = await axiosInstance.put(`/workshop/updateRegistrationStatus/${registrationId}`,
                { status },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Get my workshop registrations
    public async getMyWorkshopRegistrations(token: string) {
        try {
            const res = await axiosInstance.get(`/workshop/myRegistrations`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Get all workshops (including drafts)
    public async getAllWorkshopsAdmin(token: string) {
        try {
            const res = await axiosInstance.get(`/workshop/getAllWorkshopsAdmin`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Update workshop
    public async updateWorkshop(workshopId: string, data: FormData, token: string) {
        try {
            const res = await axiosInstance.put(`/workshop/updateWorkshop/${workshopId}`, data, {
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

    // Admin: Delete workshop
    public async deleteWorkshop(workshopId: string, token: string) {
        try {
            const res = await axiosInstance.delete(`/workshop/deleteWorkshop/${workshopId}`, {
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

export const workshopService = new WorkshopService();

