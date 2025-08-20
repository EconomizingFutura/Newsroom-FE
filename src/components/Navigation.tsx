import { Bell } from "lucide-react";
import cijlogo from "../assets/cijlogo.png";

const Navigation = () => {
  return (
    <header className="w-full bg-[#ffffff] z-50 fixed border-b border-border shadow-[0px_4px_24px_0px_#959DA533]">
      <div className=" mx-auto flex justify-between items-center py-2 px-6">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={cijlogo} // place your logo in public folder
            alt="Chennai Institute of Journalism"
            className="h-12"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-green-600 text-white text-[10px] font-bold">
              2
            </span>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">User</p>
              <p className="text-xs text-gray-500">Reporter</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
