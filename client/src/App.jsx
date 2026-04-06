import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import EquipmentList from "./pages/equipment/EquipmentList";
import EquipmentDetail from "./pages/equipment/EquipmentDetails";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddEquipment from "./pages/equipment/AddEquipment";
import RenterDashboard from "./pages/renter/RenterDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/equipment" element={<Layout><EquipmentList /></Layout>} />
        <Route path="/equipment/:id" element={<Layout><EquipmentDetail /></Layout>} />
        <Route path="/owner/dashboard" element={<Layout><OwnerDashboard /></Layout>} />
        <Route path="/owner/equipment/add" element={<Layout><AddEquipment /></Layout>} />
        <Route path="/dashboard" element={<Layout><RenterDashboard /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;