import { useState } from "react";

function FuelVehicles() {
  const [formData, setFormData] = useState({
    pump_name: "",
    user_id: "",
    pump_id: "",
    litres: "",
    vehcile_number: "",
    date: "",
  });

  const availablePumps = [
    { id: "PMP001", name: "Pump Alpha" },
    { id: "PMP002", name: "Pump Beta" },
    // Add a couple more for better testing
    { id: "PMP003", name: "Pump Gamma" },
    { id: "PMP004", name: "Pump Delta" },
  ];

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "pump_id") {
      const selectedPump = availablePumps.find((p) => p.id === value);

      // Update both pump_id (the value from the select) and pump_name
      setFormData((prevFormdata) => ({
        ...prevFormdata,
        pump_id: value, // Use 'value' here
        pump_name: selectedPump ? selectedPump.name : "",
      }));
    } else {
      setFormData((prevFormdata) => ({
        ...prevFormdata,
        [name]: value,
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic Validation Check (UX Improvement)
    if (!formData.pump_id || !formData.litres || !formData.vehcile_number) {
      alert(
        "Please fill in all required fields (Pump, Litres, Vehicle Number)."
      );
      return; // Stop submission if validation fails
    }

    fetch("back-end/fueltransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Fuel transaction submitted successfully!"); // Success feedback
          // Reset form for next entry
          setFormData({
            pump_name: "",
            user_id: "",
            pump_id: "",
            litres: "",
            vehcile_number: "",
            date: "",
          });
        } else {
          alert("Submission failed. Please check the network."); // Error feedback
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert("An error occurred during submission.");
      });
  }

  return (
    <div className="flex justify-center lg:pt-10 bg-gray-50 ">
      <div className="w-full  bg-white   rounded-xl">
        <h2
          style={{ fontFamily: "IT Medium" }}
          className="text-3xl text-gray-800 mb-6 border-b pb-2"
        >
          New Fuel Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Pump and Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pump_id"
                className="block text-sm  text-gray-700 mb-1"
                style={{ fontFamily: "IT Regular" }}
              >
                Pump Station
              </label>
              <select
                id="pump_id"
                value={formData.pump_id}
                onChange={handleChange}
                name="pump_id"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: "IT Regular" }}
              >
                <option value="" disabled>
                  Select Pump
                </option>
                {availablePumps.map((pump) => (
                  <option key={pump.id} value={pump.id}>
                    {pump.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Number */}
            <div>
              <label
                htmlFor="vehcile_number"
                className="block text-sm text-gray-700 mb-1"
                style={{ fontFamily: "IT Regular" }}
              >
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehcile_number"
                value={formData.vehcile_number}
                onChange={handleChange}
                name="vehcile_number"
                placeholder="e.g., ABC 1234"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Group 2: Litres and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Litres Input */}
            <div>
              <label
                htmlFor="litres"
                className="block text-sm text-gray-700 mb-1"
                style={{ fontFamily: "IT Regular" }}
              >
                Litres Fueled
              </label>
              <input
                type="number"
                id="litres"
                value={formData.litres}
                onChange={handleChange}
                name="litres"
                placeholder="e.g., 50.00"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm  text-gray-700 mb-1"
                style={{ fontFamily: "IT Regular" }}
              >
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                id="date"
                onChange={handleChange}
                name="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-5 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Submit Fuel Transaction
          </button>

          {/* Display selected pump name (Optional UX feedback) */}
          {formData.pump_name && (
            <p
              style={{ fontFamily: "IT Medium" }}
              className="text-sm text-gray-500 mt-4 text-center"
            >
              You are recording fuel for {formData.pump_name}.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default FuelVehicles;
