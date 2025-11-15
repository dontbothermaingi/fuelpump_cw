import { useMemo, useState } from "react";

// --- MOCK DATA ---
const bills = [
  {
    id: 1,
    user_id: "U345",
    vendor_name: "Shell",
    vendor_email: "shellfuels@gmail.com",
    date: "2023-11-03",
  },
  {
    id: 2,
    user_id: "U345",
    vendor_name: "ADNOC",
    vendor_email: "adnocoil@gmail.com",
    date: "2023-11-04",
  },
  {
    id: 3,
    user_id: "A234",
    vendor_name: "Emirates Fuel",
    vendor_email: "emirates@fuel.com",
    date: "2023-11-05",
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

  {
    pump_id: "PMP001",
    pump_name: "Pump Alpha",
    bill_id: 2,
    litres: 500,
    price_per_litre: 2.0,
  },

  {
    pump_id: "PMP004",
    pump_name: "Pump Delta",
    bill_id: 3,
    litres: 1500,
    price_per_litre: 1.0,
  },
  {
    pump_id: "PMP003",
    pump_name: "Pump Gamma",
    bill_id: 3,
    litres: 300,
    price_per_litre: 1.1,
  },
];

// --- HELPER COMPONENTS ---

// Helper component for the detailed overview pop-up
const BillDetailDialog = ({ bill, onClose }) => {
  if (!bill) return null;

  const totalCost = new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(bill.totalCost);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-40">
      <div className="bg-white rounded-xl shadow-2xl w-full overflow-y-auto">
        {/* 1. Header / Invoice Metadata */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2
            style={{ fontFamily: "IT Medium" }}
            className="text-2xl font-bold text-gray-800"
          >
            FUEL PURCHASE BILL
          </h2>
          <div className="text-right text-md">
            <p
              style={{ fontFamily: "IT Medium" }}
              className="font-semibold text-indigo-700"
            >
              Bill ID: #00{bill.id}
            </p>
            <p style={{ fontFamily: "IT Medium" }} className="text-gray-500">
              Date: {bill.date}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 2. Vendor Information */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-700">
              Vendor Details
            </h3>
            <div className="grid grid-cols-3 text-md text-gray-700">
              <p style={{ fontFamily: "IT Bold" }}>
                Vendor Name:{" "}
                <span style={{ fontFamily: "IT Regular" }}>
                  {bill.vendor_name}
                </span>
              </p>
              <p style={{ fontFamily: "IT Bold" }}>
                Vendor Email:{" "}
                <span style={{ fontFamily: "IT Regular" }}>
                  {bill.vendor_email}
                </span>
              </p>
              <p style={{ fontFamily: "IT Bold" }}>
                Recorded By:{" "}
                <span style={{ fontFamily: "IT Regular" }}>{bill.user_id}</span>
              </p>
            </div>
          </div>

          {/* 3. Itemized Table (Core of the Invoice) */}
          <h3
            style={{ fontFamily: "IT Medium" }}
            className="text-xl font-bold pt-4 text-gray-800"
          >
            Bill Items
          </h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <table
              style={{ fontFamily: "IT Medium" }}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-md font-bold text-gray-600 uppercase">
                    Pump/Item
                  </th>
                  <th className="px-4 py-3 text-md font-bold text-gray-600 uppercase">
                    Litres
                  </th>
                  <th className="px-4 py-3 text-md font-bold text-gray-600 uppercase">
                    Rate (AED/L)
                  </th>
                  <th className="px-4 py-3 text-right text-md font-bold text-gray-600 uppercase">
                    Total (AED)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-md font-medium text-indigo-600">
                      {item.pump_name} ({item.pump_id})
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-md text-gray-700">
                      {item.litres.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-md text-gray-700">
                      {item.price_per_litre.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-md font-semibold text-right">
                      {(item.litres * item.price_per_litre).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Summary Totals (Footer Section) */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 p-3 bg-gray-50 rounded-lg">
              {/* Total Litres */}
              <div className="flex justify-between text-base font-semibold text-gray-800">
                <span>Total Litres Purchased:</span>
                <span>{bill.totalLitres.toFixed(2)} L</span>
              </div>

              {/* Grand Total (Highly Highlighted) */}
              <div className="flex justify-between border-t-2 border-green-600 pt-3 text-xl font-extrabold text-green-700">
                <span>GRAND TOTAL:</span>
                <span>{totalCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button at the bottom */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Compont

const ViewBills = () => {
  const [selectedBill, setSelectedBill] = useState(null);

  // 1. Data Merging and Calculation
  const { processedBills, grandTotalCost, grandTotalLitres } = useMemo(() => {
    // Group bill items by bill_id
    const groupedItems = bill_items.reduce((acc, item) => {
      acc[item.bill_id] = acc[item.bill_id] || [];
      acc[item.bill_id].push(item);
      return acc;
    }, {});

    let grandTotalCost = 0;
    let grandTotalLitres = 0;

    // Process bills: calculate totals and link items
    const processedBills = bills.map((bill) => {
      const items = groupedItems[bill.id] || [];

      const { totalCost, totalLitres } = items.reduce(
        (acc, item) => {
          const cost = item.litres * item.price_per_litre;
          acc.totalCost += cost;
          acc.totalLitres += item.litres;
          return acc;
        },
        { totalCost: 0, totalLitres: 0 }
      );

      grandTotalCost += totalCost;
      grandTotalLitres += totalLitres;

      return {
        ...bill,
        totalCost,
        totalLitres,
        items,
      };
    });

    return { processedBills, grandTotalCost, grandTotalLitres };
  }, []);

  // Handler for row click to show details
  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
  };

  const handleCloseDialog = () => {
    setSelectedBill(null);
  };

  // Helper for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        <h1
          style={{ fontFamily: "IT Medium" }}
          className="text-3xl text-gray-800 border-b pb-2"
        >
          Purchased Bills Overview
        </h1>
        <p style={{ fontSize: "IT Regular" }} className="text-gray-600">
          Click any row to see the itemized breakdown of the purchase.
        </p>

        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200">
          <table
            style={{ fontFamily: "IT Medium" }}
            className="min-w-full divide-y divide-gray-200"
          >
            <thead className="bg-indigo-600 text-white uppercase text-md font-bold">
              <tr>
                <th className="px-6 py-3 text-left">Bill ID</th>
                <th className="px-6 py-3 text-left">Vendor</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left ">Total Litres</th>
                <th className="px-6 py-3 text-right ">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {processedBills.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => handleViewDetails(bill)}
                  className="hover:bg-indigo-50 cursor-pointer transition duration-150"
                >
                  <td className="px-6 py-4 text-md font-semibold text-indigo-700">
                    {bill.id}
                  </td>
                  <td className="px-6 py-4 text-md text-gray-900">
                    {bill.vendor_name}
                  </td>
                  <td className="px-6 py-4 text-md text-gray-500">
                    {bill.date}
                  </td>
                  <td className="px-6 py-4 text-md text-gray-700">
                    {bill.totalLitres.toFixed(2)} L
                  </td>
                  <td className="px-6 py-4  text-md font-bold text-right text-green-600">
                    {formatCurrency(bill.totalCost)}
                  </td>
                </tr>
              ))}

              <tr className="bg-gray-100 border-t-2 border-indigo-600 font-extrabold text-gray-900">
                <td colSpan="3" className="px-6 py-4 text-right uppercase">
                  GRAND TOTAL (All Bills)
                </td>
                <td className="px-6 py-4 text-left">
                  {grandTotalLitres.toFixed(2)} L
                </td>
                <td className="px-6 py-4 text-right text-lg text-indigo-700">
                  {formatCurrency(grandTotalCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <BillDetailDialog bill={selectedBill} onClose={handleCloseDialog} />
    </div>
  );
};

export default ViewBills;
