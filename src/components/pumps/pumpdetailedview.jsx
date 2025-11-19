import { useState, useMemo, useEffect, useCallback } from "react";
import EditPumps from "./editpump";
import { Dialog } from "@mui/material";
import { useParams } from "react-router";

function PumpDetailedView() {
  const [open, setOpen] = useState(false);
  const [pump, setPump] = useState({});
  const [users, setUsers] = useState([]);
  const [fuelTransactions, setFuelTransactions] = useState([]);
  const { pumpId } = useParams();

  const handleClose = () => {
    setOpen(false);
  };

  // Retrieve user info from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.role; // "admin" or "staff"

  useEffect(() => {
    fetch(`http://localhost:5000/pumps/${pumpId}`)
      .then((response) => response.json())
      .then((data) => {
        // Set pump data to state (not shown here for brevity)
        console.log("Fetched pump data:", data);
        setPump(data);
      })
      .catch((error) => console.error("Error fetching pump details:", error));
  }, [pumpId]);

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

  const findUserName = useCallback(
    (userId) => {
      const user = users.find((u) => u.id == userId);
      return user ? user.name : "Unknown";
    },
    [users]
  );

  const editDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  //Data Filtering and Sorting Logic
  const transactions = useMemo(() => {
    // 1. Filter: Keep only transactions belonging to this pump
    const filtered = fuelTransactions.filter((t) => t.pump_id == pump.id);

    // 2. Sort: Sort by date (latest first). We convert the "YYYY-MM-DD" string to a Date object.
    const sorted = filtered.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return sorted;
  }, [fuelTransactions]); // Recalculate only if fuel_transactions changes

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className=" mx-auto space-y-8">
        {/* 1. HEADER & EDIT BUTTON */}
        <header className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center pb-4 border-b border-gray-300">
          <h1
            style={{ fontFamily: "IT Medium" }}
            className="text-3xl  text-gray-800"
          >
            Pump Details: {pump.pump_name}
          </h1>
          <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 cursor-pointer ${
              role !== "Admin" ? "hidden" : ""
            }`}
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
              value={pump.id}
            />
            <DetailItem
              label="Fuel Type"
              value={pump.type_of_fuel}
              fontType={"IT Medium"}
              highlight={
                pump.type_of_fuel === "Diesel"
                  ? "text-blue-600"
                  : "text-orange-600"
              }
            />
            <DetailItem
              fontType={"IT Medium"}
              label="Capacity (Litres)"
              value={new Intl.NumberFormat().format(pump.litres_capacity)}
            />
          </div>
        </div>

        {/* 3. TRANSACTION HISTORY TABLE */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Transaction History ({transactions.length})
          </h2>
          <TransactionTable
            findUserName={findUserName}
            editDate={editDate}
            transactions={transactions}
          />
        </section>
      </div>

      {/* 4. EDIt Dialog */}
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

          <EditPumps pumpId={pumpId} />
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

// Reusable component for displaying the transaction list.

function TransactionTable({ transactions, editDate, findUserName }) {
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
                {editDate(t.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t.vehicle_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t.litres}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {findUserName(t.user_id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PumpDetailedView;
