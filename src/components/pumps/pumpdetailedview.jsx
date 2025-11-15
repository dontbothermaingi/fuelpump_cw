import { useState, useMemo } from "react";
import EditPumps from "./editpump";
import { Dialog } from "@mui/material";

// Mock Data (In a real app, this would be passed as a prop or fetched)
const PUMP_TO_EDIT = {
  id: "PMP001",
  name: "Pump Alpha",
  pump_reading: 234678,
  type_of_fuel: "Diesel",
  litres: 1200,
};

const PUMP_TRANSACTIONS = [
  {
    id: 5,
    user_id: "U345",
    pump_id: "PMP001",
    litres: "200",
    vehcile_number: "1234T",
    date: "2024-11-15",
  },
  {
    id: 4,
    user_id: "U101",
    pump_id: "PMP001",
    litres: "150",
    vehcile_number: "5678U",
    date: "2024-11-14",
  },
  {
    id: 3,
    user_id: "U789",
    pump_id: "PMP001",
    litres: "300",
    vehcile_number: "9012V",
    date: "2024-11-13",
  },
  {
    id: 2,
    user_id: "U222",
    pump_id: "PMC001",
    litres: "200",
    vehcile_number: "1111X",
    date: "2024-11-12",
  }, // Filtered out
  {
    id: 1,
    user_id: "U345",
    pump_id: "PMP001",
    litres: "50",
    vehcile_number: "2222Y",
    date: "2024-11-11",
  },
];

// Reusable component for displaying the transaction list.

function TransactionTable({ transactions }) {
  if (transactions.length === 0) {
    return (
      <p className="text-gray-500 p-4">No transactions found for this pump.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Litres
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {t.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t.vehcile_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t.litres}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t.user_id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PumpDetailedView() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //Data Filtering and Sorting Logic
  const transactions = useMemo(() => {
    const currentPumpId = PUMP_TO_EDIT.id;

    // 1. Filter: Keep only transactions belonging to this pump
    const filtered = PUMP_TRANSACTIONS.filter(
      (t) => t.pump_id === currentPumpId
    );

    // 2. Sort: Sort by date (latest first). We convert the "YYYY-MM-DD" string to a Date object.
    const sorted = filtered.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return sorted;
  }, []); // Recalculate only if PUMP_TRANSACTIONS changes (or prop change in a real app)

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className=" mx-auto space-y-8">
        {/* 1. HEADER & EDIT BUTTON */}
        <header className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center pb-4 border-b border-gray-300">
          <h1
            style={{ fontFamily: "IT Medium" }}
            className="text-3xl  text-gray-800"
          >
            Pump Details: {PUMP_TO_EDIT.name}
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
            style={{ fontFamily: "IT Medium" }}
          >
            Edit Pump
          </button>
        </header>

        {/* 2. PUMP DETAILS CARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-xl  mb-4 text-gray-700"
          >
            General Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem
              fontType={"IT Medium"}
              label="Pump ID"
              value={PUMP_TO_EDIT.id}
            />
            <DetailItem
              label="Fuel Type"
              value={PUMP_TO_EDIT.type_of_fuel}
              fontType={"IT Medium"}
              highlight={
                PUMP_TO_EDIT.type_of_fuel === "Diesel"
                  ? "text-blue-600"
                  : "text-orange-600"
              }
            />
            <DetailItem
              fontType={"IT Medium"}
              label="Capacity (Litres)"
              value={new Intl.NumberFormat().format(PUMP_TO_EDIT.litres)}
            />
            <DetailItem
              label="Current Reading"
              fontType={"IT Medium"}
              value={new Intl.NumberFormat().format(PUMP_TO_EDIT.pump_reading)}
            />
          </div>
        </div>

        {/* 3. TRANSACTION HISTORY TABLE */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Transaction History ({transactions.length})
          </h2>
          <TransactionTable transactions={transactions} />
        </section>
      </div>

      {/* 4. EDIT MODAL POPUP */}
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

          <EditPumps />
        </Dialog>
      )}
    </div>
  );
}

// Helper component for cleaner detail display
const DetailItem = ({
  label,
  value,
  fontType,
  highlight = "text-gray-800",
}) => (
  <div>
    <p
      style={{ fontFamily: fontType }}
      className="text-sm font-medium text-gray-500"
    >
      {label}
    </p>
    <p
      style={{ fontFamily: fontType }}
      className={`mt-1 text-lg font-bold ${highlight}`}
    >
      {value}
    </p>
  </div>
);

export default PumpDetailedView;
