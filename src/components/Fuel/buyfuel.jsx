import { useState } from "react";

function BuyFuel() {
  const [formData, setFormData] = useState({
    user_id: "",
    vendor_name: "",
    vendor_email: "",
    date: "",
  });

  const [itemsData, setItemsData] = useState([
    {
      pump_id: "",
      pump_name: "",
      bill_id: "",
      litres: "",
      price_per_litre: "",
    },
  ]);

  const availablePumps = [
    { id: "PMP001", name: "Pump Alpha" },
    { id: "PMP002", name: "Pump Beta" },
    { id: "PMP003", name: "Pump Gamma" },
    { id: "PMP004", name: "Pump Delta" },
  ];

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleItemsChange(e, index) {
    const { name, value } = e.target;

    setItemsData((prevItemsData) => {
      const updatedItems = [...prevItemsData];

      let updatedItem = { ...updatedItems[index] };

      if (name === "pump_id") {
        const selectedPump = availablePumps.find((p) => p.id === value);
        updatedItem = {
          ...updatedItem,
          pump_id: value,
          pump_name: selectedPump ? selectedPump.name : "",
        };
      } else {
        updatedItem = {
          ...updatedItem,
          [name]: value,
        };
      }

      updatedItems[index] = updatedItem;
      return updatedItems;
    });
  }

  function addItem() {
    setItemsData((prevItemsData) => [
      ...prevItemsData,
      {
        pump_id: "",
        pump_name: "",
        bill_id: "",
        litres: "",
        price_per_litre: "",
      },
    ]);
  }

  function removeItem(indexToRemove) {
    setItemsData((prevItemsData) =>
      prevItemsData.filter((_, index) => index !== indexToRemove)
    );
  }

  // Function to calculate the total bill amount
  const calculateTotal = () => {
    return itemsData.reduce((total, item) => {
      const litres = parseFloat(item.litres) || 0;
      const price = parseFloat(item.price_per_litre) || 0;
      return total + litres * price;
    }, 0);
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Replace alert with custom UI message later
    console.log("Submitting Invoice:", finalFormData);
    alert("Invoice submitted successfully! Check console for data.");

    // fetch("back-end/invoices", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
  }

  return (
    // Outer container to center the "sheet" and provide a background
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {/* INVOICE SHEET CONTAINER: Simulates a single, large sheet of paper */}
      <div className="w-full mx-auto my-8 p-10">
        {/* INVOICE HEADER BLOCK (For a professional look) */}
        <div className="flex justify-between items-center border-b-4 border-indigo-600 pb-4 mb-8">
          <h1
            style={{ fontFamily: "IT Bold" }}
            className="text-4xl text-gray-900"
          >
            FUEL INVOICE
          </h1>
          <div className="text-right">
            <p
              style={{ fontFamily: "IT Bold" }}
              className="text-lg text-gray-700"
            >
              Invoice No: #0000{Math.floor(Math.random() * 100)}
            </p>
            <p
              style={{ fontFamily: "IT Regular" }}
              className="text-sm text-gray-500"
            >
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: INVOICE HEADER DETAILS (Vendor Info) */}
          <div>
            <h2
              style={{ fontFamily: "IT Medium" }}
              className="text-xl text-gray-800 mb-4 border-l-4 border-indigo-400 pl-3"
            >
              Vendor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-indigo-50/50">
              <FormGroup label="Vendor/Station Name" htmlFor="vendor_name">
                <input
                  type="text"
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  name="vendor_name"
                  placeholder="e.g., Shell, ADNOC"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                />
              </FormGroup>

              <FormGroup label="Vendor Email" htmlFor="vendor_email">
                <input
                  type="email"
                  id="vendor_email"
                  value={formData.vendor_email}
                  onChange={handleChange}
                  name="vendor_email"
                  placeholder="e.g., mail@vendor.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                />
              </FormGroup>

              <FormGroup label="Invoice Date" htmlFor="date">
                <input
                  type="date"
                  value={formData.date}
                  id="date"
                  onChange={handleChange}
                  name="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                />
              </FormGroup>
            </div>
          </div>

          {/* SECTION 2: BILL ITEMS (Dynamic) */}
          <div>
            <h2
              style={{ fontFamily: "IT Bold" }}
              className="text-xl text-gray-800 mb-4 border-l-4 border-indigo-400 pl-3"
            >
              Bill Items
            </h2>

            <div className="space-y-4">
              {itemsData.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg border-2 border-gray-100 bg-white relative shadow-sm hover:shadow-md transition duration-150"
                >
                  <h3
                    style={{ fontFamily: "IT Medium" }}
                    className="text-sm text-indigo-600 mb-3"
                  >
                    Line Item #{index + 1}
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    {/* Pump Selection */}
                    <FormGroup label="Pump" htmlFor={`pump_id-${index}`}>
                      <select
                        id={`pump_id-${index}`}
                        value={item.pump_id}
                        onChange={(e) => handleItemsChange(e, index)}
                        name="pump_id"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                      >
                        <option value="">Select Pump</option>
                        {availablePumps.map((pump) => (
                          <option key={pump.id} value={pump.id}>
                            {pump.name} ({pump.id})
                          </option>
                        ))}
                      </select>
                    </FormGroup>

                    {/* Litres */}
                    <FormGroup label="Litres" htmlFor={`litres-${index}`}>
                      <input
                        type="number"
                        id={`litres-${index}`}
                        placeholder="0.00"
                        value={item.litres}
                        onChange={(e) => handleItemsChange(e, index)}
                        name="litres"
                        step="0.01"
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                      />
                    </FormGroup>

                    {/* Price Per Litre */}
                    <FormGroup
                      label="Price/Litre (AED)"
                      htmlFor={`price-${index}`}
                    >
                      <input
                        type="number"
                        id={`price-${index}`}
                        value={item.price_per_litre}
                        placeholder="0.00"
                        onChange={(e) => handleItemsChange(e, index)}
                        name="price_per_litre"
                        step="0.01"
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
                      />
                    </FormGroup>

                    {/* Remove Button */}
                    {itemsData.length > 1 && (
                      <div className="flex items-center h-full pt-6 md:pt-0">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full py-2 px-4 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              style={{ fontFamily: "IT Bold" }}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              + Add Fuel Item
            </button>
          </div>

          {/* SECTION 3: SUMMARY & SUBMISSION (Bottom Footer) */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-5 lg:items-center p-6 mt-8 border-t-4 border-gray-300">
            <h3
              style={{ fontFamily: "IT Bold" }}
              className="text-2xl text-gray-800"
            >
              GRAND TOTAL:{" "}
              <span
                style={{ fontFamily: "IT Medium" }}
                className="text-green-600 text-2xl"
              >
                {new Intl.NumberFormat("en-AE", {
                  style: "currency",
                  currency: "AED",
                }).format(calculateTotal())}
              </span>
            </h3>
            <button
              type="submit"
              style={{ fontFamily: "IT Medium" }}
              className="px-10 py-4 bg-green-600 text-white text-lg rounded-xl shadow-xl hover:bg-green-700 transition duration-150 transform hover:scale-105"
            >
              Submit Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable component for form group structure
const FormGroup = ({ label, htmlFor, children }) => (
  <div className="flex flex-col">
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-gray-700 mb-1"
    >
      {label}
    </label>
    {children}
  </div>
);

export default BuyFuel;

/* GLOBAL INPUT STYLE DEFINITION */
// This class is used for all main inputs to provide a consistent, clean, and interactive look
// We use a separate class name (input-field-clean) to ensure the style is applied correctly in this single file component.
const inputFieldStyle =
  "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150";

// Note: Tailwind utility classes are defined here for the single file component setup.
// Applying styles to the 'input-field-clean' class manually in the JSX for demonstration.

// Example of how the style is applied:
// className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-indigo-300 transition duration-150"
