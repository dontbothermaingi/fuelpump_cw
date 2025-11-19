import { useCallback, useEffect, useMemo, useState } from "react";
import PumpCard from "../pumps/pumpcard";
import Card from "../ui/card";
import { useNavigate } from "react-router";

function Dashboard() {
  const [pumps, setPumps] = useState([]);
  const [users, setUsers] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/bill_items")
      .then((response) => response.json())
      .then((data) => setBillItems(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  //useCallback stores a function in memory so React does not recreate it every time the component re-renders.

  const totalFuelBought = useMemo(() => {
    return billItems.reduce((total, item) => total + Number(item.litres), 0);
  }, [billItems]);

  const totaFuelSold = useMemo(() => {
    return transactions.reduce((total, tx) => total + Number(tx.litres), 0);
  }, [transactions]);

  const findFuelType = useCallback(
    (pumpId) => {
      const pump = pumps.find((p) => p.id === pumpId);
      return pump ? pump.type_of_fuel : "Unknown";
    },
    [pumps]
  );

  const findUserName = useCallback(
    (userId) => {
      const user = users.find((u) => u.id == userId);
      return user ? user.name : "Unknown";
    },
    [users]
  );

  const editDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    //Format the date according to the options above. `toLocaleDateString` handles formatting for us.
    // `toLocaleDateString` takes two arguments: a locale (undefined uses the user's locale) and options for formatting.
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handleViewDetails = useCallback(
    (pumpId) => {
      navigate(`/pump_details/${pumpId}`);
    },
    [navigate]
  );

  return (
    <div className="p-6 space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="bg-blue-600 text-white"
          title="Total Fuel Bought"
          description={
            new Intl.NumberFormat().format(totalFuelBought) + " Litres"
          }
        />
        <Card
          className="bg-green-600 text-white"
          title="Total Fuel Sold"
          description={new Intl.NumberFormat().format(totaFuelSold) + " Litres"}
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
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <h3
          style={{ fontFamily: "IT Medium" }}
          className="text-xl mb-3 text-gray-700"
        >
          Pump Profitability Rank
        </h3>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                {["Vehicle", "Fuel", "Quantity (L)", "Staff", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {tx.vehicle_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {findFuelType(tx.pump_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {tx.litres}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {findUserName(tx.user_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {editDate(tx.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
