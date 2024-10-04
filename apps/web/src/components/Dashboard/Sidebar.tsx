"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiHome, FiShoppingCart, FiUser, FiLock, FiChevronDown } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = (type: "property" | "report") => {
    type === "property"
      ? setPropertyDropdownOpen(!propertyDropdownOpen)
      : setReportDropdownOpen(!reportDropdownOpen);
  };

  return (
    <div className="w-64 bg-white flex flex-col p-6 shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-blue-500">
        Ease<span className="text-black">Coz</span>
      </h1>

      <ul className="space-y-6">
        <li
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <FiHome />
          <span>Main Dashboard</span>
        </li>

        <li className="flex flex-col">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleDropdown("property")}
          >
            <FiLock />
            <span className="ml-2">Property</span>
            <FiChevronDown
              className={`ml-auto ${propertyDropdownOpen ? "rotate-180" : ""} transition-transform`}
            />
          </div>
          {propertyDropdownOpen && (
            <ul className="ml-8 mt-2">
              <li
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/property-category")}
              >
                Category
              </li>
              <li
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/property-management")}
              >
                Management
              </li>
              <li
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/property-room-management")}
              >
                Room
              </li>
            </ul>
          )}
        </li>

        <li
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/dashboard/tenant-transaction")}
        >
          <FiShoppingCart />
          <span className="ml-2">Tenant Management</span>
        </li>

        <li className="flex flex-col">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleDropdown("report")}
          >
            <FiUser />
            <span className="ml-2">Report & Analysis</span>
            <FiChevronDown
              className={`ml-auto ${reportDropdownOpen ? "rotate-180" : ""} transition-transform`}
            />
          </div>
          {reportDropdownOpen && (
            <ul className="ml-8 mt-2">
              <li
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/sales-report")}
              >
                Sales Report
              </li>
              <li
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/property-report")}
              >
                Property Report
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
