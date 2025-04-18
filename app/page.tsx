// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, BookOpen, BrainCircuit, MessageSquare, Image as ImageIcon, MessageCircle, Sparkles, Linkedin, Github, ArrowUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Scroll to Top Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="#home">
          <Button
            size="icon"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </Link>
      </div>

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
      <header id="home" className="relative">
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
              <Link href="#home" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link href="#features" className="hover:text-cyan-400 transition-colors">
                Features
              </Link>
              <Link href="#team" className="hover:text-cyan-400 transition-colors">
                Team
              </Link>
              <Link href="#ready" className="hover:text-cyan-400 transition-colors">
                Ready
              </Link>
            </div>
            <Button className="md:hidden" variant="outline">
              Menu
            </Button>
          </nav>

          <div className="py-20 md:py-28 flex flex-col items-center text-center">
            <div className="space-y-6 relative max-w-4xl">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-600/20 rounded-full filter blur-3xl"></div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="block">AI-Powered</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                  Dyslexia Support
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Unlock your potential with personalized tools designed to make reading and writing accessible for everyone.
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <Link href="/home">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 backdrop-blur-sm"
                  >
                    Explore Features
                  </Button>
                </Link>
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
              icon={<ImageIcon className="h-10 w-10 text-cyan-400" />}
              title="Image-to-Text"
              description="Extract text from images effortlessly, aiding comprehension and accessibility."
              gradient="from-cyan-500/20 to-purple-500/20"
              hoverGradient="from-cyan-500/30 to-purple-500/30"
              delay="200"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-purple-400" />}
              title="AI Assistant"
              description="Get real-time help with reading, writing, and understanding complex texts."
              gradient="from-purple-500/20 to-blue-500/20"
              hoverGradient="from-purple-500/30 to-blue-500/30"
              delay="300"
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-cyan-400" />}
              title="Chatbot"
              description="Interact with our AI chatbot for instant support and guidance on your learning journey."
              gradient="from-cyan-500/20 to-pink-500/20"
              hoverGradient="from-cyan-500/30 to-pink-500/30"
              delay="400"
            />
            <FeatureCard
              icon={<BrainCircuit className="h-10 w-10 text-purple-400" />}
              title="Quiz"
              description="Practice with adaptive quizzes tailored to your specific learning needs."
              gradient="from-purple-500/20 to-cyan-500/20"
              hoverGradient="from-purple-500/30 to-cyan-500/30"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/10 to-black/0"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">Meet Our Team</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              The AI Predators
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the talented developers behind DyslexiaCare, dedicated to empowering dyslexic readers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamCard
              name="Salma Abadi"
              role="Fullstack AI Developer"
              imageSrc="/img/Salma.jpg"
              linkedin="https://www.linkedin.com/in/salma-abadi/"
              github="https://github.com/ABADISALMA"
              gradient="from-cyan-500/20 to-blue-500/20"
              delay="0"
            />
            <TeamCard
              name="Ayman Ibnouennadre"
              role="Leader AI Predators, Fullstack AI Developer"
              imageSrc="/img/Ayman.jpg"
              linkedin="https://www.linkedin.com/in/ayman-ibnouennadre/"
              github="https://github.com/AymanIbnouennadre"
              gradient="from-purple-500/20 to-pink-500/20"
              delay="200"
              isLeader={true}
            />
            <TeamCard
              name="Marwane Jouad"
              role="Fullstack AI Developer"
              imageSrc="/img/Marwan.jpg"
              linkedin="https://www.linkedin.com/in/marwane-jouad"
              github="https://github.com/MarwaneJd"
              gradient="from-cyan-500/20 to-purple-500/20"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="ready" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              Ready to Transform Your Reading Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have improved their reading and writing skills with DyslexiaCare.
            </p>
            <Link href="/home">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/70 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative mb-4">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-8 w-8 text-cyan-400" />
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                    DyslexiaCare
                  </span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full blur-md"></div>
              </div>
              <p className="text-gray-400 text-center md:text-left">
                Empowering dyslexic readers with AI-powered tools.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#home" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#team" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="#ready" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Ready
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500">© {new Date().getFullYear()} DyslexiaCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
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
  );
}

function TeamCard({ name, role, imageSrc, linkedin, github, gradient, delay, isLeader }) {
  return (
    <div
      className={`relative backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center ${
        isLeader ? "md:-mt-4" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-30 transition-opacity duration-500`}
      ></div>
      <div className="relative">
        <div className="w-64 h-64 rounded-full mx-auto mb-8 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${name}'s profile picture`}
            width={256}
            height={256}
            className="object-cover"
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
        <p className="text-gray-300 mb-4">{role}</p>
        <div className="flex justify-center space-x-4">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 transition-colors"
          >
            <Linkedin className="h-5 w-5 text-cyan-400" />
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 transition-colors"
          >
            <Github className="h-5 w-5 text-cyan-400" />
          </a>
        </div>
      </div>
    </div>
  );
}