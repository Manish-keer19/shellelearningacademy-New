import axiosInstance from "./axiosInstance";

class UserService {
    // Update user profile
    public async updateProfile(data: any, token: string) {
        try {
            const res = await axiosInstance.put(`/profile/updateProfile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Update profile picture
    public async updateProfilePicture(file: File, token: string) {
        try {
            const formData = new FormData();
            formData.append("pfp", file);

            const res = await axiosInstance.put(
                `/profile/updateDisplayPicture`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Update password
    public async updatePassword(data: any, token: string) {
        try {
            const res = await axiosInstance.put(`/profile/updatePassword`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Get user details
    public async getUserDetails(token: string) {
        try {
            const res = await axiosInstance.get(`/profile/getUserDetails`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }
}

export const userService = new UserService();
