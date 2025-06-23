"use client"

import type React from "react"
import { useState } from "react"
import { signInWithEmail, signUpWithEmail } from "@/lib/server/auth-actions"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"

interface AuthFormProps {
  mode: "signin" | "signup"
  onToggleMode: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const formAction = mode === "signin" ? signInWithEmail : signUpWithEmail

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await formAction(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-white/5 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>

        <div className="relative z-10 text-sm">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <Sparkles className="w-5 h-5 text-purple-400 ml-2 animate-pulse" />
            </div>
            <p className="text-gray-300 text-xs">
              {mode === "signin"
                ? "Sign in to access your content"
                : "Join NeuraSnap and start extracting smart FAQs"}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="group">
                <label htmlFor="name" className="block text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-gray-300 text-xs mb-2">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={onToggleMode}
              className="text-blue-400 hover:underline text-sm"
            >
              {mode === "signin" ? "Create New Account" : "Sign In Instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
