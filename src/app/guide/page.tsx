
"use client"

import { useState, useEffect } from "react"
import {
  Zap,
  Globe,
  Brain,
  MessageCircle,
  Database,
  Search,
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

// Predefined particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 10, top: 15, delay: 0, duration: 4 },
  { left: 25, top: 30, delay: 1, duration: 5 },
  { left: 40, top: 10, delay: 2, duration: 6 },
  { left: 60, top: 45, delay: 0.5, duration: 4.5 },
  { left: 75, top: 20, delay: 1.5, duration: 3.5 },
  { left: 90, top: 60, delay: 2.5, duration: 5.5 },
  { left: 15, top: 70, delay: 3, duration: 4 },
  { left: 35, top: 85, delay: 1.2, duration: 3.8 },
  { left: 55, top: 75, delay: 2.2, duration: 4.2 },
  { left: 80, top: 90, delay: 0.8, duration: 5.2 },
  { left: 5, top: 50, delay: 1.8, duration: 3.2 },
  { left: 95, top: 25, delay: 2.8, duration: 4.8 },
  { left: 70, top: 5, delay: 0.3, duration: 5.8 },
  { left: 45, top: 95, delay: 1.3, duration: 3.3 },
  { left: 20, top: 55, delay: 2.3, duration: 4.3 },
  { left: 85, top: 35, delay: 0.7, duration: 5.7 },
  { left: 30, top: 65, delay: 1.7, duration: 3.7 },
  { left: 65, top: 80, delay: 2.7, duration: 4.7 },
  { left: 12, top: 40, delay: 0.4, duration: 6.4 },
  { left: 88, top: 70, delay: 1.4, duration: 2.4 },
  { left: 50, top: 25, delay: 2.4, duration: 5.4 },
  { left: 78, top: 55, delay: 0.9, duration: 3.9 },
  { left: 38, top: 15, delay: 1.9, duration: 4.9 },
  { left: 92, top: 45, delay: 2.9, duration: 5.9 },
  { left: 22, top: 85, delay: 0.6, duration: 3.6 },
]

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles */}
        {PARTICLE_POSITIONS.map((particle, i) => (
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

      {/* Mouse Follower Light */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 text-blue-300 px-8 py-4 rounded-full text-sm font-medium mb-8 hover:bg-white/10 transition-all duration-300 group">
            <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Complete App Guide
            </span>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-8 leading-tight hover:scale-105 transition-transform duration-500 cursor-default">
            About NeuraSnap
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Discover how NeuraSnap revolutionizes web content management through intelligent AI-powered analysis and
            conversational interfaces.
          </p>
        </div>

        {/* What is NeuraSnap Section */}
        <section className="mb-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">What is NeuraSnap?</h2>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed">
              NeuraSnap is an intelligent web content management platform that revolutionizes how you interact with
              online information. By combining advanced AI technologies with intuitive design, NeuraSnap transforms any
              webpage into actionable, searchable, and conversational content.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              How NeuraSnap Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A simple yet powerful three-step process that transforms web content into intelligent, interactive
              knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "01",
                title: "Snap",
                description:
                  "Capture any webpage with a single click and create automatic bookmarks for easy reference",
                icon: <Globe className="w-8 h-8" />,
                gradient: "from-blue-500 to-cyan-500",
                details: [
                  "Captures entire webpage content",
                  "Creates automatic bookmark",
                  "Initiates AI analysis",
                  "Stores original and processed data",
                ],
              },
              {
                step: "02",
                title: "Analyze",
                description:
                  "AI processes and summarizes content using OpenAI's advanced language models for comprehensive analysis",
                icon: <Brain className="w-8 h-8" />,
                gradient: "from-purple-500 to-pink-500",
                details: [
                  "Analyzes webpage structure",
                  "Generates comprehensive summaries",
                  "Identifies key topics and themes",
                  "Creates searchable metadata",
                ],
              },
              {
                step: "03",
                title: "Interact",
                description:
                  "Chat with your saved content using CopilotKit AI and get real-time insights through Tavily extraction",
                icon: <MessageCircle className="w-8 h-8" />,
                gradient: "from-indigo-500 to-blue-500",
                details: [
                  "Natural language queries",
                  "Real-time webpage analysis",
                  "Contextual responses",
                  "Continuous conversation memory",
                ],
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
                  <p className="text-gray-300 leading-relaxed mb-6">{item.description}</p>

                  {/* Expandable Details */}
                  <button
                    onClick={() => toggleSection(`step-${idx}`)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium"
                  >
                    {expandedSections[`step-${idx}`] ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    View Details
                  </button>

                  {expandedSections[`step-${idx}`] && (
                    <div className="mt-4 space-y-2">
                      {item.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex items-center text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
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

        {/* Technology Stack Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              Technology Stack
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
                subtitle: "Content Analysis",
                description: "Processes webpage content to generate intelligent summaries and contextual insights",
                status: "Active",
                color: "from-green-500 to-emerald-500",
                features: ["High-quality extraction", "Contextually relevant", "Advanced language models"],
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "CopilotKit AI",
                subtitle: "Smart Chat Interface",
                description: "Provides conversational AI capabilities for natural language interaction",
                status: "Active",
                color: "from-blue-500 to-cyan-500",
                features: ["Natural language queries", "Contextual understanding", "Memory retention"],
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Tavily Extract API",
                subtitle: "Live Content Extraction",
                description: "Fetches real-time webpage data for enhanced chat interactions",
                status: "Active",
                color: "from-purple-500 to-pink-500",
                features: ["Real-time data", "Current information", "Enhanced accuracy"],
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Appwrite Backend",
                subtitle: "Secure Infrastructure",
                description: "Handles authentication, secure data storage, and real-time database operations",
                status: "Active",
                color: "from-orange-500 to-red-500",
                features: ["User authentication", "Scalable storage", "Real-time sync"],
              },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      {tech.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                        {tech.title}
                      </h3>
                      <p className="text-sm text-gray-400">{tech.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{tech.description}</p>

                  <button
                    onClick={() => toggleSection(`tech-${idx}`)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium mb-4"
                  >
                    {expandedSections[`tech-${idx}`] ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    Key Features
                  </button>

                  {expandedSections[`tech-${idx}`] && (
                    <div className="space-y-2 mb-4">
                      {tech.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-400">{tech.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              Key Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful capabilities designed to transform your web content experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Web Snapping",
                description: "Capture any webpage with lightning speed and automatic organization",
                features: [
                  "One-click capture of any webpage",
                  "Automatic bookmark creation",
                  "Cross-platform compatibility",
                  "Fast processing with minimal wait times",
                ],
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI-Powered Summarization",
                description: "Intelligent content analysis using advanced OpenAI technology",
                features: [
                  "Intelligent content analysis using OpenAI",
                  "Key point extraction from lengthy articles",
                  "Topic identification for better organization",
                  "Contextual understanding of webpage content",
                ],
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Centralized Dashboard",
                description: "Unified management system for all your captured web content",
                features: [
                  "Unified view of all snapped pages",
                  "Search functionality across all saved content",
                  "Bookmark management with categorization",
                  "Quick access to summaries and original content",
                ],
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Interactive Chat System",
                description: "Conversational AI interface for natural content interaction",
                features: [
                  "Natural language queries about saved content",
                  "Real-time webpage analysis through Tavily API",
                  "Contextual responses based on saved and live data",
                  "Continuous conversation with memory",
                ],
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="space-y-3">
                    {feature.features.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              Use Cases & Applications
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how NeuraSnap adapts to various professional and personal scenarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Professional Applications */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Professional Applications</h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Research and Analysis",
                    items: [
                      "Academic research: Quickly summarize research papers and articles",
                      "Market research: Analyze competitor websites and industry reports",
                      "Content curation: Collect and organize relevant industry information",
                    ],
                  },
                  {
                    title: "Business Intelligence",
                    items: [
                      "Competitive analysis: Monitor competitor websites and strategies",
                      "Industry trends: Track news and developments in your field",
                      "Knowledge management: Build a searchable database of business intelligence",
                    ],
                  },
                  {
                    title: "Content Creation",
                    items: [
                      "Blog research: Gather information for articles and posts",
                      "Social media content: Extract key insights for social sharing",
                      "Presentation preparation: Collect and summarize relevant data",
                    ],
                  },
                ].map((category, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-300">{category.title}</h4>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Use Cases */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Personal Use Cases</h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Learning and Education",
                    items: [
                      "Study materials: Save and summarize educational content",
                      "Online courses: Keep track of course materials and resources",
                      "Skill development: Organize learning resources by topic",
                    ],
                  },
                  {
                    title: "Information Management",
                    items: [
                      "News tracking: Save and summarize important news articles",
                      "Recipe collection: Store and organize cooking recipes",
                      "Travel planning: Collect and organize travel information",
                    ],
                  },
                ].map((category, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-300">{category.title}</h4>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              Benefits & Advantages
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the transformative power of intelligent web content management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Time Efficiency",
                benefits: [
                  "Rapid content processing saves hours of manual reading",
                  "Quick information retrieval through smart search",
                  "Automated organization reduces manual categorization",
                  "Instant summaries provide immediate value",
                ],
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Enhanced Productivity",
                benefits: [
                  "Centralized information hub eliminates scattered bookmarks",
                  "AI-assisted analysis provides deeper insights",
                  "Conversational interface makes information more accessible",
                  "Cross-reference capabilities connect related content",
                ],
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Improved Decision Making",
                benefits: [
                  "Comprehensive summaries provide complete picture",
                  "Real-time updates ensure current information",
                  "Historical tracking shows information evolution",
                  "Contextual insights improve understanding",
                ],
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <div className="text-white">{benefit.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {benefit.title}
                  </h3>
                  <div className="space-y-3">
                    {benefit.benefits.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start space-x-3">
                        <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">Tips for Maximum Value</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-yellow-300 mb-6">Optimization Strategies</h3>
                <div className="space-y-4">
                  {[
                    "Snap systematically - Create a routine for capturing relevant content",
                    "Use descriptive tags - Improve searchability with meaningful labels",
                    "Engage with chat - Regularly ask questions to deepen understanding",
                    "Review summaries - Periodically review saved content for insights",
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-orange-300 mb-6">Advanced Usage</h3>
                <div className="space-y-4">
                  {[
                    "Create content clusters - Group related snaps for comprehensive research",
                    "Use chat for connections - Ask AI to find relationships between saved content",
                    "Export strategically - Utilize export features for presentations and reports",
                    "Share selectively - Leverage sharing features for team collaboration",
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section className="mb-20">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="flex items-center justify-center mb-8">
                <Shield className="w-12 h-12 text-blue-400 mr-4" />
                <h2 className="text-4xl font-bold text-white">The Future of Web Content Management</h2>
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                NeuraSnap represents the future of intelligent web content management. By combining the power of
                OpenAI&apos;s content analysis, CopilotKit&apos;s conversational AI, and Tavily&apos;s real-time extraction
                capabilities, it creates an unparalleled platform for capturing, understanding, and interacting with web
                content.
              </p>
              <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
                Whether you&apos;re a researcher, student, business professional, or simply someone who wants to better
                organize and understand online information, NeuraSnap provides the tools and intelligence to transform
                how you interact with the web.
              </p>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Where AI meets intelligent web content management
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
