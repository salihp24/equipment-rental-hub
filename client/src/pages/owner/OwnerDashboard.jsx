import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyEquipment, deleteEquipment } from "../../api/equipment";
import { getOwnerBookings, updateBookingStatus, respondToNegotiation } from "../../api/booking";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react";

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("equipment");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "owner") {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [equipRes, bookingRes] = await Promise.all([
        getMyEquipment(),
        getOwnerBookings(),
      ]);
      setEquipment(equipRes.data.equipment);
      setBookings(bookingRes.data.bookings);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted");
      setEquipment(equipment.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const handleNegotiation = async (id, negotiationStatus) => {
    try {
      await respondToNegotiation(id, negotiationStatus);
      toast.success(`Negotiation ${negotiationStatus}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to respond");
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

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/owner/equipment/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Equipment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total Listings</p>
          <p className="text-2xl font-bold text-gray-800">{equipment.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total Bookings</p>
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
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("equipment")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "equipment"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          My Equipment
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === "bookings"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          Bookings
        </button>
      </div>

      {/* Equipment Tab */}
      {activeTab === "equipment" && (
        <div className="space-y-4">
          {equipment.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-400 mb-4">No equipment listed yet</p>
              <Link
                to="/owner/equipment/add"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                Add Your First Equipment
              </Link>
            </div>
          ) : (
            equipment.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      ₹{item.pricing?.perDay}/day
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.isApproved ? "Approved" : "Pending Approval"}
                  </span>
                  <Link
                    to={`/equipment/${item._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/owner/equipment/edit/${item._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-400">No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {booking.equipment?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Renter: {booking.renter?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      ₹{booking.totalAmount} ({booking.totalDays} days)
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Note */}
                {booking.note && (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                    Note: {booking.note}
                  </p>
                )}

                {/* Negotiation */}
                {booking.negotiation?.isNegotiated &&
                  booking.negotiation?.negotiationStatus === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800 font-medium mb-2">
                        Proposed price: ₹{booking.negotiation.proposedPrice}/day
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNegotiation(booking._id, "accepted")}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleNegotiation(booking._id, "rejected")}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                {/* Accept/Reject booking */}
                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookingStatus(booking._id, "accepted")}
                      className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button
                      onClick={() => handleBookingStatus(booking._id, "rejected")}
                      className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;