import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEquipmentById } from "../../api/equipment";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { MapPin, Star, User, Calendar, MessageCircle } from "lucide-react";

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const res = await getEquipmentById(id);
      setEquipment(res.data.equipment);
    } catch (err) {
      toast.error("Equipment not found");
      navigate("/equipment");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days < 1) return 0;
    return days * equipment.pricing.perDay;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      navigate("/login");
      return;
    }

    if (user.role !== "renter") {
      toast.error("Only renters can book equipment");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select dates");
      return;
    }

    if (calculateDays() < 1) {
      toast.error("End date must be after start date");
      return;
    }

    setBooking(true);
    try {
      await api.post("/bookings", {
        equipmentId: id,
        startDate,
        endDate,
        note,
        proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
      });
      toast.success("Booking request sent!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">Loading...</div>
    );
  }

  if (!equipment) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left — Equipment Info */}
      <div className="lg:col-span-2">
        {/* Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden h-80 mb-6">
          {equipment.images?.length > 0 ? (
            <img
              src={equipment.images[0]}
              alt={equipment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Title & category */}
        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full capitalize">
          {equipment.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">
          {equipment.title}
        </h1>

        {/* Location & rating */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={16} />
            {equipment.location?.city}, {equipment.location?.state}
          </span>
          <span className="flex items-center gap-1 text-amber-500 text-sm">
            <Star size={16} fill="currentColor" />
            {equipment.rating?.average > 0
              ? equipment.rating.average.toFixed(1)
              : "No reviews yet"}
          </span>
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {equipment.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Pricing</h2>
          <div className="grid grid-cols-3 gap-4">
            {equipment.pricing?.perHour > 0 && (
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="text-blue-600 font-bold text-lg">
                  ₹{equipment.pricing.perHour}
                </p>
                <p className="text-gray-500 text-sm">per hour</p>
              </div>
            )}
            <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-600 font-bold text-lg">
                ₹{equipment.pricing.perDay}
              </p>
              <p className="text-gray-500 text-sm">per day</p>
            </div>
            {equipment.pricing?.perWeek > 0 && (
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <p className="text-blue-600 font-bold text-lg">
                  ₹{equipment.pricing.perWeek}
                </p>
                <p className="text-gray-500 text-sm">per week</p>
              </div>
            )}
          </div>
        </div>

        {/* Owner info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Owner</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {equipment.owner?.name}
              </p>
              {equipment.owner?.isVerified && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Verified Owner
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Booking Card */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4">
            Book this Equipment
          </h2>

          {/* Dates */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Total */}
          {calculateDays() > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  ₹{equipment.pricing.perDay} x {calculateDays()} days
                </span>
                <span className="font-semibold text-gray-800">
                  ₹{calculateTotal()}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-blue-600">₹{calculateTotal()}</span>
              </div>
            </div>
          )}

          {/* Note */}
          <textarea
            placeholder="Add a note to the owner (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
          />

          {/* Negotiate */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Propose a price (optional)
            </label>
            <input
              type="number"
              placeholder={`Default: ₹${equipment.pricing.perDay}/day`}
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Book button */}
          <button
            onClick={handleBooking}
            disabled={booking}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {booking ? "Sending Request..." : "Request to Book"}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Please{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                login
              </span>{" "}
              to book
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;