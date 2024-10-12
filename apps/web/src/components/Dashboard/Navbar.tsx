'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [brandText, setBrandText] = useState('Main Dashboard');
  const pathname = usePathname();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    if (pathname.includes('property-category'))
      setBrandText('Property Category');
    else if (pathname.includes('property-management'))
      setBrandText('Property Management');
    else if (pathname.includes('property-room-management'))
      setBrandText('Property Room');
    else if (pathname.includes('tenant-transaction'))
      setBrandText('Tenant Management');
    else if (pathname.includes('sales-report')) setBrandText('Sales Report');
    else if (pathname.includes('property-report'))
      setBrandText('Property Report');
    else setBrandText('Main Dashboard');
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md mx-4 mt-4 rounded-lg">
      <div>
        <p className="text-sm font-normal">
          Pages / <span className="font-bold">{brandText}</span>
        </p>
        <h1 className="text-2xl font-bold">{brandText}</h1>
      </div>

      {session?.user && (
        <div className="relative flex items-center">
          <div
            onClick={toggleDropdown}
            className="cursor-pointer flex items-center"
          >
            <Avatar>
              <AvatarImage
                src={session.user.imageUrl || ''}
                alt={session.user.name || 'User'}
              />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <p className="ml-2 font-semibold">{session.user.name}</p>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FiUser className="mr-2" /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
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
