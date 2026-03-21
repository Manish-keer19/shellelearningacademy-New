// import axiosInstance from "./axiosInstance";

// const COUPON_API = {
//   APPLY_COUPON: "/api/v1/coupon/apply",
//   REDEEM_COUPON: "/api/v1/coupon/redeem",
// };

// export const couponService = {
//   applyCoupon: async (couponCode: string, courseId: string, token: string) => {
//     return apiConnector("POST", COUPON_API.APPLY_COUPON, {
//       couponCode,
//       courseId,
//     }, {
//       Authorization: `Bearer ${token}`,
//     });
//   },

//   redeemCoupon: async (couponCode: string, token: string) => {
//     return apiConnector("POST", COUPON_API.REDEEM_COUPON, {
//       couponCode,
//     }, {
//       Authorization: `Bearer ${token}`,
//     });
//   },
// };