import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyBookings, cancelBooking } from "../../api/booking";
import toast from "react-hot-toast";
import { MapPin, Calendar, XCircle } from "lucide-react";

const RenterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "renter") {
      navigate("/");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredBookings = activeTab === "all"
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Accepted</p>
          <p className="text-2xl font-bold text-green-500">
            {bookings.filter((b) => b.status === "accepted").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-blue-500">
            {bookings.filter((b) => b.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", "pending", "accepted", "rejected", "cancelled", "completed"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-400 mb-4">No bookings found</p>
            <button
              onClick={() => navigate("/equipment")}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Browse Equipment
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-4">
                  {/* Equipment image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {booking.equipment?.images?.length > 0 ? (
                      <img
                        src={booking.equipment.images[0]}
                        alt={booking.equipment.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {booking.equipment?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Owner: {booking.owner?.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      {booking.equipment?.location?.city}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {/* Price info */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-3">
                <span className="text-sm text-gray-600">
                  ₹{booking.pricePerDay}/day × {booking.totalDays} days
                </span>
                <span className="font-bold text-blue-600">
                  ₹{booking.totalAmount}
                </span>
              </div>

              {/* Negotiation status */}
              {booking.negotiation?.isNegotiated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-3 text-sm">
                  <span className="text-yellow-800 font-medium">
                    Negotiation:{" "}
                  </span>
                  <span className="text-yellow-700 capitalize">
                    {booking.negotiation.negotiationStatus} — Proposed ₹
                    {booking.negotiation.proposedPrice}/day
                  </span>
                </div>
              )}

              {/* Note */}
              {booking.note && (
                <p className="text-sm text-gray-500 mb-3">
                  Note: {booking.note}
                </p>
              )}

              {/* Cancel button */}
              {booking.status === "pending" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="flex items-center gap-1 text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                >
                  <XCircle size={14} />
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RenterDashboard;