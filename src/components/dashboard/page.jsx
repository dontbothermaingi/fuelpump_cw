import { useEffect, useState } from "react";
import PumpCard from "../pumps/pumpcard";
import Card from "../ui/card";

function Dashboard() {
  const [pumps, setPumps] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/fuel_transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/pumps")
      .then((response) => response.json())
      .then((data) => setPumps(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="bg-blue-600 text-white"
          title="Total Fuel Bought"
          description="15,000 Litres"
        />
        <Card
          className="bg-green-600 text-white"
          title="Total Fuel Sold"
          description="7,500 Litres"
        />
        <Card
          className="bg-yellow-600 text-black"
          title="Revenue"
          description="$25,000"
        />
      </div>

      {/* Pumps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pumps Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {pumps.map((pump) => (
            <PumpCard
              key={pump.id}
              pump={pump}
              // onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Fuel</th>
              <th className="border p-2">Quantity (L)</th>
              <th className="border p-2">Staff</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="text-center">
                <td className="border p-2">{tx.vehicle}</td>
                <td className="border p-2">{tx.fuel}</td>
                <td className="border p-2">{tx.qty}</td>
                <td className="border p-2">{tx.staff}</td>
                <td className="border p-2">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
