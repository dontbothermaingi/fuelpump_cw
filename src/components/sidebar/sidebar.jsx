import { useState } from "react";
import { useNavigate } from "react-router";

function SideBar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", rt: "/" },
    { name: "Buy Fuel", rt: "/buy-fuel" },
    { name: "Pumps", rt: "/pumps" },
    { name: "Fuel Vehicles", rt: "/fuel-vehicle" },
    { name: "View Report", rt: "/report" },
  ];

  function barItem(item, onClick) {
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
        <div className="flex flex-col mt-6 px-3">
          {menuItems.map((item, i) => (
            <div onClick={() => navigate(item.rt)}>{barItem(item.name)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
