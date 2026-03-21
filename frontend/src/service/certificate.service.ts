import axiosInstance from "./axiosInstance";

/**
 * Certificate Service
 * Handles all certificate-related API calls
 */

const CERTIFICATE_API = "/certificate";

// ============================================
// ADMIN OPERATIONS
// ============================================

/**
 * Create new certificate
 * @param {FormData} formData - Certificate data with file
 * @returns {Promise} - API response
 */
export const createCertificate = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${CERTIFICATE_API}/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get all certificates with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response
 */
export const getAllCertificates = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  order?: string;
}) => {
  try {
    const response = await axiosInstance.get(`${CERTIFICATE_API}/all`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get certificate by ID (Admin view)
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response
 */
export const getCertificateByIdAdmin = async (certificateId: string) => {
  try {
    const response = await axiosInstance.get(
      `${CERTIFICATE_API}/admin/${certificateId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Update certificate details (Admin view)
 * @param {string} certificateId - Certificate ID
 * @param {FormData} formData - Certificate data
 * @returns {Promise} - API response
 */
export const updateCertificate = async (
  certificateId: string,
  formData: FormData,
) => {
  try {
    const response = await axiosInstance.put(
      `${CERTIFICATE_API}/admin/${certificateId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Update certificate status
 * @param {string} certificateId - Certificate ID
 * @param {string} status - New status (VERIFIED/REVOKED/SUSPENDED)
 * @param {string} reason - Reason for status change
 * @returns {Promise} - API response
 */
export const updateCertificateStatus = async (
  certificateId: string,
  status: string,
  reason?: string,
) => {
  try {
    const response = await axiosInstance.put(
      `${CERTIFICATE_API}/status/${certificateId}`,
      { status, reason },
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Delete certificate
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response
 */
export const deleteCertificate = async (certificateId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${CERTIFICATE_API}/${certificateId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Regenerate QR code for certificate
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response
 */
export const regenerateQRCode = async (certificateId: string) => {
  try {
    const response = await axiosInstance.post(
      `${CERTIFICATE_API}/regenerate-qr/${certificateId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get certificate statistics
 * @returns {Promise} - API response
 */
export const getCertificateStats = async () => {
  try {
    const response = await axiosInstance.get(`${CERTIFICATE_API}/stats`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ============================================
// PUBLIC OPERATIONS
// ============================================

/**
 * Verify certificate (Public - No auth required)
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response
 */
export const verifyCertificate = async (certificateId: string) => {
  try {
    const response = await axiosInstance.get(
      `${CERTIFICATE_API}/verify/${certificateId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
