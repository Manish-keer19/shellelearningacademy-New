import axiosInstance from "./axiosInstance";

class PaymentService {
  // Capture payment and create Razorpay order
  public async capturePayment(courses: string[], token: string) {
    try {
      console.log("Capturing payment for courses:", courses);
      const res = await axiosInstance.post(`/payment/capturePayment`, { courses }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Payment capture response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Payment capture error:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  // Verify payment signature
  public async verifyPayment(paymentData: any, token: string) {
    try {
      console.log("Verifying payment:", paymentData);
      const res = await axiosInstance.post(`/payment/verifyPayment`, paymentData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Payment verification response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Payment verification error:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  // Send payment success email
  public async sendPaymentSuccessEmail(paymentData: any, token: string) {
    try {
      const res = await axiosInstance.post(`/payment/sendPaymentSuccessEmail`, paymentData, {
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

export const paymentService = new PaymentService();