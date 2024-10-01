'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GrLanguage } from 'react-icons/gr';

export const Footer = () => {
  const pathname = usePathname();

  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/lupa-password' ||
    pathname === '/reset-password' ||
    pathname === '/ubah-password' ||
    pathname === '/register/thanks' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/verification') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return (
    <main className="bg-[#284693] w-full rounded-t-3xl overflow-hidden">
      <div className="py-20 grid md:grid-cols-4 gap-7 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl text-white font-semibold">About</h1>
          <p className="text-white mt-5 hover:underline cursor-pointer">
            About us
          </p>
          <p className="text-white hover:underline cursor-pointer">Careers</p>
          <p className="text-white hover:underline cursor-pointer">Investors</p>
          <p className="text-white hover:underline cursor-pointer">Blog</p>
        </div>
        <div>
          <h1 className="text-2xl text-white font-semibold">Support</h1>
          <p className="text-white mt-5 hover:underline cursor-pointer">
            Help Center
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Get help with a safety issue
          </p>
          <p className="text-white hover:underline cursor-pointer">
            EaseCoz Cover
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Anti-discrimination
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Disability support
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Cancellation options
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Report neighborhood concern
          </p>
        </div>
        <div>
          <h1 className="text-2xl text-white font-semibold">Tenant</h1>
          <Link href="/dashboard/register">
            <p className="text-white mt-5 hover:underline cursor-pointer">
              Be a Tenant
            </p>
          </Link>
          <p className="text-white hover:underline cursor-pointer">
            EaseCoz Cover for Tenants
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Tenant resources
          </p>
          <p className="text-white hover:underline cursor-pointer">
            Community forum
          </p>
        </div>
        <div>
          <h1 className="text-2xl text-white font-semibold">EaseCoz</h1>
          <p className="text-white mt-5 hover:underline cursor-pointer">
            Newsroom
          </p>
          <p className="text-white hover:underline cursor-pointer">
            New features
          </p>
          <p className="text-white hover:underline cursor-pointer">Careers</p>
          <p className="text-white hover:underline cursor-pointer">Investors</p>
        </div>
      </div>
    </main>
  );
};
