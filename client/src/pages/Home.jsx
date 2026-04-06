import { Link } from "react-router-dom";
import { Camera, Wrench, Zap, MapPin, Shield, Star } from "lucide-react";

const categories = [
  { name: "Cameras", icon: <Camera size={28} />, value: "cameras" },
  { name: "Tools", icon: <Wrench size={28} />, value: "tools" },
  { name: "Electronics", icon: <Zap size={28} />, value: "electronics" },
  { name: "Event Gear", icon: <Star size={28} />, value: "event" },
  { name: "Sports", icon: <Shield size={28} />, value: "sports" }
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-2xl px-10 py-16 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Rent Equipment Near You
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Access cameras, tools, event gear and more — without the cost of ownership
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-white rounded-xl overflow-hidden max-w-2xl mx-auto shadow-lg">
          <MapPin className="text-gray-400 ml-4" size={20} />
          <input
            type="text"
            placeholder="Search for equipment..."
            className="flex-1 px-4 py-4 text-gray-800 outline-none text-sm"
          />
          <Link
            to="/equipment"
            className="bg-red-600 text-white px-6 py-4 text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/equipment?category=${cat.value}`}
              className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl py-6 gap-2 hover:border-blue-500 hover:text-blue-600 transition group"
            >
              <span className="text-gray-500 group-hover:text-blue-600 transition">
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-2xl px-10 py-12 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Find Equipment</h3>
            <p className="text-gray-500 text-sm">
              Search and filter equipment by category, location and price
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Book & Pay</h3>
            <p className="text-gray-500 text-sm">
              Choose your dates, negotiate the price and pay securely online
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Pick Up & Use</h3>
            <p className="text-gray-500 text-sm">
              Collect the equipment from the owner and return it after use
            </p>
          </div>
        </div>
      </div>

      {/* CTA for owners */}
      <div className="bg-gray-800 text-white rounded-2xl px-10 py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Own Equipment? Start Earning!
        </h2>
        <p className="text-gray-400 mb-6">
          List your idle equipment and earn money when you're not using it
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          List Your Equipment
        </Link>
      </div>
    </div>
  );
};

export default Home;