'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {RootState} from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/store/authSlice";
import { useEffect, useState } from 'react';
import { fetchListing } from "@/lib/store/listingSlice";

export default function Navbar() {
  const {isLoggedIn} = useSelector((state:RootState)=>state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>('');
  const handleLogout = async ()=>{
    localStorage.removeItem('accessToken');
    dispatch(logout())
    router.push('/login');
  }
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(fetchListing({ page: 1, search }));
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <Link
          href="/"
          >
            <img
              alt="Explorer Logo"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
            <h3 className="text-white font-bold text-xl tracking-wide">Explorer</h3>
          </Link>
        </div>

        {/* CENTER: Searchbar */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search destinations, hotels, or guides..."
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              value={search}
              className="w-full rounded-full bg-gray-800 px-4 py-4 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-800 transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute right-4 top-4 h-5 w-5 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
            </svg>
          </div>
        </div>

        {/* RIGHT: Login / Signup / Profile */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // Logged In — show Profile dropdown
            <Menu as="div" className="relative">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <img
                  alt="User avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="h-8 w-8 rounded-full bg-gray-800 outline outline-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/10 focus:outline-none"
              >
                <MenuItem>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Sign out</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            // Not Logged In — show buttons
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile searchbar */}
      <div className="flex md:hidden px-4 pb-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full bg-gray-800/80 px-4 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </nav>
  )
}
