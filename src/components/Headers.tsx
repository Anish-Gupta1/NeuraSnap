// app/components/Header.tsx (server component)

import Link from 'next/link';
import { getLoggedInUser } from '@/lib/server/appwrite';
import { signOut } from '@/lib/server/actions/signOut';
import { Home, LogIn, LogOut } from 'lucide-react';

export default async function Header() {
  const user = await getLoggedInUser(); // this checks cookie + session from Appwrite

  return (
    <header className="sticky top-0 w-full px-4 sm:px-6 py-4 
                     bg-white z-50 transition-all duration-300 ease-out
                     shadow-lg shadow-black/5 animate-slideDown 
                     flex justify-between items-center">
      {/* Left - Home */}
      <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-bold text-lg">
        <Home className="w-5 h-5" />
        <span>NeuraSnap</span>
      </Link>

      {/* Right - Auth buttons */}
      {user ? (
        <form action={signOut}>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      ) : (
        <Link
          href="/auth"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      )}
    </header>
  );
}
