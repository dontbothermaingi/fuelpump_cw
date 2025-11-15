import { useEffect, useState } from "react";

function EditPumps() {
  // Use a constant to hold the specific pump object we are editing
  // We MUST access the first item in the array for the data.
  const PUMP_TO_EDIT = {
    id: "PMP001",
    name: "Pump Alpha",
    pump_reading: 234678,
    type_of_fuel: "Diesel",
    litres: 1200,
    pump_transactions: [
      {
        pump_name: "Pump Alpha",
        user_id: "2",
        pump_id: "PMP001",
        litres: "200",
        vehcile_number: "1234T",
        date: "11/02/2024",
      },
    ],
  };

  const [formData, setFormData] = useState({
    pump_name: "",
    pump_reading: "",
    type_of_fuel: "",
    litres: "",
    id: "", // Added ID to state for the PATCH request
  });

  // ⭐️ FIX: Use PUMP_TO_EDIT properties to initialize the state
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      id: PUMP_TO_EDIT.id, // Set the ID
      pump_name: PUMP_TO_EDIT.name, // Use 'name' from the object
      pump_reading: PUMP_TO_EDIT.pump_reading,
      type_of_fuel: PUMP_TO_EDIT.type_of_fuel,
      litres: PUMP_TO_EDIT.litres,
    }));
    // Empty dependency array: runs once after initial render
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // ⭐️ FIX: Adjusted validation to check the fields that actually exist in the form
    if (
      !formData.pump_name ||
      !formData.pump_reading ||
      !formData.litres ||
      !formData.type_of_fuel
    ) {
      alert(
        "Please fill in all required fields (Name, Reading, Litres, Fuel Type)."
      );
      return;
    }

    const finalFormData = {
      ...formData,
      // Date isn't part of the form, but if you want to log the update time:
      updated_at: new Date().toISOString(),
    };

    // ⭐️ FIX: Use formData.id (which was set in useEffect) for the URL
    fetch(`back-end/pumpedit/${formData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalFormData),
    })
      .then((response) => {
        if (response.ok) {
          alert(`Pump ${formData.pump_name} updated successfully!`); // Success feedback
        } else {
          alert(
            "Submission failed. Please check the network or server response."
          );
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert("An error occurred during submission.");
      });
  }

  return (
    <div className="flex justify-center">
      <div className="w-full p-4">
        {" "}
        {/* Added max-w-lg and padding for better UI */}
        <h2 className="text-3xl text-gray-800 mb-6 border-b pb-2">EDIT PUMP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Pump and Pump Reading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pump_name"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Pump Name
              </label>
              <input
                type="text"
                id="pump_name"
                value={formData.pump_name}
                onChange={handleChange}
                name="pump_name"
                placeholder="e.g., Pump A"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pump Reading */}
            <div>
              <label
                htmlFor="pump_reading"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Pump Reading
              </label>
              <input
                type="number" // Changed to number for reading
                id="pump_reading"
                value={formData.pump_reading}
                onChange={handleChange}
                name="pump_reading" // Correct name
                placeholder="e.g., 234678"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Group 2: Litres and Fuel Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Litres Input */}
            <div>
              <label
                htmlFor="litres"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Total Litres Capacity
              </label>
              <input
                type="number"
                id="litres"
                value={formData.litres}
                onChange={handleChange}
                name="litres"
                placeholder="e.g., 1200"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fuel Type Input */}
            <div>
              <label
                htmlFor="type_of_fuel"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Fuel Type
              </label>
              <input
                type="text"
                value={formData.type_of_fuel}
                id="type_of_fuel"
                onChange={handleChange}
                name="type_of_fuel" // ⭐️ FIX: Corrected name attribute to 'type_of_fuel'
                placeholder="e.g., Diesel or Petrol"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-5 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Update Pump Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPumps;
