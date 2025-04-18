import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, BookOpen, Image as ImageIcon, MessageSquare, MessageCircle, BrainCircuit, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden pt-4">
      {/* Fond animé */}
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

      <main className="container mx-auto px-4 pt-4 pb-20 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-3">
            <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">Outils Propulsés par l'IA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Fonctionnalités de DyslexiaCare
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez nos outils d'intelligence artificielle conçus pour accompagner les personnes dyslexiques dans leurs apprentissages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <feature.icon className="h-6 w-6 text-cyan-400 mr-2" />
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.link}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0">
                    Commencer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-12 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} DyslexiaCare. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Speech-to-Text",
    description: "Transformez vos paroles en texte écrit avec une grande précision pour faciliter l'écriture.",
    icon: Mic,
    link: "/features/speech-to-text",
  },
  {
    title: "Text-to-Speech",
    description: "Écoutez vos textes avec des voix naturelles pour une expérience de lecture fluide.",
    icon: BookOpen,
    link: "/features/OCR-TTS",
  },
  {
    title: "Image-to-Text",
    description: "Extrayez facilement le texte des images pour améliorer l'accessibilité et la compréhension.",
    icon: ImageIcon,
    link: "/features/OCR-TTS",
  },
  {
    title: "AI Assistant",
    description: "Bénéficiez d'une aide en temps réel pour la lecture, l'écriture et la compréhension de textes.",
    icon: MessageSquare,
    link: "/features/AI-Assistant",
  },
  {
    title: "Chatbot",
    description: "Interagissez avec un chatbot IA pour un soutien instantané et personnalisé.",
    icon: MessageCircle,
    link: "/features/AI-Chatbot",
  },
  {
    title: "Quiz",
    description: "Testez vos connaissances avec des quiz adaptatifs conçus pour votre apprentissage.",
    icon: BrainCircuit,
    link: "/features/Quiz",
  },
];