'use client';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/lupa-password' ||
    pathname === '/reset-password' ||
    pathname === '/ubah-password' ||
    pathname === '/register/thanks' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/verification') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return (
    <div>
      <p onClick={() => signOut()} className="cursor-pointer">
        sign out
      </p>
    </div>
  );
};
