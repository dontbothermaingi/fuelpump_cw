import { useState } from "react";
import { nanoid } from "nanoid";

function CreatePumps() {
  const [formData, setFormData] = useState({
    pump_name: "",
    pump_reading: "",
    type_of_fuel: "",
    litres_capacity: "",
    price_per_litre: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic Validation Check
    if (
      !formData.pump_name ||
      !formData.pump_reading ||
      !formData.type_of_fuel ||
      !formData.litres_capacity
    ) {
      alert(
        "Please fill in all required fields (Name, Reading, Fuel Type, Capacity)."
      );
      return;
    }

    console.log("Submitting form data:", formData);

    const finalFormData = {
      id: nanoid(5),
      ...formData,
    };

    fetch("http://localhost:5000/pumps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalFormData),
    })
      .then((response) => {
        if (response.ok) {
          alert(`New pump '${formData.pump_name}' created successfully!`);
          // Reset form after successful submission
          setFormData({
            pump_name: "",
            pump_reading: "",
            type_of_fuel: "",
            litres_capacity: "",
            price_per_litre: "",
          });
        } else {
          return response.json().then((err) => {
            throw new Error(err.message || "Submission failed.");
          });
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert(error.message || "An error occurred during submission.");
      });
  }

  return (
    <div className="flex justify-center">
      <div className="w-full p-5 bg-white">
        {" "}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          CREATE NEW PUMP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Pump Name and Pump Reading */}
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
                placeholder="e.g., Pump 5 Diesel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Pump Reading */}
            <div>
              <label
                htmlFor="pump_reading"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Initial Pump Reading
              </label>
              <input
                type="number"
                id="pump_reading"
                value={formData.pump_reading}
                onChange={handleChange}
                name="pump_reading"
                placeholder="e.g., 0 or 234678"
                step="any"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Group 2: Litres Capacity and Fuel Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Litres Capacity Input */}
            <div>
              <label
                htmlFor="litres"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Capacity (Litres)
              </label>
              <input
                type="number"
                id="litres"
                value={formData.litres_capacity}
                onChange={handleChange}
                name="litres_capacity"
                placeholder="e.g., 1200"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Price Per Litre */}
            <div>
              <label
                htmlFor="price_per_litre"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Price Per Litre
              </label>
              <input
                type="number"
                id="price_per_litre"
                value={formData.price_per_litre}
                onChange={handleChange}
                name="price_per_litre"
                placeholder="e.g., 2.58"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                name="type_of_fuel"
                placeholder="e.g., Diesel, Petrol"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-5 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Create Pump
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePumps;
