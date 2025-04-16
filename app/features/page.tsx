import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Play, Pause, BookOpen, BrainCircuit, MessageSquare, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
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
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <BrainCircuit className="h-6 w-6 text-cyan-400" />
                <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm"></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                DyslexiaCare
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/features" className="text-cyan-400 font-medium">
                Features
              </Link>
              <Link href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Progress
              </Link>
              <Link href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Settings
              </Link>
            </nav>
            <Button variant="ghost" className="md:hidden text-white hover:bg-white/10">
              Menu
            </Button>
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

          <Tabs defaultValue="stt" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              <TabsTrigger
                value="stt"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-blue-500/50 data-[state=active]:text-white"
              >
                <Mic className="h-4 w-4 mr-2" />
                Speech-to-Text
              </TabsTrigger>
              <TabsTrigger
                value="tts"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-pink-500/50 data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Text-to-Speech
              </TabsTrigger>
              <TabsTrigger
                value="assistant"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-purple-500/50 data-[state=active]:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger
                value="generator"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-cyan-500/50 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Text Generator
              </TabsTrigger>
            </TabsList>

            {/* Speech-to-Text Tab */}
            <TabsContent value="stt">
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
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-blue-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-700/40">
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    </div>

                    <Textarea
                      placeholder="Your transcribed text will appear here..."
                      className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                      >
                        Clear
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                      >
                        Copy
                      </Button>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Text-to-Speech Tab */}
            <TabsContent value="tts">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Text-to-Speech</CardTitle>
                  <CardDescription className="text-gray-300">
                    Listen to any text with natural-sounding voices and adjustable reading speeds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Textarea
                      placeholder="Enter or paste text you want to listen to..."
                      className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
                      defaultValue="DyslexiaCare is an innovative platform that uses artificial intelligence to support individuals with dyslexia. Our tools make reading and writing more accessible, helping users to overcome challenges and build confidence."
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Voice</label>
                        <select className="w-full rounded-md bg-white/5 border-white/10 text-white focus:border-purple-400/50 focus:ring-purple-400/20">
                          <option>Natural Female</option>
                          <option>Natural Male</option>
                          <option>Clear Female</option>
                          <option>Clear Male</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Speed</label>
                        <select className="w-full rounded-md bg-white/5 border-white/10 text-white focus:border-purple-400/50 focus:ring-purple-400/20">
                          <option>Very Slow</option>
                          <option>Slow</option>
                          <option selected>Normal</option>
                          <option>Fast</option>
                          <option>Very Fast</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-lg shadow-pink-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-700/40 mr-2">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="assistant">
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
                      <Input
                        placeholder="Ask me anything..."
                        className="flex-1 mr-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                      />
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40">
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Text Generator Tab */}
            <TabsContent value="generator">
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
                      <Textarea
                        placeholder="Paste the text you want to modify..."
                        className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
                        defaultValue="The cognitive neuroscience of dyslexia encompasses multifaceted neurobiological factors that contribute to reading difficulties. Research indicates atypical patterns of neural activation in the left temporoparietal and occipitotemporal regions during phonological processing tasks."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/30 hover:text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Simplify
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-400/30 hover:text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Summarize
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:border-cyan-400/30 hover:text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Explain
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Generated Result</label>
                      <Textarea
                        className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
                        defaultValue="The brain science of dyslexia looks at how the brain works differently in people who have trouble reading. Studies show that certain parts of the left side of the brain don't work the same way during reading tasks for people with dyslexia."
                        readOnly
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                      >
                        Read Aloud
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 border-0 shadow-lg shadow-cyan-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-700/40">
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
