import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background (optionnel) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] animate-pulse" />
          <div
            className="absolute top-3/4 left-2/3 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      {/* Navbar designée */}
      <header className="bg-gradient-to-b from-gray-900 to-black border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <BrainCircuit className="h-6 w-6 text-cyan-400" />
                <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-sm" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                DyslexiaCare
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</Link>
              <Link href="/features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</Link>
              <Link href="/features/AI-Assistant" className="text-gray-300 hover:text-cyan-400 transition-colors">AI Assistant</Link>
              <Link href="/features/AI-Chatbot" className="text-gray-300 hover:text-cyan-400 transition-colors">Chatbot</Link>
              <Link href="/features/OCR-TTS" className="text-gray-300 hover:text-cyan-400 transition-colors">OCR-TTS</Link>
              <Link href="/features/Quiz" className="text-gray-300 hover:text-cyan-400 transition-colors">Quiz</Link>
              <Link href="/features/speech-to-text" className="text-gray-300 hover:text-cyan-400 transition-colors">Speech-to-Text</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu spécifique à chaque feature */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
