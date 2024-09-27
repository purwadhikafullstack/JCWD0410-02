"use client";
import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiInfo, FiMoon, FiSun } from 'react-icons/fi';

const Navbar: React.FC<{ brandText: string }> = ({ brandText }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update dark mode class on body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex justify-between items-center p-4 bg-[rgb(254,255,255)] dark:bg-navy-800 shadow-md rounded-xl mx-4 mt-4">
      {/* Brand and Title */}
      <div>
        <p className="text-sm font-normal text-navy-700 dark:text-white">
          Pages / <span className="font-bold">{brandText}</span>
        </p>
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">{brandText}</h1>
      </div>

      {/* Search Bar and Icons */}
      <div className="flex items-center space-x-4 bg-gray-100 dark:bg-navy-900 shadow-md rounded-full px-4 py-2">
        {/* Search Input */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-2 text-gray-500 dark:text-white" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
        {/* Icons */}
        <FiBell className="text-gray-700 dark:text-white cursor-pointer" />
        <FiInfo className="text-gray-700 dark:text-white cursor-pointer" />
        {/* Toggle Dark Mode */}
        <div onClick={toggleDarkMode} className="cursor-pointer">
          {darkMode ? (
            <FiSun className="text-gray-700 dark:text-white" />
          ) : (
            <FiMoon className="text-gray-700 dark:text-white" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
