import { useEffect, useState } from "react";

function EditPumps({ pumpId }) {
  const [formData, setFormData] = useState({
    pump_name: "",
    pump_reading: "",
    type_of_fuel: "",
    litres: "",
    price_per_litre: "",
    id: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/pumps/${pumpId}`)
      .then((response) => response.json())
      .then((data) => {
        // Put fetched info into formData state
        console.log("Fetched pump data:", data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: data.id,
          pump_name: data.pump_name,
          pump_reading: data.pump_reading,
          type_of_fuel: data.type_of_fuel,
          litres_capacity: data.litres_capacity,
          price_per_litre: data.price_per_litre,
        }));
      })
      .catch((error) => console.error("Error fetching pump details:", error));
  }, [pumpId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.pump_name ||
      !formData.pump_reading ||
      !formData.litres_capacity ||
      !formData.type_of_fuel
    ) {
      alert(
        "Please fill in all required fields (Name, Reading, Litres, Fuel Type)."
      );
      return;
    }

    fetch(`http://localhost:5000/pumps/${pumpId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
                type="number"
                id="pump_reading"
                value={formData.pump_reading}
                onChange={handleChange}
                name="pump_reading"
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
                value={formData.litres_capacity}
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
                name="type_of_fuel"
                placeholder="e.g., Diesel or Petrol"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                type="text"
                value={formData.price_per_litre}
                id="price_per_litre"
                onChange={handleChange}
                name="price_per_litre"
                placeholder="e.g., 2.58"
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
