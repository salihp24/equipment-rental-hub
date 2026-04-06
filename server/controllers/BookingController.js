import asyncHandler from "express-async-handler";
import Booking from "../models/BookingModel.js";
import Equipment from "../models/EquipmentModel.js";

// @POST /api/bookings
// Private — renter only
export const createBooking = asyncHandler(async (req, res) => {
  const { equipmentId, startDate, endDate, note, proposedPrice } = req.body;

  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    res.status(404);
    throw new Error("Equipment not found");
  }

  if (!equipment.isAvailable) {
    res.status(400);
    throw new Error("Equipment is not available");
  }

  // Calculate total days and amount
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (totalDays < 1) {
    res.status(400);
    throw new Error("End date must be after start date");
  }

  const pricePerDay = equipment.pricing.perDay;
  const totalAmount = pricePerDay * totalDays;

  // Handle negotiation
  const negotiation = proposedPrice
    ? {
        isNegotiated: true,
        proposedPrice,
        negotiationStatus: "pending",
      }
    : { isNegotiated: false, proposedPrice: 0, negotiationStatus: "none" };

  const booking = await Booking.create({
    equipment: equipmentId,
    renter: req.user._id,
    owner: equipment.owner,
    startDate,
    endDate,
    totalDays,
    pricePerDay,
    totalAmount,
    note,
    negotiation,
  });

  res.status(201).json({ success: true, booking });
});

// @GET /api/bookings/my
// Private — renter
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ renter: req.user._id })
    .populate("equipment", "title images pricing location")
    .populate("owner", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @GET /api/bookings/owner
// Private — owner
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate("equipment", "title images pricing location")
    .populate("renter", "name avatar phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @GET /api/bookings/:id
// Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("equipment", "title images pricing location")
    .populate("renter", "name avatar phone")
    .populate("owner", "name avatar phone");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Only renter or owner can view
  if (
    booking.renter._id.toString() !== req.user._id.toString() &&
    booking.owner._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.status(200).json({ success: true, booking });
});

// @PUT /api/bookings/:id/status
// Private — owner only
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Only owner can accept or reject
  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({ success: true, booking });
});

// @PUT /api/bookings/:id/cancel
// Private — renter only
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.renter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({ success: true, booking });
});

// @PUT /api/bookings/:id/negotiate
// Private — owner only (respond to negotiation)
export const respondToNegotiation = asyncHandler(async (req, res) => {
  const { negotiationStatus } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  booking.negotiation.negotiationStatus = negotiationStatus;

  // If negotiation accepted, update the total amount
  if (negotiationStatus === "accepted") {
    booking.pricePerDay = booking.negotiation.proposedPrice;
    booking.totalAmount = booking.negotiation.proposedPrice * booking.totalDays;
  }

  await booking.save();

  res.status(200).json({ success: true, booking });
});