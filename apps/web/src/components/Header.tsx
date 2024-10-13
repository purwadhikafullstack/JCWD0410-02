'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export const Header = () => {
  const pathname = usePathname();
  const session = useSession();
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/change-password' ||
    pathname === '/reset-password' ||
    pathname === '/register/thanks' ||
    pathname === '/forgot-password' ||
    pathname === '/change-email' ||
    pathname === '/verify-email' ||
    pathname === '/register-tenant' ||
    pathname.startsWith('/verification') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-7xl flex justify-between items-center z-50 px-6 py-3 bg-white rounded-b-3xl top-0">
      <Link href="/">
        <div className="flex">
          <p className="text-2xl font-bold">Ease</p>
          <p className="text-2xl font-bold text-[#366ce7]">Coz</p>
        </div>
      </Link>
      <div className="flex gap-5">
        {session.data?.user?.id ? (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="gap-3">
                    <div className="flex gap-3 items-center">
                      <Avatar>
                        <AvatarImage
                          src={session.data.user.imageUrl}
                        ></AvatarImage>
                        <AvatarFallback>
                          {session.data.user.name}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-base">
                        {session.data.user.name}
                      </p>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-full px-11 py-3">
                    {/* Profile Link */}
                    <div className="items-center gap-1 hover:text-[#366ce7]">
                      <Link href="/profile" className="flex items-center gap-1">
                        <IoPersonCircleOutline size={21} />
                        <p>Profile</p>
                      </Link>
                    </div>

                    {/* Order List Link */}
                    <div className="items-center gap-1 mt-3 hover:text-[#366ce7]">
                      <Link
                        href="/orderlist"
                        className="flex items-center gap-1"
                      >
                        <AiOutlineOrderedList size={21} />
                        <p>Order List</p>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div
                      className="flex items-center gap-1 mt-3 hover:text-[#366ce7] cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <BiLogOutCircle size={21} />
                      <p>Logout</p>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button>SignIn</Button>
            </Link>
            <Link href="/register">
              <Button variant={'outline'}>SignUp</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
