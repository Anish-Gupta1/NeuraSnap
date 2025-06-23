"use client"

import { CheckCircle, Globe, Brain, MessageCircle, Database, Zap, ArrowRight, Star, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  // Generate consistent particle data
  const particleData = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 37 + 23) % 100, // Deterministic positioning
    top: (i * 43 + 17) % 100,
    delay: (i * 0.5) % 5,
    duration: 3 + (i % 4),
  }))

  useEffect(() => {
    setIsClient(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles - Only render on client */}
        {isClient && particleData.map(particle => (
          <div
            key={particle.id}
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

      {/* Hero Section */}
      <header className="relative z-20 max-w-7xl mx-auto pt-20 pb-32 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 hover:bg-white/10 transition-all duration-300 group">
          <Star className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered Web Intelligence
          </span>
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-8 leading-tight hover:scale-105 transition-transform duration-500 cursor-default">
          NeuraSnap
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
          Transform any webpage into intelligent summaries and get instant answers. Your AI-powered web knowledge
          assistant that understands context and delivers insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link href="/dashboard">
            <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </Link>
          <button className="group relative border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-semibold backdrop-blur-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300 hover:scale-105">
            <span className="relative">Watch Demo</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-300">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Lightning fast</span>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="relative z-20 max-w-7xl mx-auto py-32 px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
            How NeuraSnap Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three simple steps to transform any webpage into actionable intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Snap & Summarize",
              description:
                "Paste any URL and our AI instantly creates intelligent summaries with key insights and descriptions using OpenAI's advanced language models.",
              icon: <Brain className="w-8 h-8" />,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              step: "02",
              title: "Smart Web Extraction",
              description:
                "Ask questions beyond the summary. Tavily's intelligent web extraction finds and delivers precise answers directly from the source webpage.",
              icon: <Globe className="w-8 h-8" />,
              gradient: "from-purple-500 to-pink-500",
            },
            {
              step: "03",
              title: "Intelligent Chat",
              description:
                "Chat naturally with your saved content using CopilotKit. Get insights, ask follow-ups, and explore connections across all your snapped pages.",
              icon: <MessageCircle className="w-8 h-8" />,
              gradient: "from-indigo-500 to-blue-500",
            },
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>

                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <div className="text-white">{item.icon}</div>
                </div>
                <div className="text-sm font-bold text-gray-400 mb-3">STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
              {idx < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-500 hover:text-white transition-colors duration-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              Powered by Best-in-Class AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on proven technologies that deliver reliable, intelligent results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "OpenAI Integration",
                subtitle: "Advanced Summarization",
                description: "Leverage GPT models for intelligent content analysis and summary generation",
                status: "Active",
                color: "from-green-500 to-emerald-500",
                envVar: "OPENAI_API_KEY",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Tavily Web Extraction",
                subtitle: "Smart Web Crawling",
                description: "Advanced web extraction for answering questions beyond summarized content",
                status: "Active",
                color: "from-blue-500 to-cyan-500",
                envVar: "TAVILY_API_KEY",
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "CopilotKit Chat",
                subtitle: "Natural Conversations",
                description: "Intelligent chat interface for seamless interaction with your knowledge base",
                status: "Active",
                color: "from-purple-500 to-pink-500",
                envVar: null,
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Appwrite Backend",
                subtitle: "Secure & Scalable",
                description: "Robust authentication and database management for your personal knowledge vault",
                status: "Active",
                color: "from-orange-500 to-red-500",
                envVar: "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">{feature.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="relative z-20 max-w-4xl mx-auto py-20 px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">System Status</h2>
          <div className="space-y-4">
            <ServiceStatus
              service="OpenAI API"
              status={checkEnvironmentVariable("OPENAI_API_KEY")}
              description="AI-powered content summarization and analysis"
            />
            <ServiceStatus
              service="Tavily API"
              status={checkEnvironmentVariable("TAVILY_API_KEY")}
              description="Intelligent web extraction and question answering"
            />
            <ServiceStatus
              service="Appwrite Database"
              status={checkEnvironmentVariable("NEXT_PUBLIC_APPWRITE_PROJECT_ID")}
              description="Secure user authentication and data storage"
            />
            <ServiceStatus
              service="CopilotKit"
              status={true}
              description="Intelligent chat interface and user interactions"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-32">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10 hover:border-white/20 transition-all duration-500">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 hover:scale-105 transition-transform duration-300 cursor-default">
              Ready to Transform Your Web Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already turning web content into actionable intelligence with NeuraSnap.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/snap">
                <button className="group relative bg-gradient-to-r from-white to-gray-100 text-black px-10 py-5 rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/25">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative flex items-center gap-3 justify-center">
                    Start Snapping Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
              <button className="group relative border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold backdrop-blur-sm hover:border-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <span className="relative">View Live Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300 cursor-default">
            NeuraSnap
          </h3>
          <p className="text-gray-400 mb-6">Your AI-powered web knowledge assistant</p>
          <p className="text-sm text-gray-500">
            &copy; 2025 NeuraSnap. Built with Next.js, OpenAI, Tavily, CopilotKit, and Appwrite.
          </p>
        </div>
      </footer>
    </div>
  )
}

function ServiceStatus({
  service,
  status,
  description,
}: {
  service: string
  status: boolean
  description: string
}) {
  return (
    <div className="group flex items-center justify-between p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${status ? "bg-green-400 animate-pulse" : "bg-yellow-400 animate-pulse"}`}
          />
          <span className={`text-xs font-medium ${status ? "text-green-400" : "text-yellow-400"}`}>
            {status ? "ACTIVE" : "PENDING"}
          </span>
        </div>
        <div>
          <div className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
            {service}
          </div>
          <div className="text-sm text-gray-400">{description}</div>
        </div>
      </div>
      <CheckCircle
        className={`w-5 h-5 ${status ? "text-green-400" : "text-gray-500"} group-hover:scale-110 transition-transform duration-300`}
      />
    </div>
  )
}

function checkEnvironmentVariable(varName: string): boolean {
  // Return true for demonstration purposes
  // In a real app, you'd check process.env[varName] on the server
  return true
}