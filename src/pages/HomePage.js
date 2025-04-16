"use client"

import React from "react"
import {
  Mic,
  BookOpen,
  BrainCircuit,
  MessageSquare,
  FileText,
  User,
  Settings,
  BarChart,
  BookMarked,
  LogOut,
  Sparkles,
  Activity,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] animate-pulse"></div>
          <div
            className="absolute top-3/4 left-2/3 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-black/40 backdrop-blur-md border-r border-white/10 relative z-10">
        <div className="flex items-center h-16 px-6 border-b border-white/10">
          <div className="relative">
            <BrainCircuit className="h-6 w-6 text-cyan-400" />
            <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm"></div>
          </div>
          <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            DyslexiaCare
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavItem icon={<BookMarked className="h-5 w-5" />} label="Dashboard" active />
            <NavItem icon={<Mic className="h-5 w-5" />} label="Speech-to-Text" />
            <NavItem icon={<BookOpen className="h-5 w-5" />} label="Text-to-Speech" />
            <NavItem icon={<MessageSquare className="h-5 w-5" />} label="AI Assistant" />
            <NavItem icon={<FileText className="h-5 w-5" />} label="Text Generation" />
            <NavItem icon={<BrainCircuit className="h-5 w-5" />} label="Quizzes" />
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <NavItem icon={<User className="h-5 w-5" />} label="Profile" />
            <NavItem icon={<BarChart className="h-5 w-5" />} label="Progress" />
            <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
            <NavItem icon={<LogOut className="h-5 w-5" />} label="Logout" />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-16 px-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <button className="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0">
            <BrainCircuit className="h-6 w-6 text-cyan-400" />
            <span className="sr-only">Menu</span>
          </button>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            DyslexiaCare
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                  Welcome back, Alex!
                </h1>
                <p className="text-gray-300 mt-1">Here's what's new with your DyslexiaCare tools</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Session
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <QuickActionCard
                icon={<Mic className="h-8 w-8 text-cyan-400" />}
                title="Speech-to-Text"
                description="Convert your spoken words to text"
                buttonText="Start Recording"
                gradient="from-cyan-500/20 to-blue-500/20"
                hoverGradient="from-cyan-500/30 to-blue-500/30"
              />
              <QuickActionCard
                icon={<BookOpen className="h-8 w-8 text-purple-400" />}
                title="Text-to-Speech"
                description="Listen to any text with natural voices"
                buttonText="Read Text"
                gradient="from-purple-500/20 to-pink-500/20"
                hoverGradient="from-purple-500/30 to-pink-500/30"
              />
              <QuickActionCard
                icon={<MessageSquare className="h-8 w-8 text-cyan-400" />}
                title="AI Assistant"
                description="Get help with reading and writing"
                buttonText="Ask Assistant"
                gradient="from-cyan-500/20 to-purple-500/20"
                hoverGradient="from-cyan-500/30 to-purple-500/30"
              />
            </div>

            {/* Recent Activity & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-300">Your latest sessions and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4 bg-white/10 border border-white/10">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="stt"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white"
                      >
                        Speech-to-Text
                      </TabsTrigger>
                      <TabsTrigger
                        value="tts"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white"
                      >
                        Text-to-Speech
                      </TabsTrigger>
                      <TabsTrigger
                        value="quizzes"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white"
                      >
                        Quizzes
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <ActivityList />
                    </TabsContent>
                    <TabsContent value="stt">
                      <ActivityList filter="stt" />
                    </TabsContent>
                    <TabsContent value="tts">
                      <ActivityList filter="tts" />
                    </TabsContent>
                    <TabsContent value="quizzes">
                      <ActivityList filter="quizzes" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Progress</CardTitle>
                  <CardDescription className="text-gray-300">Your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ProgressItem label="Reading Speed" value={68} color="bg-gradient-to-r from-cyan-400 to-blue-500" />
                    <ProgressItem
                      label="Comprehension"
                      value={82}
                      color="bg-gradient-to-r from-purple-400 to-pink-500"
                    />
                    <ProgressItem
                      label="Writing Accuracy"
                      value={75}
                      color="bg-gradient-to-r from-cyan-400 to-purple-500"
                    />
                    <ProgressItem
                      label="Quiz Performance"
                      value={90}
                      color="bg-gradient-to-r from-emerald-400 to-cyan-500"
                    />
                  </div>
                  <div className="mt-6">
                    <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                      <Activity className="h-4 w-4 mr-2" />
                      View Detailed Analytics
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Tools */}
            <div className="mt-8 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <RecommendedCard
                icon={<FileText className="h-6 w-6 text-cyan-400" />}
                title="Text Simplifier"
                description="Simplify complex texts for easier understanding"
                gradient="from-cyan-500/20 to-blue-500/20"
              />
              <RecommendedCard
                icon={<BrainCircuit className="h-6 w-6 text-purple-400" />}
                title="Vocabulary Quiz"
                description="Practice with words from your recent readings"
                gradient="from-purple-500/20 to-pink-500/20"
              />
              <RecommendedCard
                icon={<BookOpen className="h-6 w-6 text-cyan-400" />}
                title="Dyslexia-Friendly Reader"
                description="Customize text display for easier reading"
                gradient="from-cyan-500/20 to-purple-500/20"
              />
              <RecommendedCard
                icon={<MessageSquare className="h-6 w-6 text-purple-400" />}
                title="Writing Assistant"
                description="Get help with grammar and spelling"
                gradient="from-purple-500/20 to-cyan-500/20"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <a
      href="#"
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-white/10"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </a>
  )
}

function QuickActionCard({ icon, title, description, buttonText, gradient, hoverGradient }) {
  return (
    <Card className="bg-transparent border-white/10 overflow-hidden group relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
      ></div>
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500`}
      ></div>
      <CardContent className="p-6 backdrop-blur-sm relative">
        <div className="flex items-start">
          <div className="mr-4 relative">
            {icon}
            <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1 text-white group-hover:text-cyan-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-300 text-sm mb-4">{description}</p>
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white">
              {buttonText}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityList({ filter = null }) {
  // This would normally be fetched from an API
  const activities = [
    {
      id: 1,
      type: "stt",
      title: "Speech-to-Text Session",
      description: "Converted 5 minutes of speech",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "tts",
      title: "Article Reading",
      description: 'Listened to "Understanding Dyslexia"',
      time: "Yesterday",
    },
    {
      id: 3,
      type: "quizzes",
      title: "Vocabulary Quiz",
      description: "Completed with 85% accuracy",
      time: "Yesterday",
    },
    {
      id: 4,
      type: "stt",
      title: "Essay Dictation",
      description: "Converted 15 minutes of speech",
      time: "3 days ago",
    },
    {
      id: 5,
      type: "tts",
      title: "Book Chapter",
      description: 'Listened to Chapter 3 of "The Great Gatsby"',
      time: "4 days ago",
    },
  ]

  const filteredActivities = filter ? activities.filter((activity) => activity.type === filter) : activities

  return (
    <div className="space-y-4">
      {filteredActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start p-3 hover:bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm transition-colors duration-300"
        >
          <div className="mr-4 relative">
            {activity.type === "stt" && <Mic className="h-5 w-5 text-cyan-400" />}
            {activity.type === "tts" && <BookOpen className="h-5 w-5 text-purple-400" />}
            {activity.type === "quizzes" && <BrainCircuit className="h-5 w-5 text-pink-400" />}
            <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white">{activity.title}</h4>
            <p className="text-sm text-gray-300">{activity.description}</p>
          </div>
          <div className="text-xs text-gray-400">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressItem({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-300">{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

function RecommendedCard({ icon, title, description, gradient }) {
  return (
    <Card className="bg-transparent border-white/10 overflow-hidden group relative hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
      ></div>
      <CardContent className="p-6 backdrop-blur-sm relative">
        <div className="mb-4 relative">
          {icon}
          <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <h3 className="font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
          Try Now
        </button>
      </CardContent>
    </Card>
  )
}

// UI Components
function Card({ children, className }) {
  return <div className={`rounded-lg ${className}`}>{children}</div>
}

function CardHeader({ children }) {
  return <div className="p-6 pb-2">{children}</div>
}

function CardTitle({ children, className }) {
  return <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
}

function CardDescription({ children, className }) {
  return <p className={`text-sm ${className}`}>{children}</p>
}

function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  // Clone children and pass activeTab state
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab })
    }
    return child
  })

  return <div>{childrenWithProps}</div>
}

function TabsList({ children, className, activeTab, setActiveTab }) {
  return <div className={`flex space-x-1 rounded-md ${className}`}>{children}</div>
}

function TabsTrigger({ children, value, className, activeTab, setActiveTab }) {
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${className} ${activeTab === value ? "data-[state=active]" : ""}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

function TabsContent({ children, value, activeTab }) {
  if (value !== activeTab) return null
  return <div>{children}</div>
}
