import asyncHandler from "express-async-handler";
import Equipment from "../models/EquipmentModel.js";

// @POST /api/equipment
// Private — owner only
export const createEquipment = asyncHandler(async (req, res) => {
  const { title, description, category, pricing, location } = req.body;

  const equipment = await Equipment.create({
    owner: req.user._id,
    title,
    description,
    category,
    pricing,
    location,
  });

  res.status(201).json({ success: true, equipment });
});

// @GET /api/equipment
// Public
export const getAllEquipment = asyncHandler(async (req, res) => {
  const { category, city, minPrice, maxPrice, search } = req.query;

  let filter = { isAvailable: true, isApproved: true };

  if (category) filter.category = category;
  if (city) filter["location.city"] = new RegExp(city, "i");
  if (search) filter.title = new RegExp(search, "i");
  if (minPrice || maxPrice) {
    filter["pricing.perDay"] = {};
    if (minPrice) filter["pricing.perDay"].$gte = Number(minPrice);
    if (maxPrice) filter["pricing.perDay"].$lte = Number(maxPrice);
  }

  const equipment = await Equipment.find(filter)
    .populate("owner", "name avatar isVerified")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: equipment.length, equipment });
});

// @GET /api/equipment/:id
// Public
export const getEquipmentById = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id).populate(
    "owner",
    "name avatar isVerified phone"
  );

  if (!equipment) {
    res.status(404);
    throw new Error("Equipment not found");
  }

  res.status(200).json({ success: true, equipment });
});

// @PUT /api/equipment/:id
// Private — owner only
export const updateEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    res.status(404);
    throw new Error("Equipment not found");
  }

  // Make sure the logged in user is the owner
  if (equipment.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this equipment");
  }

  const updated = await Equipment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, equipment: updated });
});

// @DELETE /api/equipment/:id
// Private — owner only
export const deleteEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    res.status(404);
    throw new Error("Equipment not found");
  }

  // Make sure the logged in user is the owner
  if (equipment.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this equipment");
  }

  await equipment.deleteOne();

  res.status(200).json({ success: true, message: "Equipment deleted" });
});

// @GET /api/equipment/my
// Private — owner only
export const getMyEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, count: equipment.length, equipment });
});