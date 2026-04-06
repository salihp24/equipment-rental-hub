import express from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  respondToNegotiation,
} from "../controllers/BookingController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Renter
router.post("/", protect, restrictTo("renter"), createBooking);
router.get("/my", protect, restrictTo("renter"), getMyBookings);
router.put("/:id/cancel", protect, restrictTo("renter"), cancelBooking);

// Owner
router.get("/owner", protect, restrictTo("owner"), getOwnerBookings);
router.put("/:id/status", protect, restrictTo("owner"), updateBookingStatus);
router.put("/:id/negotiate", protect, restrictTo("owner"), respondToNegotiation);

// Both
router.get("/:id", protect, getBookingById);

export default router;