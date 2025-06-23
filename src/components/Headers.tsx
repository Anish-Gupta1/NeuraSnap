import Link from "next/link"
import { getLoggedInUser } from "@/lib/server/appwrite"
import { signOut } from "@/lib/server/actions/signOut"
import { Home, LogIn, LogOut, Sparkles, LayoutDashboard, Camera, Scissors } from "lucide-react"

export default async function Header() {
  const user = await getLoggedInUser()

  return (
    <header className="fixed top-0 w-full px-6 py-4 z-50 transition-all duration-500 ease-out animate-slideDown">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/10"></div>

      {/* Gradient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>

      <div className="relative max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - Home Logo */}
        <Link
          href="/"
          className="group flex items-center space-x-3 text-white hover:text-blue-300 font-bold text-xl transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <Home className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
            NeuraSnap
          </span>
          <Sparkles className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
        </Link>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex ml-22 items-center space-x-4">
          {/* Dashboard Button */}
          {user ? (
            <Link
              href="/dashboard"
              className="group relative bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 text-white px-5 py-2.5 rounded-lg hover:from-emerald-500/30 hover:to-teal-500/30 hover:border-emerald-400/50 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              
              <LayoutDashboard className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 font-medium">Dashboard</span>
            </Link>
          ) : (
            <div className="group relative">
              <div className="relative bg-gradient-to-r from-gray-500/10 to-gray-600/10 backdrop-blur-sm border border-gray-500/20 text-gray-400 px-5 py-2.5 rounded-lg flex items-center space-x-2 cursor-not-allowed opacity-60">
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </div>
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-white/10">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10"></div>
                Sign in first to access Dashboard
              </div>
            </div>
          )}

          {/* Snap Button */}
          {user ? (
            <Link
              href="/snap"
              className="group relative bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm border border-violet-500/30 text-white px-5 py-2.5 rounded-lg hover:from-violet-500/30 hover:to-fuchsia-500/30 hover:border-violet-400/50 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              
              <Scissors className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 font-medium">Snap</span>
            </Link>
          ) : (
            <div className="group relative">
              <div className="relative bg-gradient-to-r from-gray-500/10 to-gray-600/10 backdrop-blur-sm border border-gray-500/20 text-gray-400 px-5 py-2.5 rounded-lg flex items-center space-x-2 cursor-not-allowed opacity-60">
                <Camera className="w-4 h-4" />
                <span className="font-medium">Snap</span>
              </div>
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-white/10">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10"></div>
                Sign in first to access Snap
              </div>
            </div>
          )}
        </div>

        {/* Right - Auth buttons */}
        {user ? (
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Welcome back!</span>
            </div>

            {/* Sign Out Button */}
            <form action={signOut}>
              <button
                type="submit"
                className="group relative bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 text-white px-6 py-3 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/50 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>

                <LogOut className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 font-medium">Sign Out</span>
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/auth"
            className="group relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-white px-6 py-3 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>

            <LogIn className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 font-medium">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  )
}