import { Link } from "react-router-dom"
import { ArrowRight, Mic, BookOpen, BrainCircuit, MessageSquare, FileText, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
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

      {/* Hero Section */}
      <header className="relative">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <BrainCircuit className="h-8 w-8 text-cyan-400" />
                <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                DyslexiaCare
              </span>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
              <a href="#features" className="hover:text-cyan-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="hover:text-cyan-400 transition-colors">
                Testimonials
              </a>
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
              >
                Login
              </Link>
            </div>
            <button className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Menu
            </button>
          </nav>

          <div className="py-20 md:py-28 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6 relative">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-600/20 rounded-full filter blur-3xl"></div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="block">AI-Powered</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                  Dyslexia Support
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Unlock your potential with personalized tools designed to make reading and writing accessible for
                everyone.
              </p>
              <div className="flex space-x-4 pt-4">
                <Link
                  to="/home"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white h-11 px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 backdrop-blur-sm h-11 px-8"
                >
                  Explore Features
                </a>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
              <div className="relative w-full max-w-md h-80 perspective-1000">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-spin-slow"></div>
                </div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5 shadow-2xl transform hover:rotate-y-10 transition-transform duration-500">
                  <img
                    src="/placeholder.svg"
                    alt="DyslexiaCare platform interface"
                    className="object-contain p-4 w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/10 to-black/0"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">AI-Powered Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Innovative Tools for Better Reading
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our cutting-edge AI technologies provide personalized support for dyslexic readers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="h-10 w-10 text-cyan-400" />}
              title="Speech-to-Text"
              description="Convert your spoken words into written text with high accuracy, making writing tasks easier."
              gradient="from-cyan-500/20 to-blue-500/20"
              hoverGradient="from-cyan-500/30 to-blue-500/30"
              delay="0"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-purple-400" />}
              title="Text-to-Speech"
              description="Listen to any text with natural-sounding voices and adjustable reading speeds."
              gradient="from-purple-500/20 to-pink-500/20"
              hoverGradient="from-purple-500/30 to-pink-500/30"
              delay="100"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-cyan-400" />}
              title="AI Assistant"
              description="Get real-time help with reading, writing, and understanding complex texts."
              gradient="from-cyan-500/20 to-purple-500/20"
              hoverGradient="from-cyan-500/30 to-purple-500/30"
              delay="200"
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-purple-400" />}
              title="Text Generation"
              description="Generate summaries, simplifications, and alternative explanations for difficult texts."
              gradient="from-purple-500/20 to-blue-500/20"
              hoverGradient="from-purple-500/30 to-blue-500/30"
              delay="300"
            />
            <FeatureCard
              icon={<BrainCircuit className="h-10 w-10 text-cyan-400" />}
              title="Personalized Quizzes"
              description="Practice with adaptive quizzes that adjust to your specific learning needs."
              gradient="from-cyan-500/20 to-pink-500/20"
              hoverGradient="from-cyan-500/30 to-pink-500/30"
              delay="400"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-purple-400" />}
              title="Dyslexia-Friendly Reading"
              description="Customize text display with fonts, spacing, and colors optimized for dyslexic readers."
              gradient="from-purple-500/20 to-cyan-500/20"
              hoverGradient="from-purple-500/30 to-cyan-500/30"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-neural-network opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <BrainCircuit className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-purple-400">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Personalized Learning Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform adapts to your unique needs, providing personalized support every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Tell us about your specific challenges and preferences to personalize your experience."
              gradient="from-cyan-500/20 to-blue-500/20"
              delay="0"
            />
            <StepCard
              number="2"
              title="Access AI Tools"
              description="Use our suite of AI-powered tools designed specifically for dyslexic readers."
              gradient="from-purple-500/20 to-pink-500/20"
              delay="200"
            />
            <StepCard
              number="3"
              title="Track Your Progress"
              description="See your improvement over time with detailed analytics and personalized recommendations."
              gradient="from-cyan-500/20 to-purple-500/20"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/10 to-black/0"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Transforming Lives
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from people who have transformed their reading and writing experience with DyslexiaCare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="DyslexiaCare has completely changed how I approach reading. The text-to-speech feature helps me understand complex texts that I would have struggled with before."
              name="Sarah L."
              role="Student"
              gradient="from-cyan-500/10 to-blue-500/10"
              delay="0"
            />
            <TestimonialCard
              quote="As a parent of a dyslexic child, I've seen firsthand how the personalized quizzes and AI assistant have boosted my son's confidence and reading skills."
              name="Michael T."
              role="Parent"
              gradient="from-purple-500/10 to-pink-500/10"
              delay="200"
            />
            <TestimonialCard
              quote="The speech-to-text tool has made writing emails and reports so much easier for me. I can finally express my ideas without worrying about spelling."
              name="Jamie K."
              role="Professional"
              gradient="from-cyan-500/10 to-purple-500/10"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              Ready to Transform Your Reading Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have improved their reading and writing skills with DyslexiaCare.
            </p>
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white h-11 px-8"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <BrainCircuit className="h-8 w-8 text-cyan-400" />
                  <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm"></div>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                  DyslexiaCare
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering dyslexic readers with AI-powered tools for a better reading and writing experience.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DyslexiaCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient, hoverGradient, delay }) {
  return (
    <div
      className={`relative backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
      ></div>
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br ${hoverGradient} rounded-xl opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500`}
      ></div>
      <div className="relative">
        <div className="mb-4 relative">
          {icon}
          <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description, gradient, delay }) {
  return (
    <div
      className="relative backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-30 transition-opacity duration-500`}
      ></div>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-white/10 text-cyan-400 flex items-center justify-center text-2xl font-bold mx-auto mb-4 backdrop-blur-sm border border-white/20">
          {number}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role, gradient, delay }) {
  return (
    <div
      className="relative backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-30 transition-opacity duration-500`}
      ></div>
      <div className="relative">
        <p className="mb-6 italic text-gray-300">"{quote}"</p>
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}
