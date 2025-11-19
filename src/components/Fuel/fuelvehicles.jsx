import { use, useEffect, useState } from "react";

function FuelVehicles() {
  const [pumps, setPumps] = useState([]);
  const [formData, setFormData] = useState({
    pump_id: "",
    user_id: "",
    vehicle_number: "",
    litres: "",
    price_per_liter: "",
  });

  // Retrieve user info from localStorage
  const userString = localStorage.getItem("user"); // string from localStorage
  const user = userString ? JSON.parse(userString) : null; // convert to object
  const user_id = user?.id; // optional chaining in case user is null

  useEffect(() => {
    // Fetch pumps data from the backend API
    fetch("http://localhost:5000/pumps")
      .then((response) => response.json())
      .then((data) => setPumps(data))
      .catch((error) => console.error("Error fetching pumps:", error));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "pump_id") {
      const selectedPump = pumps.find((p) => p.id == value);

      if (selectedPump.litres_capacity <= 0) {
        alert("Selected pump is out of fuel. Please choose another pump.");
        return;
      }

      // Update both pump_id (the value from the select) and pump_name
      setFormData((prevFormdata) => ({
        ...prevFormdata,
        pump_id: value, // Use 'value' here
        price_per_liter: selectedPump ? selectedPump.price_per_litre : 1,
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
    if (!formData.pump_id || !formData.litres || !formData.vehicle_number) {
      alert(
        "Please fill in all required fields (Pump, Litres, Vehicle Number)."
      );
      return; // Stop submission if validation fails
    }

    const finalFormData = {
      ...formData,
      user_id: user_id, // Attach user_id from localStorage
    };

    console.log("Submitting form data:", finalFormData);

    fetch("http://localhost:5000/fuel_transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalFormData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Fuel transaction submitted successfully!"); // Success feedback
          // Reset form for next entry
          setFormData({
            pump_id: "",
            user_id: "",
            vehicle_number: "",
            litres: "",
            price_per_liter: "",
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
                Pump Name
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
                {pumps.map((pump) => (
                  <option key={pump.id} value={pump.id}>
                    {pump.pump_name}
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
                id="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                name="vehicle_number"
                placeholder="e.g., ABC 1234"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Group 2: Litres and Date */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ fontFamily: "IT Medium" }}
            className="w-full mt-6 px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Submit Fuel Transaction
          </button>

          {/* Display selected pump name (Optional UX feedback) */}
          {formData.pump_name && (
            <p
              style={{ fontFamily: "IT Light" }}
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
