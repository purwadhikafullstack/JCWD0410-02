"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiHome, FiShoppingCart, FiUser, FiLock, FiChevronDown } from 'react-icons/fi';


const Sidebar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-64 bg-white dark:bg-navy-800 text-navy-700 dark:text-white flex flex-col p-6 shadow-lg">
      {/* Brand */}
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Ease<span className="text-black">Coz</span></h1>
      
      <ul className="space-y-6">
        <li
          className="flex items-center space-x-4 text-lg font-medium cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <FiHome />
          <span>MainDashboard</span>
        </li>

        <li
          className="flex items-center space-x-4 text-lg font-medium cursor-pointer"
          onClick={() => router.push("/dashboard/property")}
        >
          <FiLock />
          <span>Property</span>
        </li>

        <li
          className="flex items-center space-x-4 text-lg font-medium cursor-pointer"
          onClick={() => router.push("/dashboard/tenant-transaction")}
        >
          <FiShoppingCart />
          <span>TenantManagement</span>
        </li>
        
        {/* Dropdown for Report&Analysis */}
        <li className="flex flex-col space-y-2">
          <div
            className="flex items-center space-x-4 text-lg font-medium cursor-pointer"
            onClick={toggleDropdown}
          >
            <FiUser />
            <span>Report&Analysis</span>
            <FiChevronDown className={`transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} />
          </div>
          
          {/* Dropdown menu */}
          {dropdownOpen && (
            <ul className="ml-8 space-y-2">
              <li
                className="text-base font-normal cursor-pointer"
                onClick={() => router.push("/dashboard/sales-report")}
              >
                <span>SalesReport</span>
              </li>
              <li
                className="text-base font-normal cursor-pointer"
                onClick={() => router.push("/dashboard/property-report")}
              >
                <span>PropertyReport</span>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
