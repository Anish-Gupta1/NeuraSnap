"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "../../components/auth/AuthForm"
import { Zap, Globe, Search, Download, Sparkles, Brain, CheckCircle } from "lucide-react"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: 23, top: 45, delay: 0.5, duration: 4 },
    { left: 67, top: 12, delay: 1.2, duration: 5 },
    { left: 89, top: 78, delay: 2.1, duration: 3.5 },
    { left: 12, top: 34, delay: 0.8, duration: 4.5 },
    { left: 45, top: 67, delay: 1.8, duration: 3.2 },
    { left: 78, top: 23, delay: 2.5, duration: 4.8 },
    { left: 34, top: 89, delay: 0.3, duration: 3.8 },
    { left: 56, top: 45, delay: 1.5, duration: 4.2 },
    { left: 90, top: 56, delay: 2.8, duration: 3.6 },
    { left: 15, top: 78, delay: 0.9, duration: 4.1 },
    { left: 67, top: 34, delay: 1.7, duration: 5.2 },
    { left: 43, top: 12, delay: 2.3, duration: 3.9 },
    { left: 78, top: 67, delay: 1.1, duration: 4.6 },
    { left: 25, top: 56, delay: 0.6, duration: 3.4 },
    { left: 85, top: 89, delay: 2.0, duration: 4.3 }
  ]

  useEffect(() => {
    setIsClient(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles - Only render on client to avoid hydration issues */}
        {isClient && particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mouse Follower Light - Only render on client */}
      {isClient && (
        <div
          className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      )}

      {/* Fixed AuthForm on the right */}
      <div className="fixed right-40 top-1/2 transform -translate-y-1/2 z-30 w-full max-w-md px-6 lg:px-0">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
          <AuthForm mode={mode} onToggleMode={toggleMode} />
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start min-h-screen">
          {/* Left side - Branding and features (now scrollable) */}
          <div className="space-y-10 pr-8 lg:pr-16">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-blue-400 blur-lg opacity-50 rounded-2xl"></div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  NeuraSnap
                </h1>
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform any webpage into a comprehensive FAQ collection with AI-powered extraction and intelligent
                organization.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Instant Web Scraping",
                  description:
                    "Simply paste any URL and watch as our AI extracts relevant information and generates meaningful FAQs automatically.",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10",
                },
                {
                  icon: <Search className="w-6 h-6" />,
                  title: "Smart Organization",
                  description:
                    "Your FAQs are automatically categorized and made searchable, so you can find exactly what you need in seconds.",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10",
                },
                {
                  icon: <Download className="w-6 h-6" />,
                  title: "Export & Share",
                  description:
                    "Export your FAQ collections as PDFs, share with your team, or integrate with your existing knowledge base.",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-500/10 to-emerald-500/10",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group flex items-start space-x-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`bg-gradient-to-r ${feature.gradient} rounded-xl p-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <h3 className="font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Use Cases */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <h4 className="font-semibold text-white mb-6 flex items-center space-x-3">
                <Brain className="w-6 h-6 text-purple-400" />
                <span>Perfect for:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  {["Customer Support", "Product Documentation", "Training Materials"].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {["Knowledge Management", "Content Research", "Competitive Analysis"].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 pb-16">
              <div className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-400 transition-colors duration-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Instant results</span>
              </div>
            </div>
          </div>

          {/* Right side - Empty space for fixed form */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </div>
  )
}