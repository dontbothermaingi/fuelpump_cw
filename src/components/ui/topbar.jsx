import { Menu } from "lucide-react"; // or react-icons if you prefer
import { useState } from "react";
import SideBar from "../sidebar/sidebar";

function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div className="border-b border-black flex items-center justify-between lg:justify-center py-4 px-4 bg-white">
        {/* Hamburger button (only on mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <p
          style={{ fontFamily: "IT Bold" }}
          className="text-xl sm:text-2xl font-semibold text-center"
        >
          FUEL MANAGEMENT SYSTEM
        </p>
      </div>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)} // close drawer when clicking overlay
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar />
      </div>
    </>
  );
}

export default Topbar;
