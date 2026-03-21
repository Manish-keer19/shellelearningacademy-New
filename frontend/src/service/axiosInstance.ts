// import axios from "axios";

// const BASE_URL =import.meta.env.VITE_BASE_URL;
// // const BASE_URL ="https://shellentertenment-backend.onrender.com"
// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: `${BASE_URL}/api/v1`, // Set the base URL once here
//   headers: {
//     "Content-Type": "application/json", // Set default headers if needed
//   },
// });

// // Attach Authorization header automatically if token exists
// axiosInstance.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (_) {}
//   return config;
// });

// export default axiosInstance;



import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT → allows cookies (refresh token)
});

// -------------------------
// Request Interceptor
// -------------------------
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  // console.log("access token in interceptor", token)

  // Handle FormData - let browser set Content-Type with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  if (token) {
    // console.log("we are in access token condition")
    config.headers.Authorization = `Bearer ${token}`;
  }
  else {
    // console.log("we are in enrollment token condition")
    const enrollmentToken = localStorage.getItem("enrollmentToken");
    // console.log("enrollment token in interceptor", enrollmentToken)
    if (enrollmentToken) {
      config.headers.Authorization = `Bearer ${enrollmentToken}`;
    } else {
      // toast.error("enrolement token is'nt found")
    }
  }
  return config;
});

// -------------------------
// Response Interceptor
// Auto Refresh Token
// -------------------------
let isRefreshing = false;
let failedQueue = [];

// Function to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If error is NOT 401 → normal error
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ✅ FIX: Don't try to refresh token for login/signup/auth endpoints
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/sendotp', '/auth/enrollInCourse'];
    const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    if (isAuthEndpoint) {
      // This is a login/signup failure, not an expired token
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If already refreshing → queue pending requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Call refresh token API
      const res = await axios.get(`${BASE_URL}/api/v1/auth/refresh-token`, {
        withCredentials: true,
      });

      const newAccessToken = res.data.accessToken;

      // Save new token in localStorage
      localStorage.setItem("accessToken", newAccessToken);

      // Update Authorization header
      axiosInstance.defaults.headers.Authorization = "Bearer " + newAccessToken;

      processQueue(null, newAccessToken);
      isRefreshing = false;

      // Retry original request
      originalRequest.headers.Authorization = "Bearer " + newAccessToken;
      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;

      // Logout user automatically
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(err);
    }
  }
);

export default axiosInstance;
