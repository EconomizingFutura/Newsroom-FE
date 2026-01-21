import { Bell, LogOutIcon } from "lucide-react";

import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getInitials, USER_ROLE } from "@/utils/utils";
import type { UserRole } from "./SideBar";

const Navigation = () => {
  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem("username");
  const displayRole = capitalizeFirstLetter(localStorage.getItem("role") ?? "");
  const naviagate = useNavigate();
  const currentRole: UserRole = (USER_ROLE() as UserRole) || "REPORTER";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    naviagate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#ffffff] h-16 flex z-50 fixed border-b border-border shadow-[0px_4px_24px_0px_#959DA533]">
      <div className=" mx-auto w-full flex justify-between items-center py-2 px-6">
        {/* Left Logo */}
        <div className="flex items-center font-space-Grotesk space-x-2">
          <h1 className="text-[#008001] font-bold font-space-Grotesk text-2xl">
            {currentRole == "EDITOR" ? "INRP Editor" : "INRP Reporter"}
          </h1>
          {/* <img
            src={currentRole == "EDITOR" ? INRPEditor : INRPReporter}
            alt="Chennai Institute of Journalism"
            className="h-6"
          /> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          {false && (
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-green-600 text-white text-[10px] font-bold">
                2
              </span>
            </div>
          )}

          {/* User Section */}
          <div
            onClick={() => setShowDropdown((p) => !p)}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold">
              {getInitials(username || "")}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">{username}</p>
              <p className="text-xs text-gray-500">{displayRole}</p>
            </div>
          </div>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-5 p-1 max-h-min h-full w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOutIcon className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
