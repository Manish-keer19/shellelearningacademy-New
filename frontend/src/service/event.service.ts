import axiosInstance from "./axiosInstance";

class EventService {
  public async createEvent(data: any, token: string) {
    console.log("data in event service", data)
    try {
      const res = await axiosInstance.post("/event/create-event", data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
  public async getUsersEvent(userId: string, token: string) {
    try {
      const res = await axiosInstance.get(`/event/get-events/${userId}`,
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


  async getAllusesers(token: string) {

    try {
      const res = await axiosInstance.get("/event/assignable",
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


  async updateEvent(data: any, token: string) {
    try {
      const res = await axiosInstance.post("/event/update-event", data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }


  async getAllEventsForAdmin(token: any) {
    try {
      const res = await axiosInstance.get("/event/get-all-event-for-admin",
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


  async updateUserHomeVisit(token: string) {

    try {
      const res = await axiosInstance.get(`/event/update-user-home-visit`,
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
  async markEventViewed (token: string,eventId:string) {

    try {
      const res = await axiosInstance.get(`/event/mark-event-as-veiw/${eventId}`,
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



}






export const eventService = new EventService();
