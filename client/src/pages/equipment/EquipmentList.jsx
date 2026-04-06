import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllEquipment } from "../../api/equipment";
import { MapPin, Star, Search, SlidersHorizontal } from "lucide-react";

const categories = [
  { label: "All", value: "" },
  { label: "Cameras", value: "cameras" },
  { label: "Tools", value: "tools" },
  { label: "Electronics", value: "electronics" },
  { label: "Event Gear", value: "event" },
  { label: "Sports", value: "sports" },
  { label: "Vehicles", value: "vehicles" },
  { label: "Other", value: "other" },
];

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") || "";
    setSelectedCategory(category);
    fetchEquipment({ category });
  }, [searchParams]);

  const fetchEquipment = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllEquipment(params);
      setEquipment(res.data.equipment);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEquipment({ search, category: selectedCategory });
  };

  const handleCategory = (value) => {
    setSelectedCategory(value);
    fetchEquipment({ search, category: value });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Browse Equipment
        </h1>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 py-3 outline-none text-sm text-gray-700"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              selectedCategory === cat.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : equipment.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No equipment found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <Link
              key={item._id}
              to={`/equipment/${item._id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition group"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.images?.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No image</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full capitalize">
                  {item.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Location & rating */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-400">
                    <MapPin size={14} />
                    {item.location?.city}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {item.rating?.average > 0
                      ? item.rating.average.toFixed(1)
                      : "New"}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-blue-600 font-bold">
                    ₹{item.pricing?.perDay}
                  </span>
                  <span className="text-gray-400 text-sm"> / day</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentList;