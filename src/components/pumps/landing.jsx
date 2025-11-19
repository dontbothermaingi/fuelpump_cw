import { useEffect, useState } from "react";
import PumpCard from "./pumpcard";
import CreatePumps from "./createpumps";
import { Dialog } from "@mui/material";
import { useNavigate } from "react-router";

function LandingPumpPage() {
  const [pumps, setPumps] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle navigation
  const handleViewDetails = (pumpId) => {
    navigate(`/pump_details/${pumpId}`);
  };

  // Retrieve user info from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.role; // "admin" or "staff"

  useEffect(() => {
    fetch("http://localhost:5000/pumps")
      .then((response) => response.json())
      .then((data) => setPumps(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1
          style={{ fontFamily: "IT Medium" }}
          className="text-4xl text-gray-800"
        >
          Fuel Pumps Overview
        </h1>
        <button
          onClick={() => setOpen(true)}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-150 cursor-pointer ${
            role !== "Admin" ? "hidden" : ""
          }`}
          style={{ fontFamily: "IT Bold" }}
        >
          + New Pump
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pumps.map((pump) => (
          <PumpCard
            key={pump.id}
            pump={pump}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {open && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <div className="flex justify-end p-3">
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>
          </div>

          <CreatePumps />
        </Dialog>
      )}
    </div>
  );
}

export default LandingPumpPage;
