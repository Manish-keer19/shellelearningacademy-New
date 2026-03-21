import axiosInstance from "./axiosInstance";

class HeroImageService {
    /** PUBLIC — fetch all active hero slides for the hero section */
    public async getActiveHeroImages() {
        try {
            const res = await axiosInstance.get("/hero-image/active");
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    /** ADMIN — fetch ALL hero images (active + inactive) */
    public async getAllHeroImages(token: string) {
        try {
            const res = await axiosInstance.get("/hero-image/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    /** ADMIN — upload a new hero image (FormData with `image` file + title, subtitle, order) */
    public async uploadHeroImage(formData: FormData, token: string) {
        try {
            const res = await axiosInstance.post("/hero-image/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    /** ADMIN — update hero image (title, subtitle, order, isActive, optional new image) */
    public async updateHeroImage(
        id: string,
        formData: FormData,
        token: string
    ) {
        try {
            const res = await axiosInstance.put(
                `/hero-image/update/${id}`,
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

    /** ADMIN — delete a hero image */
    public async deleteHeroImage(id: string, token: string) {
        try {
            const res = await axiosInstance.delete(`/hero-image/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }

    /** ADMIN — toggle active/inactive */
    public async toggleHeroImageStatus(id: string, token: string) {
        try {
            const res = await axiosInstance.patch(`/hero-image/toggle/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }
}

export const heroImageService = new HeroImageService();
