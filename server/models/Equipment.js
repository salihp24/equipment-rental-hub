import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "cameras",
        "Laptop"
      ],
    },
    images: [
      {
        type: String,
      },
    ],
    pricing: {
      perHour: { type: Number, default: 0 },
      perDay: { type: Number, required: [true, "Daily price is required"] },
      perWeek: { type: Number, default: 0 },
    },
    location: {
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    bookedDates: [
      {
        from: { type: Date },
        to: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;   