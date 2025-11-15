import "./App.css";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/sidebar/sidebar";
import Dashboard from "./components/dashboard/page";
import Topbar from "./components/ui/topbar";
import Login from "./components/authentication/login";
import { useMediaQuery } from "@mui/material";
import BuyFuel from "./components/Fuel/buyfuel";
import FuelVehicles from "./components/Fuel/fuelvehicles";
import LandingPumpPage from "./components/pumps/landing";

function App() {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (desktop only) */}
      {!isMobile && (
        <aside className="w-64 fixed top-0 left-0 h-full bg-white">
          <SideBar />
        </aside>
      )}

      {/* Main content wrapper */}
      <main
        className={`flex flex-col w-full transition-all duration-300 ${
          isMobile ? "ml-0" : "ml-64"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white">
          <Topbar />
        </header>

        {/* Scrollable content */}
        <section className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buy-fuel" element={<BuyFuel />} />
            <Route path="/fuel-vehicle" element={<FuelVehicles />} />
            <Route path="/pumps" element={<LandingPumpPage />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;
