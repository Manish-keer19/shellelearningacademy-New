import axiosInstance from "./axiosInstance";

class EmsService {
    // Staff Management
    async getAllStaff(params?: { accountType?: string; active?: boolean; page?: number; limit?: number }) {
        try {
            const { data } = await axiosInstance.get("/admin-ems/staff", { params });
            return data;
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData: any) {
        try {
            const { data } = await axiosInstance.post("/admin-ems/create-user", userData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId: string, updates: any) {
        try {
            const { data } = await axiosInstance.put(`/admin-ems/user/${userId}`, updates);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: string, permanent: boolean = false) {
        try {
            const { data } = await axiosInstance.delete(`/admin-ems/user/${userId}?permanent=${permanent}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getDashboardStats() {
        try {
            const { data } = await axiosInstance.get("/admin-ems/dashboard-stats");
            return data;
        } catch (error) {
            throw error;
        }
    }

    // Lead Management
    async getAllLeads() {
        try {
            const { data } = await axiosInstance.get("/admin-ems/leads");
            return data;
        } catch (error) {
            throw error;
        }
    }

    async createLead(leadData: any) {
        try {
            const { data } = await axiosInstance.post("/admin-ems/leads/create", leadData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateLead(leadId: string, updates: any) {
        try {
            const { data } = await axiosInstance.put(`/admin-ems/leads/${leadId}`, updates);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async assignTarget(targetData: { employeeId: string; targetAmount: number }) {
        try {
            const { data } = await axiosInstance.post("/admin-ems/assign-target", targetData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async requestEnrollment(enrollData: { leadId: string; courseId: string; amount: number }) {
        try {
            const { data } = await axiosInstance.post("/admin-ems/leads/enroll", enrollData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async verifyEnrollment(verifyData: { leadId: string; commissionAmount: number; isApproved: boolean }) {
        try {
            const { data } = await axiosInstance.post("/admin-ems/leads/verify-enrollment", verifyData);
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default new EmsService();
