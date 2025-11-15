import { useMemo } from "react";

// --- MOCK DATA ---
const MOCK_PUMPS = [
  {
    id: "PMP001",
    name: "Pump Alpha (Diesel)",
    type_of_fuel: "Diesel",
    current_reading: 234678,
    litres_capacity: 1200,
    price_per_liter: 2.58,
  },
  {
    id: "PMP002",
    name: "Pump Beta (Petrol)",
    type_of_fuel: "Petrol",
    current_reading: 987654,
    litres_capacity: 1500,
    price_per_liter: 2.02,
  },
  {
    id: "PMP003",
    name: "Pump Gamma (Diesel)",
    type_of_fuel: "Diesel",
    current_reading: 50000,
    litres_capacity: 800,
    price_per_liter: 1.76,
  },
];

const PUMP_TRANSACTIONS = [
  // PMP001 (Price: 2.58)
  {
    id: 5,
    user_id: "U345",
    pump_id: "PMP001",
    litres: "200",
    vehcile_number: "1234T",
    date: "2024-11-15",
    price_per_litre: 2.58,
  },
  {
    id: 4,
    user_id: "U101",
    pump_id: "PMP001",
    litres: "150",
    vehcile_number: "5678U",
    date: "2024-11-14",
    price_per_litre: 2.58,
  },
  {
    id: 3,
    user_id: "U789",
    pump_id: "PMP001",
    litres: "300",
    vehcile_number: "9012V",
    date: "2024-11-13",
    price_per_litre: 2.58,
  },
  {
    id: 1,
    user_id: "U345",
    pump_id: "PMP001",
    litres: "50",
    vehcile_number: "2222Y",
    date: "2024-11-11",
    price_per_litre: 2.58,
  },

  // PMP002 (Price: 2.02)
  {
    id: 6,
    user_id: "A234",
    pump_id: "PMP002",
    litres: "100",
    vehcile_number: "Z999",
    date: "2024-11-10",
    price_per_litre: 2.02,
  },

  // PMP003 (Price: 1.76)
  {
    id: 7,
    user_id: "F651",
    pump_id: "PMP003",
    litres: "75",
    vehcile_number: "Q111",
    date: "2024-11-09",
    price_per_litre: 1.76,
  },

  {
    id: 2,
    user_id: "U222",
    pump_id: "PMP003",
    litres: "200",
    vehcile_number: "1111X",
    date: "2024-11-12",
    price_per_litre: 1.76,
  },
];

const staff = [
  { name: "Pep Guardiola", user_id: "U345", role: "Admin" },
  { name: "Bryan Mbeumo", user_id: "A234", role: "Staff" },
  { name: "Ruben Amorim", user_id: "F651", role: "Staff" },
  { name: "Erling Haaland", user_id: "B444", role: "Staff" },
  { name: "Cole Palmer", user_id: "U222", role: "Staff" },
  { name: "Jeremy Doku", user_id: "U789", role: "Staff" },
  { name: "Romelu Lukaku", user_id: "U101", role: "Staff" },
];

const bills = [
  {
    id: 1,
    user_id: "U345",
    vendor_name: "Shell",
    vendor_email: "shellfuels@gmail.com",
    date: "11/03/2023",
  },
];

const bill_items = [
  {
    pump_id: "PMP001",
    pump_name: "Pump Alpha",
    bill_id: 1,
    litres: 1000,
    price_per_litre: 1.5,
  },
  {
    pump_id: "PMP002",
    pump_name: "Pump Beta",
    bill_id: 1,
    litres: 1200,
    price_per_litre: 1.2,
  },
  {
    pump_id: "PMP003",
    pump_name: "Pump Gamma",
    bill_id: 1,
    litres: 700,
    price_per_litre: 0.9,
  },
];

// --- UTILITY COMPONENTS ---

// Helper function to find pump data
const findPump = (id) => MOCK_PUMPS.find((p) => p.id === id);

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
  // 1. FINANCIAL CALCULATIONS (Purchases, Sales, Profit)
  const financialSummary = useMemo(() => {
    // Total Cost (Purchases)
    const totalCost = bill_items.reduce((sum, item) => {
      return sum + item.litres * item.price_per_litre;
    }, 0);

    // Total Sales (Revenue)
    const totalRevenue = PUMP_TRANSACTIONS.reduce((sum, transaction) => {
      const pump = findPump(transaction.pump_id);
      const litres = parseFloat(transaction.litres) || 0;

      if (!pump) return sum; // Skip transactions for invalid pumps

      return sum + litres * pump.price_per_liter;
    }, 0);

    const grossProfit = totalRevenue - totalCost;

    return { totalCost, totalRevenue, grossProfit };
  }, []);

  // 2. PUMP PERFORMANCE
  const pumpPerformance = useMemo(() => {
    const pumpDataMap = {};

    // Calculate Revenue and Litres Sold for each pump
    PUMP_TRANSACTIONS.forEach((t) => {
      const pumpId = t.pump_id;
      const pumpDetails = findPump(pumpId);
      if (!pumpDetails) return;

      const litres = parseFloat(t.litres) || 0;
      const revenue = litres * pumpDetails.price_per_liter;

      pumpDataMap[pumpId] = pumpDataMap[pumpId] || {
        id: pumpId,
        name: pumpDetails.name,
        totalRevenue: 0,
        totalLitresSold: 0,
        totalCost: 0,
      };

      pumpDataMap[pumpId].totalRevenue += revenue;
      pumpDataMap[pumpId].totalLitresSold += litres;
    });

    // Add Total Cost for each pump from Bill Items (COGS)
    bill_items.forEach((item) => {
      if (pumpDataMap[item.pump_id]) {
        pumpDataMap[item.pump_id].totalCost +=
          item.litres * item.price_per_litre;
      }
    });

    const results = Object.values(pumpDataMap)
      .map((pump) => ({
        ...pump,
        grossProfit: pump.totalRevenue - pump.totalCost,
      }))
      .sort((a, b) => b.grossProfit - a.grossProfit); // Sort by highest profit

    return results;
  }, []);

  const mostProfitablePump =
    pumpPerformance.length > 0 ? pumpPerformance[0] : null;

  // 3. STAFF PERFORMANCE
  const staffPerformance = useMemo(() => {
    const staffSalesMap = {};

    // Group sales by user_id
    PUMP_TRANSACTIONS.forEach((t) => {
      const userId = t.user_id;
      const litres = parseFloat(t.litres) || 0;

      staffSalesMap[userId] = staffSalesMap[userId] || {
        userId: userId,
        litresSold: 0,
      };
      staffSalesMap[userId].litresSold += litres;
    });

    // Combine with staff names, ROLE, and sort
    const results = Object.values(staffSalesMap)
      .map((sale) => {
        const staffMember = staff.find((s) => s.user_id === sale.userId);
        return {
          ...sale,
          name: staffMember
            ? staffMember.name
            : `Unknown User (${sale.userId})`,
          role: staffMember ? staffMember.role : "N/A", // <-- ADDED ROLE FIELD
        };
      })
      .sort((a, b) => b.litresSold - a.litresSold); // Sort by most litres sold

    return results;
  }, []);

  const topStaff = staffPerformance.length > 0 ? staffPerformance[0] : null;

  // --- RENDERING ---

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

      {/* --- FINANCIAL OVERVIEW --- */}
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

      {/* --- OPERATIONAL REPORTS --- */}
      <section className="mb-10">
        <h2
          style={{ fontFamily: "IT Bold" }}
          className="text-2xl text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3"
        >
          Operational Highlights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Profitable Pump Card */}
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

          {/* Top Selling Staff Member Card */}
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

      {/* --- DETAILED PERFORMANCE TABLES --- */}
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
                  {/* ADDED ROLE COLUMN */}
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
