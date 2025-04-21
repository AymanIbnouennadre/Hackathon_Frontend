"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Languages, Pause } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Composant VoiceAssistant
function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState<"fr" | "ar">("fr");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation de l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsSpeaking(false);
      URL.revokeObjectURL(audioRef.current?.src || "");
    };
    audioRef.current.onplay = () => {
      setIsSpeaking(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // Fonction pour jouer le message d'accueil
  const playWelcomeMessage = async () => {
    const welcomeMessage =
      language === "fr"
        ? "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
        : "مرحبًا! كيف يمكنني مساعدتك اليوم؟";

    const apiUrl = "http://localhost:8000/gtts_speech/";

    if (!welcomeMessage || welcomeMessage.trim() === "") {
      console.error("Welcome message is empty or invalid");
      return;
    }

    const requestBody = {
      text: welcomeMessage,
      lang: language,
    };

    console.log("Language:", language);
    console.log("Welcome message:", welcomeMessage);
    console.log("Request body:", JSON.stringify(requestBody));

    try {
      // Arrêter l'audio existant avant de charger un nouvel audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.currentTime = 0;
        setIsSpeaking(false);
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.oncanplay = () => {
          audioRef.current?.play().catch((error) => {
            console.error("Error playing welcome message:", error);
          });
        };
      }
    } catch (error) {
      console.error("Error playing welcome message:", error);
    }
  };

  useEffect(() => {
    playWelcomeMessage();
  }, [language]);

  const startListening = async () => {
    try {
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "fr" ? "fr-FR" : "ar-SA";

        recognition.onresult = async (event) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          await sendTextToAPI(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setIsProcessing(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
      } else {
        console.error("SpeechRecognition API not supported");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const sendTextToAPI = async (text: string) => {
    try {
      setIsProcessing(true);
      const endpoint =
        language === "fr"
          ? "http://localhost:8000/assitante_vocal/"
          : "http://localhost:8000/assitante_vocal_ar/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          session_id: "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      setTranscript(data.transcription);
      setResponse(data.response);

      if (data.audio_content) {
        const audioBytes = atob(data.audio_content);
        const audioArray = new Uint8Array(audioBytes.length);
        for (let i = 0; i < audioBytes.length; i++) {
          audioArray[i] = audioBytes.charCodeAt(i);
        }
        const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }
      }
    } catch (error) {
      console.error("Error sending text to API:", error);
      setResponse(
        language === "fr"
          ? "Désolé, je n'ai pas pu traiter votre demande."
          : "آسف، لم أتمكن من معالجة طلبك."
      );
      if (audioRef.current) {
        audioRef.current.src = "";
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current.src = "";
        setIsSpeaking(false);
      }
    } else {
      startListening();
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"));
  };

  return (
    <div>
      {/* Bouton de changement de langue */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full bg-sky-600/70 hover:bg-sky-500 text-sky-100 shadow-lg shadow-sky-500/30"
          onClick={toggleLanguage}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}</span>
        </Button>
        <span className="absolute -bottom-6 right-0 text-xs text-sky-200">{language === "fr" ? "FR" : "عربي"}</span>
      </div>

      <h2 className="text-xl font-medium text-sky-200 mb-8 z-10">
        {language === "fr" ? "Assistant Vocal" : "المساعد الصوتي"}
      </h2>

      <div className="relative flex-1 flex items-center justify-center w-full z-10">
        <div className="relative h-48 w-48">
          {/* Bubble animation container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main bubble with cloud-like effect */}
            <motion.div
              className={`rounded-full ${
                isSpeaking
                  ? "bg-gradient-to-r from-indigo-400 to-cyan-400"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-500"
              } shadow-lg ${isSpeaking ? "shadow-indigo-400/50" : "shadow-cyan-500/50"}`}
              style={{ width: 120, height: 120 }}
              animate={
                isSpeaking
                  ? {
                      opacity: [0.6, 1, 0.6],
                      borderRadius: [
                        "50% 50% 50% 50%",
                        "40% 60% 45% 55%",
                        "60% 40% 55% 45%",
                        "50% 50% 50% 50%",
                      ],
                      rotate: [0, 3, -3, 2, 0],
                      x: [0, 6, -5, 3, 0],
                      y: [0, -5, 4, -3, 0],
                      boxShadow: isSpeaking
                        ? [
                            "0 0 20px rgba(34, 211, 238, 0.4)",
                            "0 0 40px rgba(99, 102, 241, 0.6)",
                            "0 0 20px rgba(34, 211, 238, 0.4)",
                          ]
                        : [
                            "0 0 15px rgba(34, 211, 238, 0.3)",
                            "0 0 30px rgba(99, 102, 241, 0.5)",
                            "0 0 15px rgba(34, 211, 238, 0.3)",
                          ],
                    }
                  : isListening
                    ? {
                        opacity: [0.9, 1, 0.9],
                        borderRadius: "50%",
                        boxShadow: [
                          "0 0 15px rgba(34, 211, 238, 0.3)",
                          "0 0 30px rgba(99, 102, 241, 0.5)",
                          "0 0 15px rgba(34, 211, 238, 0.3)",
                        ],
                      }
                    : {
                        opacity: 0.8,
                        borderRadius: "50%",
                        boxShadow: [
                          "0 0 15px rgba(34, 211, 238, 0.3)",
                          "0 0 30px rgba(99, 102, 241, 0.5)",
                          "0 0 15px rgba(34, 211, 238, 0.3)",
                        ],
                      }
              }
              transition={{
                duration: isSpeaking ? 3 : 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Pulsating effect when speaking */}
            {isSpeaking && (
              <motion.div
                className="absolute rounded-full bg-gradient-to-r from-indigo-400/30 to-cyan-400/30"
                style={{ width: 120, height: 120 }}
                animate={{
                  opacity: [0.6, 0],
                  borderRadius: [
                    "50% 50% 50% 50%",
                    "45% 55% 50% 50%",
                    "55% 45% 50% 50%",
                    "50% 50% 50% 50%",
                  ],
                  boxShadow: [
                    "0 0 15px rgba(34, 211, 238, 0.3)",
                    "0 0 30px rgba(99, 102, 241, 0.5)",
                    "0 0 15px rgba(34, 211, 238, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                  delay: 0.4,
                }}
              />
            )}

            {/* Listening wave effect */}
            {isListening && (
              <motion.div
                className="absolute rounded-full bg-cyan-400/20"
                initial={{ width: 140, height: 140 }}
                animate={{
                  width: [140, 180, 140],
                  height: [140, 180, 140],
                  opacity: [0.6, 0.3, 0.6],
                  boxShadow: [
                    "0 0 15px rgba(99, 102, 241, 0.3)",
                    "0 0 30px rgba(99, 102, 241, 0.5)",
                    "0 0 15px rgba(99, 102, 241, 0.3)",
                  ],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Processing dots */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`processing-${i}`}
                    className="absolute rounded-full bg-cyan-200"
                    style={{
                      width: 8,
                      height: 8,
                      transform: `rotate(${i * 60}deg) translate(60px)`,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.7, 1.3, 0.7] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full text-center mb-8 z-10 h-16"></div>

      <div className="flex items-center justify-center z-10">
        <Button
          variant="outline"
          size="lg"
          className={`h-14 w-14 rounded-full ${
            isListening
            ? "bg-gradient-to-r from-cyan-300 via-cyan-500 to-indigo-400 border-cyan-200 hover:from-cyan-500 hover:via-cyan-700 hover:to-indigo-600 shadow-2xl shadow-cyan-300/60 hover:shadow-cyan-500/80 hover:scale-110 hover:-rotate-2 animate-pulse-flow transition-all duration-700 ease-in-out transform-gpu"
            : isSpeaking
              ? "bg-gradient-to-r from-indigo-300 via-indigo-500 to-cyan-400 border-indigo-200 hover:from-indigo-500 hover:via-indigo-700 hover:to-cyan-600 shadow-2xl shadow-indigo-300/60 hover:shadow-indigo-500/80 hover:scale-110 hover:rotate-2 animate-pulse-flow transition-all duration-700 ease-in-out transform-gpu"
              : "bg-gradient-to-r from-cyan-400 via-cyan-600 to-indigo-500 border-cyan-300 hover:from-cyan-600 hover:via-cyan-800 hover:to-indigo-700 shadow-2xl shadow-cyan-400/60 hover:shadow-cyan-600/80 hover:scale-110 hover:rotate-1 animate-pulse-flow transition-all duration-700 ease-in-out transform-gpu"
          }`}
          onClick={toggleListening}
          disabled={isProcessing}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : isSpeaking ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
          <span className="sr-only">
            {isListening
              ? language === "fr"
                ? "Arrêter l'écoute"
                : "إيقاف الاستماع"
              : isSpeaking
                ? language === "fr"
                  ? "Arrêter de parler"
                  : "توقف عن الكلام"
                : language === "fr"
                  ? "Commencer l'écoute"
                  : "بدء الاستماع"}
          </span>
        </Button>
      </div>

      <div className="text-center text-xs text-cyan-300 mt-4 z-10">
        {isListening && (language === "fr" ? "J'écoute..." : "أنا أستمع...")}
        {isProcessing && (language === "fr" ? "Je réfléchis..." : "أنا أفكر...")}
        {isSpeaking && (language === "fr" ? "Je parle..." : "أنا أتحدث...")}
        {!isListening &&
          !isProcessing &&
          !isSpeaking &&
          (language === "fr" ? "Appuyez sur le micro pour parler" : "اضغط على الميكروفون للتحدث")}
      </div>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: linear-gradient(to bottom right, #0f172a, #1e1b4b, #000000);
        }
        body::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(99, 102, 241, 0.2));
          opacity: 0.4;
          animation: pulse 5s infinite;
          pointer-events: none;
        }
        body::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 247, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

// Page principale AIAssistantPage
export default function AIAssistantPage() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="
          relative
          w-[500px]
          h-[480px]
          p-8
          rounded-2xl
          shadow-xl
          shadow-indigo-500/30
          bg-gradient-to-br from-slate-600/95 to-slate-800/90
          backdrop-blur-md
          overflow-hidden
          transition-all
          duration-300
          hover:shadow-2xl
          hover:scale-[1.02]
          border border-slate-500/20
        "
        style={{
          border: '4px solid transparent',
          borderImage: 'linear-gradient(to right, rgb(34, 211, 238), rgb(99, 102, 241), rgb(34, 211, 238)) 1',
          borderRight: 0,
          borderBottom: 0,
          borderLeft: 0,
          transition: 'border-image 0.3s ease-in-out',
        }}
      >
        <VoiceAssistant />
      </div>
    </div>
  )
}