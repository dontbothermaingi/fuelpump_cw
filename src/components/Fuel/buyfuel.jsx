import { useState } from "react";

function BuyFuel() {
  const [formData, setFormData] = useState({
    user_id: "",
    vendor_name: "",
    vendor_email: "",
    date: "",
    bill_items: "",
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
    // ... more pumps
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

    // 1. Create a copy of the itemsData array
    setItemsData((prevItemsData) => {
      const updatedItems = [...prevItemsData];

      if (name === "pump_id") {
        const selectedPump = availablePumps.find((p) => p.id == value);

        //update both pump_id and pump_name
        const updatedItem = {
          ...updatedItems[index],
          pump_id: value, // The ID from the dropdown value
          pump_name: selectedPump ? selectedPump.name : "", // The Name
        };
        updatedItems[index] = updatedItem;
      } else {
        // 2. Create a copy of the specific item object
        // 3. Update the specific key (name) with the new value
        const updatedItem = {
          ...updatedItems[index],
          [name]: value,
        };

        // 4. Replace the old item object with the new one in the copied array
        updatedItems[index] = updatedItem;
      }

      // 5. Return the new array to update the state
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

    const finalFormData = {
      ...formData,
      bill_items: itemsData,
    };

    fetch("back-end/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalFormData),
    });
  }

  return (
    <div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border border-black px-5 py-5 rounded-2xl bg-gray-200"
        >
          <p
            style={{ fontFamily: "IT Medium" }}
            className="text-3xl py-2 text-center"
          >
            New Bill
          </p>
          <label htmlFor="vendor_name" style={{ fontFamily: "IT Medium" }}>
            Vendor/Station Name
          </label>
          <input
            type="text"
            id="vendor_name" // Links to the label
            value={formData.vendor_name}
            onChange={handleChange}
            name="vendor_name"
            placeholder="e.g., Shell, ADNOC, Petro station XYZ"
            className="mb-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="vendor_email" style={{ fontFamily: "IT Medium" }}>
            Vendor Email
          </label>
          <input
            type="text"
            id="vendor_email"
            value={formData.vendor_email}
            onChange={handleChange}
            name="vendor_email"
            placeholder="e.g., shellemirates12@gmail.com"
            className="mb-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="date" style={{ fontFamily: "IT Medium" }}>
            Invoice Date
          </label>
          <input
            type="date"
            value={formData.date}
            id="date"
            onChange={handleChange}
            name="date"
            className="mb-5 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="border-t border-blue-300 pt-6">
            <p style={{ fontFamily: "IT Medium" }} className="text-xl py-2">
              Bill Items
            </p>
            {itemsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap gap-5 mb-4 bg-blue-50 p-4 rounded-xl shadow-sm"
              >
                <div className="flex flex-col w-40">
                  <label
                    className="font-semibold text-blue-700"
                    style={{ fontFamily: "IT Medium" }}
                  >
                    Pump
                  </label>
                  <select
                    value={item.pump_id}
                    onChange={(e) => handleItemsChange(e, index)}
                    name="pump_id"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Pump --</option>
                    {availablePumps.map((pump) => (
                      <option key={pump.id} value={pump.id}>
                        {pump.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col w-32">
                  <label
                    className="font-semibold text-blue-700"
                    style={{ fontFamily: "IT Medium" }}
                  >
                    Litres
                  </label>
                  <input
                    type="number"
                    placeholder="Litres"
                    value={item.litres}
                    onChange={(e) => handleItemsChange(e, index)}
                    name="litres"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col w-32">
                  <label
                    className="font-semibold text-blue-700 "
                    style={{ fontFamily: "IT Medium" }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    value={item.price_per_litre}
                    placeholder="Price"
                    onChange={(e) => handleItemsChange(e, index)}
                    name="price_per_litre"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {itemsData.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 font-semibold hover:text-red-800"
                    style={{ fontFamily: "IT Medium" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              style={{ fontFamily: "IT Medium" }}
            >
              + Add Fuel Item
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between gap-5 lg:items-center mt-6 p-4 border-t-2">
            <h3 className="text-lg" style={{ fontFamily: "IT Medium" }}>
              Total Invoice Amount:{" "}
              {new Intl.NumberFormat("en-AE", {
                style: "currency",
                currency: "AED",
              }).format(calculateTotal().toFixed(2))}
            </h3>
            <button
              type="submit"
              className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
            >
              {" "}
              Submit Fuel Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyFuel;
