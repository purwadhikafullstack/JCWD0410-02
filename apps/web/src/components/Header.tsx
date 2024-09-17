'use client';
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
    pathname.startsWith('/verification') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return <div>Header</div>;
};
