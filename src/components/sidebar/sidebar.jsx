import { useState } from "react";
import { useNavigate } from "react-router";

function SideBar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  // Retrieve user info from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user?.role; // "admin" or "staff"

  // Full menu (Admin)
  const menuItems = [
    { name: "Dashboard", rt: "/" },
    { name: "Buy Fuel", rt: "/buy-fuel" },
    { name: "Pumps", rt: "/pumps" },
    { name: "Fuel Vehicles", rt: "/fuel-vehicle" },
    { name: "View Report", rt: "/report" },
  ];

  // Filter menu based on role
  const filteredMenu =
    role == "Staff"
      ? menuItems.filter((item) =>
          ["Dashboard", "Fuel Vehicles", "Pumps"].includes(item.name)
        )
      : menuItems; // Admin sees everything

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  function barItem(item) {
    const isActive = item === activeItem;

    return (
      <div
        key={item}
        onClick={() => setActiveItem(item)}
        className={`flex items-center px-4 py-2 rounded-lg mb-2 cursor-pointer transition-all duration-300 
          ${
            isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-black"
          }`}
      >
        <p style={{ fontFamily: "IT Regular" }} className="ml-2">
          {item}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-64 p-3 flex flex-col">
      <div className="bg-gray-300 rounded-2xl h-full w-full flex flex-col px-2">
        {/* Header */}
        <div className="border-b border-black py-4">
          <p
            className="text-2xl text-center text-gray-800"
            style={{ fontFamily: "IT Medium" }}
          >
            MENU
          </p>
        </div>

        {/* Menu */}
        <div className="h-full flex flex-col justify-between mt-4">
          <div className="flex flex-col mt-6 px-3">
            {filteredMenu.map((item) => (
              <div key={item.name} onClick={() => navigate(item.rt)}>
                {barItem(item.name)}
              </div>
            ))}
          </div>

          {/* Login / Logout Buttons */}
          <div className="px-3 mb-4">
            {user ? (
              <div
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              >
                <p style={{ fontFamily: "IT Regular" }} className="ml-2">
                  Logout
                </p>
              </div>
            ) : (
              <div
                onClick={() => navigate("/login")}
                className="flex items-center px-4 py-2 rounded-lg cursor-pointer bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
              >
                <p style={{ fontFamily: "IT Regular" }} className="ml-2">
                  Login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
