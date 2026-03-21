import axiosInstance from "./axiosInstance";

class LeadService {
    // Create Lead (Public)
    public async createLead(data: {
        name: string;
        email: string;
        phone: string;
        college: string;
        year: string;
    }) {
        try {
            const res = await axiosInstance.post(`/lead/createLead`, data);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Get all leads
    public async getAllLeads(token: string) {
        try {
            const res = await axiosInstance.get(`/lead/getAllLeads`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Admin: Get lead stats
    public async getLeadStats(token: string) {
        try {
            const res = await axiosInstance.get(`/lead/getLeadStats`, {
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

export const leadService = new LeadService();
