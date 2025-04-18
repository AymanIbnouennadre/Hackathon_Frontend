"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Languages } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

// Composant VoiceAssistant
function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [language, setLanguage] = useState<"fr" | "ar">("fr") // État pour la langue

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialisation de l'élément audio
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.onended = () => {
      setIsSpeaking(false)
    }
    audioRef.current.onplay = () => {
      setIsSpeaking(true)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await sendAudioToAPI(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        // Définir la langue pour la reconnaissance vocale
        recognition.lang = language === "fr" ? "fr-FR" : "ar-SA"

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("")
          setTranscript(transcript)
        }

        recognition.start()
      }

      mediaRecorderRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
      setIsProcessing(true)
    }
  }

  const sendAudioToAPI = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append("file", audioBlob, "recording.wav")
      // Ajouter la langue à la requête
      formData.append("language", language)

      // Remplacer par l'URL de votre API FastAPI
      const response = await fetch("http://localhost:8000/assitante_vocal/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Mettre à jour la transcription et la réponse
      if (data.transcription) {
        setTranscript(data.transcription)
      }
      if (data.response) {
        setResponse(data.response)
      }

      // Jouer l'audio renvoyé en base64
      if (data.audio_content) {
        const audioBytes = atob(data.audio_content)
        const audioArray = new Uint8Array(audioBytes.length)
        for (let i = 0; i < audioBytes.length; i++) {
          audioArray[i] = audioBytes.charCodeAt(i)
        }
        const audioBlob = new Blob([audioArray], { type: "audio/mp3" })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error)
          })
        }
      }
    } catch (error) {
      console.error("Error sending audio to API:", error)
      setResponse(language === "fr" ? "Désolé, je n'ai pas pu traiter votre demande." : "آسف، لم أتمكن من معالجة طلبك.")
      if (audioRef.current) {
        audioRef.current.src = ""
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Fonction pour basculer entre les langues
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"))
  }

  return (
    <div >
      <div className="absolut inset-0 bg-gradient-radial from-sky-500/20 via-purple-900/20 to-black z-0" />

      {/* Bouton de changement de langue */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full bg-sky-700/70 hover:bg-sky-600 text-sky-100"
          onClick={toggleLanguage}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}</span>
        </Button>
        <span className="absolute -bottom-6 right-0 text-xs text-sky-300">{language === "fr" ? "FR" : "عربي"}</span>
      </div>

      <h2 className="text-xl font-medium text-sky-300 mb-8 z-10">
        {language === "fr" ? "Assistant Vocal" : "المساعد الصوتي"}
      </h2>

      <div className="relative flex-1 flex items-center justify-center w-full z-10">
        <div className="relative h-48 w-48">
          {/* Siri-like animation container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Siri-like pulsing circle when listening */}
            {isListening && (
              <motion.div
                className="absolute rounded-full bg-sky-500/10"
                initial={{ width: 100, height: 100 }}
                animate={{
                  width: [100, 140, 100],
                  height: [100, 140, 100],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Main Siri orb */}
            <motion.div
              className={`rounded-full ${isListening ? "bg-gradient-to-r from-sky-400 via-purple-500 to-sky-400" : "bg-gradient-to-r from-sky-700 via-purple-800 to-sky-700"}`}
              animate={{
                width: isListening ? [80, 90, 80] : 80,
                height: isListening ? [80, 90, 80] : 80,
                opacity: isListening ? [0.8, 1, 0.8] : 0.7,
              }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Siri wave animation */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="absolute rounded-full border-2 border-sky-400/30"
                    initial={{ width: 80, height: 80, opacity: 0 }}
                    animate={{
                      width: [80, 200],
                      height: [80, 200],
                      opacity: [0.7, 0],
                      borderWidth: [2, 1],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Original animated circles with sky blue added */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={isSpeaking ? "#0ea5e9" : "#0c4a6e"}
              strokeWidth={isSpeaking ? "2" : "1"}
              animate={isSpeaking ? { opacity: [0.3, 0.8, 0.3], strokeWidth: [2, 3, 2] } : { opacity: 0.3 }}
              transition={isSpeaking ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : {}}
            />
            <motion.circle
              cx="100"
              cy="100"
              r="75"
              fill="none"
              stroke={isSpeaking ? "#7e22ce" : "#4c0a77"}
              strokeWidth={isSpeaking ? "2" : "1"}
              animate={isSpeaking ? { opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 3, 2] } : { opacity: 0.4 }}
              transition={
                isSpeaking ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 } : {}
              }
            />
            <motion.circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke={isSpeaking ? "#38bdf8" : "#0369a1"}
              strokeWidth={isSpeaking ? "2" : "1"}
              animate={isSpeaking ? { opacity: [0.5, 1, 0.5], strokeWidth: [2, 3, 2] } : { opacity: 0.5 }}
              transition={
                isSpeaking ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 } : {}
              }
            />
            <motion.circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="#7e22ce"
              strokeWidth="2"
              strokeDasharray="280"
              strokeDashoffset="0"
              animate={{ rotate: [0, 360], strokeDashoffset: [0, -560] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            <motion.circle
              cx="100"
              cy="100"
              r="30"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="190"
              strokeDashoffset="0"
              animate={{ rotate: [360, 0], strokeDashoffset: [0, 380] }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            {isProcessing && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={`processing-${i}`}
                    cx={100 + Math.cos((i / 8) * Math.PI * 2) * 30}
                    cy={100 + Math.sin((i / 8) * Math.PI * 2) * 30}
                    r="3"
                    fill={i % 2 === 0 ? "#7dd3fc" : "#d8b4fe"}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="w-full text-center mb-8 z-10 h-16">
       
      </div>

      <div className="flex items-center justify-center z-10">
        <Button
          variant="outline"
          size="lg"
          className={`h-14 w-14 rounded-full ${
            isListening
              ? "bg-gradient-to-r from-sky-500 to-purple-500 border-sky-400 hover:from-sky-600 hover:to-purple-600"
              : "bg-gradient-to-r from-sky-700 to-purple-700 border-sky-500 hover:from-sky-600 hover:to-purple-600"
          }`}
          onClick={toggleListening}
          disabled={isProcessing || isSpeaking}
        >
          {isListening ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
          <span className="sr-only">
            {isListening
              ? language === "fr"
                ? "Arrêter l'écoute"
                : "إيقاف الاستماع"
              : language === "fr"
                ? "Commencer l'écoute"
                : "بدء الاستماع"}
          </span>
        </Button>
      </div>

      <div className="text-center text-xs text-sky-400 mt-4 z-10">
        {isListening && (language === "fr" ? "J'écoute..." : "أنا أستمع...")}
        {isProcessing && (language === "fr" ? "Je réfléchis..." : "أنا أفكر...")}
        {isSpeaking && (language === "fr" ? "Je parle..." : "أنا أتحدث...")}
        {!isListening &&
          !isProcessing &&
          !isSpeaking &&
          (language === "fr" ? "Appuyez sur le micro pour parler" : "اضغط على الميكروفون للتحدث")}
      </div>
    </div>
  )
}

// Page principale AIAssistantPage
export default function AIAssistantPage() {
  return (
    <div>
    
      <VoiceAssistant />
    </div>
  )
}
