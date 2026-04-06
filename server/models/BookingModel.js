import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",    // renter requested
        "accepted",   // owner accepted
        "rejected",   // owner rejected
        "cancelled",  // renter cancelled
        "completed",  // rental period done
      ],
      default: "pending",
    },
    payment: {
      status: {
        type: String,
        enum: ["unpaid", "partial", "paid"],
        default: "unpaid",
      },
      advanceAmount: { type: Number, default: 0 },
      paidAmount: { type: Number, default: 0 },
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
    },
    negotiation: {
      isNegotiated: { type: Boolean, default: false },
      proposedPrice: { type: Number, default: 0 },
      negotiationStatus: {
        type: String,
        enum: ["none", "pending", "accepted", "rejected"],
        default: "none",
      },
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;