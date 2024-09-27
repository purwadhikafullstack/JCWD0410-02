import React from 'react';
import { FiHome, FiShoppingCart, FiUser, FiLock } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white dark:bg-navy-800 text-navy-700 dark:text-white flex flex-col p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8">HORIZON</h1>
      <ul className="space-y-6">
        <li className="flex items-center space-x-4 text-lg font-medium">
          <FiHome />
          <span>Main Dashboard</span>
        </li>
        <li className="flex items-center space-x-4 text-lg font-medium">
          <FiShoppingCart />
          <span>NFT Marketplace</span>
        </li>
        <li className="flex items-center space-x-4 text-lg font-medium">
          <FiUser />
          <span>Data Tables</span>
        </li>
        <li className="flex items-center space-x-4 text-lg font-medium">
          <FiLock />
          <span>Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
