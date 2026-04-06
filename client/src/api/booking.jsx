import api from "./axiosInstance";

export const createBooking = (data) => api.post("/bookings", data);
export const getMyBookings = () => api.get("/bookings/my");
export const getOwnerBookings = () => api.get("/bookings/owner");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const respondToNegotiation = (id, negotiationStatus) => api.put(`/bookings/${id}/negotiate`, { negotiationStatus });