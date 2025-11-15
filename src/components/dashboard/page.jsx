import PumpCard from "../pumps/pumpcard";
import Card from "../ui/card";

const pumps = [
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

const recentTransactions = [
  {
    vehicle: "KCA 123A",
    fuel: "Petrol",
    qty: 50,
    staff: "John",
    date: "2025-11-13",
  },
  {
    vehicle: "KBA 456B",
    fuel: "Diesel",
    qty: 40,
    staff: "Mary",
    date: "2025-11-13",
  },
  {
    vehicle: "KDA 789C",
    fuel: "Petrol",
    qty: 60,
    staff: "John",
    date: "2025-11-12",
  },
];

function Dashboard() {
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
            {recentTransactions.map((tx, idx) => (
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
