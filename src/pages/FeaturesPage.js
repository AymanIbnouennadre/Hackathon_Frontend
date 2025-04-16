"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Mic, Play, Pause, BookOpen, BrainCircuit, MessageSquare, FileText, Sparkles } from "lucide-react"

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("stt")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
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

      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <BrainCircuit className="h-6 w-6 text-cyan-400" />
                <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm"></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                DyslexiaCare
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/home" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
              <Link to="/features" className="text-cyan-400 font-medium">
                Features
              </Link>
              <Link to="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Progress
              </Link>
              <Link to="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Settings
              </Link>
            </nav>
            <button className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-white hover:bg-white/10">
              Menu
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">AI-Powered Tools</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              DyslexiaCare Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our cutting-edge AI tools designed to support dyslexic readers
            </p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              <TabButton
                active={activeTab === "stt"}
                onClick={() => setActiveTab("stt")}
                icon={<Mic className="h-4 w-4 mr-2" />}
                label="Speech-to-Text"
                gradient="from-cyan-500/50 to-blue-500/50"
              />
              <TabButton
                active={activeTab === "tts"}
                onClick={() => setActiveTab("tts")}
                icon={<BookOpen className="h-4 w-4 mr-2" />}
                label="Text-to-Speech"
                gradient="from-purple-500/50 to-pink-500/50"
              />
              <TabButton
                active={activeTab === "assistant"}
                onClick={() => setActiveTab("assistant")}
                icon={<MessageSquare className="h-4 w-4 mr-2" />}
                label="AI Assistant"
                gradient="from-cyan-500/50 to-purple-500/50"
              />
              <TabButton
                active={activeTab === "generator"}
                onClick={() => setActiveTab("generator")}
                icon={<FileText className="h-4 w-4 mr-2" />}
                label="Text Generator"
                gradient="from-purple-500/50 to-cyan-500/50"
              />
            </div>

            {/* Speech-to-Text Tab */}
            {activeTab === "stt" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Speech-to-Text</CardTitle>
                  <CardDescription className="text-gray-300">
                    Convert your spoken words into written text with high accuracy, making writing tasks easier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-6 text-center border border-white/10">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer">
                        <div className="relative">
                          <Mic className="h-10 w-10 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute -inset-2 bg-cyan-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">Press the button and start speaking</p>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-blue-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-700/40 text-white">
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </button>
                    </div>

                    <textarea
                      placeholder="Your transcribed text will appear here..."
                      className="min-h-[200px] w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 rounded-md p-3"
                    />

                    <div className="flex justify-end space-x-2">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
                        Clear
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
                        Copy
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white">
                        Save
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Text-to-Speech Tab */}
            {activeTab === "tts" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Text-to-Speech</CardTitle>
                  <CardDescription className="text-gray-300">
                    Listen to any text with natural-sounding voices and adjustable reading speeds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <textarea
                      placeholder="Enter or paste text you want to listen to..."
                      className="min-h-[200px] w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-md p-3"
                      defaultValue="DyslexiaCare is an innovative platform that uses artificial intelligence to support individuals with dyslexia. Our tools make reading and writing more accessible, helping users to overcome challenges and build confidence."
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Voice</label>
                        <select className="w-full rounded-md bg-white/5 border-white/10 text-white focus:border-purple-400/50 focus:ring-purple-400/20 p-2">
                          <option>Natural Female</option>
                          <option>Natural Male</option>
                          <option>Clear Female</option>
                          <option>Clear Male</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Speed</label>
                        <select className="w-full rounded-md bg-white/5 border-white/10 text-white focus:border-purple-400/50 focus:ring-purple-400/20 p-2">
                          <option>Very Slow</option>
                          <option>Slow</option>
                          <option selected>Normal</option>
                          <option>Fast</option>
                          <option>Very Fast</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-lg shadow-pink-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-700/40 text-white mr-2">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistant Tab */}
            {activeTab === "assistant" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-gray-300">
                    Get real-time help with reading, writing, and understanding complex texts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg p-4 space-y-4 border border-white/10">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full p-2 mr-3 border border-white/10">
                          <MessageSquare className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 shadow-sm backdrop-blur-sm border border-white/10">
                          <p className="text-gray-200">
                            Hello! I'm your DyslexiaCare assistant. I can help you with reading, writing, and
                            understanding text. What would you like help with today?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start justify-end">
                        <div className="bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-lg p-3 shadow-sm">
                          <p className="text-white">
                            Can you help me understand what "photosynthesis" means in simple terms?
                          </p>
                        </div>
                        <div className="bg-white/10 rounded-full p-2 ml-3 border border-white/10">
                          <BrainCircuit className="h-5 w-5 text-gray-300" />
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full p-2 mr-3 border border-white/10">
                          <MessageSquare className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 shadow-sm backdrop-blur-sm border border-white/10">
                          <p className="text-gray-200">
                            Photosynthesis is how plants make their own food. They use sunlight, water, and air to
                            create energy. It's like plants cooking their own meals using sunlight as the heat!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        placeholder="Ask me anything..."
                        className="flex-1 mr-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 rounded-md p-3"
                      />
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white">
                        Send
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Text Generator Tab */}
            {activeTab === "generator" && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Text Generator</CardTitle>
                  <CardDescription className="text-gray-300">
                    Generate summaries, simplifications, and alternative explanations for difficult texts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Original Text</label>
                      <textarea
                        placeholder="Paste the text you want to modify..."
                        className="min-h-[150px] w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-md p-3"
                        defaultValue="The cognitive neuroscience of dyslexia encompasses multifaceted neurobiological factors that contribute to reading difficulties. Research indicates atypical patterns of neural activation in the left temporoparietal and occipitotemporal regions during phonological processing tasks."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/30 hover:text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Simplify
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-400/30 hover:text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Summarize
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-400/30 hover:text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Explain
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Generated Result</label>
                      <textarea
                        className="min-h-[150px] w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-md p-3"
                        defaultValue="The brain science of dyslexia looks at how the brain works differently in people who have trouble reading. Studies show that certain parts of the left side of the brain don't work the same way during reading tasks for people with dyslexia."
                        readOnly
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
                        Copy
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white">
                        Read Aloud
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 border-0 shadow-lg shadow-cyan-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-700/40 text-white">
                        Save
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-12 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} DyslexiaCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// UI Components
function TabButton({ active, onClick, icon, label, gradient }) {
  return (
    <button
      className={`text-sm flex items-center justify-center px-3 py-1.5 rounded-md transition-all ${
        active ? `bg-gradient-to-r ${gradient} text-white` : "text-gray-300 hover:bg-white/5"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

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
