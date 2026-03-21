import axiosInstance from './axiosInstance';

export const updateEventService = {
  updateEvent: async (formData: FormData, token: string) => {
    try {
      const response = await axiosInstance.post('/event/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Update event service error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Update failed',
        error: error.response?.data || error.message
      };
    }
  }
};