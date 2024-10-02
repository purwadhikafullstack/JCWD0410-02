"use client";
import React, { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; 
import Link from "next/link"; 

const Navbar: React.FC = () => {
  const { data: session } = useSession(); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getBrandText = () => {
    const path = window.location.pathname;
    if (path.includes("property")) return "Property";
    if (path.includes("tenant-transaction")) return "Tenant Management";
    if (path.includes("sales-report")) return "Sales Report";
    if (path.includes("property-report")) return "Property Report";
    return "Main Dashboard";
  };

  const brandText = getBrandText();

  return (
    <nav className="flex justify-between items-center p-4 bg-[rgb(254,255,255)] dark:bg-navy-800 shadow-md rounded-xl mx-4 mt-4">
      <div>
        <p className="text-sm font-normal text-navy-700 dark:text-white">
          Pages / <span className="font-bold">{brandText}</span>
        </p>
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
          {brandText}
        </h1>
      </div>

      {session?.user && (
        <div className="relative flex items-center space-x-4 dropdown-container">
          <div
            onClick={toggleDropdown} 
            className="cursor-pointer flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage src={session.user.imageUrl || ""} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-base">{session.user.name}</p>
          </div>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 transform translate-y-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg py-2 z-10"
            >
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiUser className="mr-2" /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })} // Logout function
                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
