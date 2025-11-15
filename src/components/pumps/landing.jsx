import { useState } from "react";
// Assuming CreatePumps component is imported
import PumpCard from "./pumpcard";
import CreatePumps from "./createpumps";
import { Dialog } from "@mui/material";
// Assuming you'll create a PumpCard component (see section 3)
// import PumpCard from './PumpCard';

// Mock Data (Replace with your actual fetch call later)
const MOCK_PUMPS = [
  {
    id: "PMP001",
    name: "Pump Alpha (Diesel)",
    type_of_fuel: "Diesel",
    current_reading: 234678,
    litres_capacity: 1200,
  },
  {
    id: "PMP002",
    name: "Pump Beta (Petrol)",
    type_of_fuel: "Petrol",
    current_reading: 987654,
    litres_capacity: 1500,
  },
  {
    id: "PMP003",
    name: "Pump Gamma (Diesel)",
    type_of_fuel: "Diesel",
    current_reading: 50000,
    litres_capacity: 800,
  },
];

function LandingPumpPage() {
  const [pumps, setPumps] = useState(MOCK_PUMPS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle navigation (replace with actual routing like react-router-dom)
  const handleViewDetails = (pumpId) => {
    console.log(`Navigating to details for Pump ID: ${pumpId}`);
    // In a real application, you'd use: navigate(`/pumps/${pumpId}`);
    alert(`Showing details for Pump ID: ${pumpId}`);
  };

  // Function to simulate pump creation success (to update the list)
  const handleNewPumpCreated = (newPump) => {
    // In a real app, you'd refetch the list or add the new pump
    console.log("New pump created:", newPump);
    // For mock data, we just close the modal
    setIsModalOpen(false);
    // setPumps(prevPumps => [...prevPumps, newPump]);
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER AND CTA BUTTON */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1
          style={{ fontFamily: "IT Medium" }}
          className="text-4xl text-gray-800"
        >
          Fuel Pumps Overview
        </h1>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-150"
          style={{ fontFamily: "IT Bold" }}
        >
          + New Pump
        </button>
      </header>

      {/* PUMP LIST (CARD GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pumps.map((pump) => (
          <PumpCard
            key={pump.id}
            pump={pump}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* DIALOG POPUP */}
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <div className="flex justify-end p-3">
            <button
              onClick={() => setIsModalOpen(false)}
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
