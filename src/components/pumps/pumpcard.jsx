function PumpCard({ pump, onViewDetails }) {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-l-4 border-indigo-500"
      onClick={() => onViewDetails(pump.id)} // Clickable to view details
    >
      <h3
        style={{ fontFamily: "IT Bold" }}
        className="text-xl  text-gray-900 mb-2"
      >
        {pump.name}
      </h3>
      <p
        style={{ fontFamily: "IT Light" }}
        className="text-sm text-gray-500 mb-4"
      >
        {pump.id}
      </p>

      <div className="space-y-2 text-sm">
        <p style={{ fontFamily: "IT Medium" }} className="text-lg">
          Fuel Type:{" "}
          <span
            className={` ${
              pump.type_of_fuel === "Diesel"
                ? "text-blue-600"
                : "text-orange-600"
            }`}
          >
            {pump.type_of_fuel}
          </span>
        </p>
        <p style={{ fontFamily: "IT Medium" }} className="text-lg">
          Current Reading:{" "}
          {new Intl.NumberFormat().format(pump.current_reading)}
        </p>
        <p style={{ fontFamily: "IT Medium" }} className="text-lg">
          Capacity: {new Intl.NumberFormat().format(pump.litres_capacity)}{" "}
          Litres
        </p>
        <p style={{ fontFamily: "IT Medium" }} className="text-lg">
          Price Per Liter:{" "}
          {new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: "AED",
          }).format(pump.price_per_liter)}
        </p>
      </div>

      <button
        className="mt-4 bg-indigo-600 hover:bg-indigo-800 font-medium px-2 py-1 rounded-xl text-white"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the card's onClick from firing
          onViewDetails(pump.id);
        }}
      >
        View Details &rarr;
      </button>
    </div>
  );
}

export default PumpCard;
