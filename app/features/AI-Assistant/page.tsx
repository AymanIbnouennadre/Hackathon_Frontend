"use client"

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Languages, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

    try {
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
    <div className="relative flex flex-col items-center justify-between h-full">
      {/* Bouton de changement de langue */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/60"
          onClick={toggleLanguage}
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">{language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}</span>
        </Button>
        <span className="absolute -bottom-8 right-0 text-xs font-medium text-blue-100/90 tracking-wide">
          {language === "fr" ? "FR" : "عربي"}
        </span>
      </div>

      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 mb-8 z-10 tracking-tight drop-shadow-md">
        {language === "fr" ? "Assistant Vocal" : "المساعد الصوتي"}
      </h2>

      <div className="relative flex-1 flex items-center justify-center w-full z-10">
        <div className="relative h-56 w-56">
          {/* Glowing background effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          {/* Bubble animation container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main bubble with breathing effect */}
            <motion.div
              className={`rounded-full bg-gradient-to-br ${
                isSpeaking ? "from-blue-400/95 to-indigo-500/95" : "from-cyan-500/95 to-blue-600/95"
              } shadow-2xl shadow-blue-500/40`}
              style={{ width: 140, height: 140 }}
              animate={
                isSpeaking
                  ? {
                      opacity: [0.8, 1, 0.8],
                      borderRadius: ["50%", "45% 55% 50% 50%", "55% 45% 50% 50%", "50%"],
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 25px rgba(59, 130, 246, 0.6)",
                        "0 0 50px rgba(99, 102, 241, 0.8)",
                        "0 0 25px rgba(59, 130, 246, 0.6)",
                      ],
                    }
                  : isListening
                    ? {
                        opacity: [0.9, 1, 0.9],
                        borderRadius: "50%",
                        scale: [1, 1.04, 1],
                        boxShadow: [
                          "0 0 20px rgba(34, 211, 238, 0.5)",
                          "0 0 40px rgba(59, 130, 246, 0.7)",
                          "0 0 20px rgba(34, 211, 238, 0.5)",
                        ],
                      }
                    : {
                        opacity: 0.9,
                        borderRadius: "50%",
                        scale: [1, 1.02, 1], // Breathing effect
                        boxShadow: [
                          "0 0 20px rgba(34, 211, 238, 0.5)",
                          "0 0 40px rgba(59, 130, 246, 0.7)",
                          "0 0 20px rgba(34, 211, 238, 0.5)",
                        ],
                      }
              }
              transition={{
                duration: isSpeaking ? 2 : 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Pulsating effect when speaking */}
            {isSpeaking && (
              <motion.div
                className="absolute rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-500/30"
                style={{ width: 140, height: 140 }}
                animate={{
                  opacity: [0.6, 0],
                  scale: [1, 1.3],
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.4)",
                    "0 0 40px rgba(99, 102, 241, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                  delay: 0.2,
                }}
              />
            )}

            {/* Listening wave effect */}
            {isListening && (
              <motion.div
                className="absolute rounded-full bg-cyan-400/20"
                initial={{ width: 160, height: 160 }}
                animate={{
                  width: [160, 200, 160],
                  height: [160, 200, 160],
                  opacity: [0.6, 0.3, 0.6],
                  boxShadow: [
                    "0 0 15px rgba(34, 211, 238, 0.4)",
                    "0 0 30px rgba(59, 130, 246, 0.6)",
                    "0 0 15px rgba(34, 211, 238, 0.4)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Processing dots */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`processing-${i}`}
                    className="absolute rounded-full bg-blue-300/90"
                    style={{
                      width: 8,
                      height: 8,
                      transform: `rotate(${i * 45}deg) translate(60px)`,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.12 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center z-10 mb-6">
        <Button
          variant="outline"
          size="lg"
          className={`h-16 w-16 rounded-full border-2 backdrop-blur-md bg-opacity-30 ${
            isListening
              ? "bg-gradient-to-br from-cyan-400/80 to-blue-500/80 border-cyan-300/60 hover:from-cyan-500 hover:to-blue-600 shadow-2xl shadow-cyan-400/50 hover:shadow-cyan-500/70"
              : isSpeaking
                ? "bg-gradient-to-br from-indigo-400/80 to-blue-500/80 border-indigo-300/60 hover:from-indigo-500 hover:to-blue-600 shadow-2xl shadow-indigo-400/50 hover:shadow-indigo-500/70"
                : "bg-gradient-to-br from-blue-500/80 to-cyan-600/80 border-blue-300/60 hover:from-blue-600 hover:to-cyan-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/70"
          } text-white hover:scale-110 transition-all duration-300 ease-out animate-pulse-subtle group relative overflow-hidden`}
          onClick={toggleListening}
          disabled={isProcessing}
        >
          {/* Ripple effect on click */}
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 2, opacity: 0.5 }}
            transition={{ duration: 0.5 }}
          />
          {isListening ? (
            <MicOff className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
          ) : isSpeaking ? (
            <Pause className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <Mic className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
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

      <div className="text-center text-base font-medium text-blue-100/90 mt-4 z-10 tracking-wide drop-shadow-sm">
        {isListening && (language === "fr" ? "J'écoute..." : "أنا أستمع...")}
        {isProcessing && (language === "fr" ? "Je réfléchis..." : "أنا أفكر...")}
        {isSpeaking && (language === "fr" ? "Je parle..." : "أنا أتحدث...")}
        {!isListening &&
          !isProcessing &&
          !isSpeaking &&
          (language === "fr" ? "Appuyez sur le micro pour parler" : "اضغط على الميكروفون للتحدث")}
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: radial-gradient(circle at center, #1a1a4a, #0a0f2b);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        body::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          opacity: 0.6;
          animation: subtle-pulse 10s infinite ease-in-out;
          pointer-events: none;
        }
        body::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0.5px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          opacity: 0.8;
          animation: particle-shift 15s infinite linear;
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        @keyframes particle-shift {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Page principale AIAssistantPage
export default function AIAssistantPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="
          relative
          w-full
          max-w-[600px]
          h-[540px] // Reduced height to fit within the viewport
          p-8
          rounded-3xl
          shadow-2xl
          bg-gradient-to-br from-gray-900/90 to-blue-950/90
          backdrop-blur-xl
          border border-blue-500/30
          overflow-hidden
          transition-all
          duration-500
          hover:shadow-blue-500/40
          mt-[-80px] // Shifted further upwards to ensure the bottom is visible
        "
        style={{
          borderImage: "linear-gradient(to right, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.6), rgba(59, 130, 246, 0.6)) 1",
        }}
        animate={{
          boxShadow: [
            "0 0 30px rgba(59, 130, 246, 0.3)",
            "0 0 50px rgba(99, 102, 241, 0.4)",
            "0 0 30px rgba(59, 130, 246, 0.3)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <VoiceAssistant />
      </motion.div>
    </div>
  );
}