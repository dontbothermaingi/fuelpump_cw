import { use, useEffect, useMemo, useState } from "react";

// --- UTILITY COMPONENTS ---

// Helper component for displaying main statistics
const StatCard = ({
  title,
  value,
  unit,
  isMoney = true,
  color = "text-gray-900",
}) => {
  const formattedValue = isMoney
    ? new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
      }).format(value)
    : new Intl.NumberFormat().format(value);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-400">
      <p
        style={{ fontFamily: "IT Medium" }}
        className="text-sm text-gray-500 uppercase"
      >
        {title}
      </p>
      <p
        style={{ fontFamily: "IT Medium" }}
        className={`mt-1 text-3xl ${color}`}
      >
        {formattedValue} {unit}
      </p>
    </div>
  );
};

// --- MAIN REPORT COMPONENT ---

function ReportPage() {
  const [pumps, setPumps] = useState([]);
  const [users, setUsers] = useState([]);
  const [fuelTransactions, setFuelTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [billItems, setBillItems] = useState([]);

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
    fetch("http://localhost:5000/fuel_transactions")
      .then((response) => response.json())
      .then((data) => setFuelTransactions(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/bills")
      .then((response) => response.json())
      .then((data) => setBills(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/bill_items")
      .then((response) => response.json())
      .then((data) => setBillItems(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  // 1. FINANCIAL CALCULATIONS (Purchases, Sales, Profit)
  const financialSummary = useMemo(() => {
    const totalCost = billItems.reduce(
      (sum, item) => sum + Number(item.litres) * Number(item.price_per_litre),
      0
    );

    const totalRevenue = fuelTransactions.reduce((sum, transaction) => {
      const litres = Number(transaction.litres) || 0;
      const price = Number(transaction.price_per_liter) || 0;
      return sum + litres * price;
    }, 0);

    return { totalCost, totalRevenue, grossProfit: totalRevenue - totalCost };
  }, [billItems, fuelTransactions, pumps]);

  // 2. PUMP PERFORMANCE
  const pumpPerformance = useMemo(() => {
    return pumps
      .map((pump) => {
        const transactions = fuelTransactions.filter(
          (t) => t.pump_id === pump.id
        );
        const items = billItems.filter((item) => item.pump_id === pump.id);

        const totalRevenue = transactions.reduce(
          (sum, t) => sum + Number(t.litres) * Number(pump.price_per_litre),
          0
        );

        const totalCost = items.reduce(
          (sum, i) => sum + Number(i.litres) * Number(i.price_per_litre),
          0
        );

        return {
          id: pump.id,
          name: pump.pump_name,
          totalRevenue,
          totalCost,
          totalLitresSold: transactions.reduce(
            (sum, t) => sum + Number(t.litres),
            0
          ),
          grossProfit: totalRevenue - totalCost,
        };
      })
      .sort((a, b) => b.grossProfit - a.grossProfit);
  }, [pumps, fuelTransactions, billItems]);

  const mostProfitablePump =
    pumpPerformance.length > 0 ? pumpPerformance[0] : null;

  // 3. STAFF PERFORMANCE
  const staffPerformance = useMemo(() => {
    return users
      .map((user) => {
        const sales = fuelTransactions
          .filter((t) => t.user_id === user.id)
          .reduce((sum, t) => sum + Number(t.litres), 0);

        return {
          userId: user.id,
          name: user.name,
          role: user.role,
          litresSold: sales,
        };
      })
      .sort((a, b) => b.litresSold - a.litresSold);
  }, [users, fuelTransactions]);

  const topStaff = staffPerformance.length > 0 ? staffPerformance[0] : null;

  // Determine profit/loss color
  const profitColor =
    financialSummary.grossProfit >= 0 ? "text-green-600" : "text-red-600";
  const profitLabel =
    financialSummary.grossProfit >= 0 ? "Gross Profit" : "Gross Loss";

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen font-sans">
      <header className="mb-10">
        <h1
          style={{ fontFamily: "IT Medium" }}
          className="text-4xl text-gray-900"
        >
          Pump Station Report
        </h1>
        <p style={{ fontFamily: "IT Regular" }} className="text-gray-600 mt-1">
          Key performance indicators for all transactions and inventory.
        </p>
      </header>

      {/* Ovverviw */}
      <section className="mb-10">
        <h2
          style={{ fontFamily: "IT Bold" }}
          className="text-2xl text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3"
        >
          Financial Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Inventory Cost"
            value={financialSummary.totalCost}
            color="text-red-600"
          />
          <StatCard
            title="Total Sales Revenue"
            value={financialSummary.totalRevenue}
            color="text-blue-600"
          />
          <StatCard
            title={profitLabel}
            value={Math.abs(financialSummary.grossProfit)}
            color={profitColor}
          />
        </div>
      </section>

      {/* Operation report*/}
      <section className="mb-10">
        <h2
          style={{ fontFamily: "IT Bold" }}
          className="text-2xl text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3"
        >
          Operational Highlights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Profitable Pump */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500">
            <h3
              style={{ fontFamily: "IT Medium" }}
              className="text-xl text-gray-800 mb-2"
            >
              Most Profitable Pump
            </h3>
            {mostProfitablePump ? (
              <>
                <p
                  style={{ fontFamily: "IT Medium" }}
                  className="text-3xl text-green-600"
                >
                  {mostProfitablePump.name}
                </p>
                <p
                  style={{ fontFamily: "IT Regular" }}
                  className="text-lg text-gray-500 mt-1"
                >
                  Generated:
                  <span className="font-semibold text-lg ml-1">
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                    }).format(mostProfitablePump.grossProfit)}{" "}
                    Gross Profit
                  </span>
                </p>
                <p
                  style={{ fontFamily: "IT Light" }}
                  className="text-md text-gray-400 mt-2"
                >
                  Litres Sold:{" "}
                  {new Intl.NumberFormat().format(
                    mostProfitablePump.totalLitresSold
                  )}
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-500">
                Not enough data to determine pump profitability.
              </p>
            )}
          </div>

          {/* Top Selling staff */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500">
            <h3
              style={{ fontFamily: "IT Medium" }}
              className="text-xl text-gray-800 mb-2"
            >
              Top Selling Staff Member
            </h3>
            {topStaff ? (
              <>
                <p
                  style={{ fontFamily: "IT Medium" }}
                  className="text-3xl text-blue-600"
                >
                  {topStaff.name}
                </p>
                <p
                  style={{ fontFamily: "IT Regular" }}
                  className="text-sm text-gray-500 mt-1"
                >
                  Role: {topStaff.role}
                </p>
                <p
                  style={{ fontFamily: "IT Medium" }}
                  className="text-lg text-blue-700"
                >
                  {new Intl.NumberFormat().format(topStaff.litresSold)} Litres
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  User ID: {topStaff.userId}
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-500">
                No transactions recorded by staff.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tbale ananlysis */}
      <section>
        <h2
          style={{ fontFamily: "IT Bold" }}
          className="text-2xl text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3"
        >
          Detailed Performance Tables
        </h2>

        {/* Pump Performance Table */}
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
                  {[
                    "Pump Name",
                    "Revenue (AED)",
                    "Cost (AED)",
                    "Gross Profit (AED)",
                    "Litres Sold",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pumpPerformance.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {new Intl.NumberFormat().format(
                        p.totalRevenue.toFixed(2)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {new Intl.NumberFormat().format(p.totalCost.toFixed(2))}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        p.grossProfit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {new Intl.NumberFormat().format(p.grossProfit.toFixed(2))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Intl.NumberFormat().format(p.totalLitresSold)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Performance Table */}
        <div>
          <h3
            style={{ fontFamily: "IT Medium" }}
            className="text-xl mb-3 text-gray-700"
          >
            Staff Sales Rank (Litres)
          </h3>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  {["Staff Name", "Role", "User ID", "Litres Sold"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {staffPerformance.map((s) => (
                  <tr key={s.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                      {s.role}
                    </td>{" "}
                    {/* DISPLAYING ROLE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                      {new Intl.NumberFormat().format(s.litresSold)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportPage;
