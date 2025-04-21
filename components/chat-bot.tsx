"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Mic, VolumeIcon, Globe, X, Minimize, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// Embedded CSS styles with unique class names to avoid conflicts
const styles = `
/* Base styles */
:root {
  --dyslexia-teal: #22b8cf;
  --dyslexia-blue: #3b82f6;
  --dyslexia-purple: #9333ea;
  --dyslexia-dark: #0a101f;
  --dyslexia-darkblue: #111827;
  --dyslexia-border-color: rgba(34, 184, 207, 0.3);
  --dyslexia-gradient: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
}

/* RTL Support */
.dyslexia-bot-rtl {
  direction: rtl;
  text-align: right;
}

/* Typing animation for the chatbot */
.dyslexia-bot-dot-typing {
  position: relative;
  left: -9999px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
  color: white;
  box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  animation: dyslexia-bot-dot-typing 1.5s infinite linear;
}

.dyslexia-bot-dot-typing-rtl {
  left: auto;
  right: -9999px;
  box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  animation: dyslexia-bot-dot-typing-rtl 1.5s infinite linear;
}

@keyframes dyslexia-bot-dot-typing {
  0% {
    box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  }
  16.667% {
    box-shadow: 9984px -5px 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  }
  33.333% {
    box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  }
  50% {
    box-shadow: 9984px 0 0 0 white, 9999px -5px 0 0 white, 10014px 0 0 0 white;
  }
  66.667% {
    box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  }
  83.333% {
    box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px -5px 0 0 white;
  }
  100% {
    box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
  }
}

@keyframes dyslexia-bot-dot-typing-rtl {
  0% {
    box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  }
  16.667% {
    box-shadow: -9984px -5px 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  }
  33.333% {
    box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  }
  50% {
    box-shadow: -9984px 0 0 0 white, -9999px -5px 0 0 white, -10014px 0 0 0 white;
  }
  66.667% {
    box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  }
  83.333% {
    box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px -5px 0 0 white;
  }
  100% {
    box-shadow: -9984px 0 0 0 white, -9999px 0 0 0 white, -10014px 0 0 0 white;
  }
}

/* Floating Window */
.dyslexia-bot-window {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 24rem;
  max-width: calc(100vw - 3rem);
  height: 32rem;
  max-height: calc(100vh - 7rem);
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  overflow: hidden;
  background-color: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: 50;
  animation: dyslexia-bot-slideUp 0.5s ease-out;
}

@keyframes dyslexia-bot-slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dyslexia-bot-window::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--dyslexia-gradient);
  z-index: 1;
}

.dyslexia-bot-rtl .dyslexia-bot-window {
  right: auto;
  left: 1.5rem;
}

.dyslexia-bot-window-embedded {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  overflow: hidden;
  background-color: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.dyslexia-bot-window-embedded::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--dyslexia-gradient);
  z-index: 1;
}

/* Header */
.dyslexia-bot-header {
  background-color: rgba(15, 23, 42, 0.8);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.dyslexia-bot-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.1) 80%,
    transparent 100%
  );
}

/* Language Toggle */
.dyslexia-bot-language-toggle {
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dyslexia-bot-language-toggle:hover {
  background-color: rgba(51, 65, 85, 0.8);
  transform: translateY(-2px);
}

/* Control Buttons */
.dyslexia-bot-minimize,
.dyslexia-bot-close {
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.dyslexia-bot-minimize:hover,
.dyslexia-bot-close:hover {
  background-color: rgba(51, 65, 85, 0.8);
  transform: translateY(-2px);
}

/* Messages Area */
.dyslexia-bot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-image: radial-gradient(circle at 10% 90%, rgba(6, 182, 212, 0.03) 0%, transparent 30%),
    radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.03) 0%, transparent 30%);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.dyslexia-bot-messages::-webkit-scrollbar {
  width: 6px;
}

.dyslexia-bot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.dyslexia-bot-messages::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Message Bubbles */
.dyslexia-bot-message {
  max-width: 80%;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  position: relative;
  animation: dyslexia-bot-fadeIn 0.3s ease-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}

@keyframes dyslexia-bot-fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dyslexia-bot-message-user {
  align-self: flex-end;
  background: var(--dyslexia-gradient);
  color: white;
  border-bottom-right-radius: 0.25rem;
  margin-left: 2rem;
}

.dyslexia-bot-message-user-rtl {
  border-bottom-right-radius: 1.25rem;
  border-bottom-left-radius: 0.25rem;
  margin-left: 0;
  margin-right: 2rem;
}

.dyslexia-bot-message-bot {
  align-self: flex-start;
  background-color: rgba(51, 65, 85, 0.8);
  color: white;
  border-bottom-left-radius: 0.25rem;
  margin-right: 2rem;
  border-left: 3px solid #06b6d4;
}

.dyslexia-bot-message-bot-rtl {
  border-bottom-left-radius: 1.25rem;
  border-bottom-right-radius: 0.25rem;
  margin-right: 0;
  margin-left: 2rem;
  border-left: none;
  border-right: 3px solid #06b6d4;
}

.dyslexia-bot-message-content {
  line-height: 1.6;
  word-break: break-word;
  font-size: 1rem;
}

.dyslexia-bot-message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.dyslexia-bot-message-footer-rtl {
  flex-direction: row-reverse;
}

.dyslexia-bot-message-time {
  color: rgba(255, 255, 255, 0.7);
}

.dyslexia-bot-message-speak {
  color: rgba(255, 255, 255, 0.7);
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
  transition: all 0.2s;
  border-radius: 50%;
}

.dyslexia-bot-message-speak:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* Loading Animation */
.dyslexia-bot-loading {
  align-self: flex-start;
  padding: 0.75rem 1.25rem;
  background-color: rgba(51, 65, 85, 0.8);
  border-radius: 1rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dyslexia-bot-loading-rtl {
  align-self: flex-end;
}

/* Input Area */
.dyslexia-bot-input-area {
  display: flex;
  padding: 1.25rem 1.5rem;
  background-color: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.75rem;
  position: relative;
}

.dyslexia-bot-input-area::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.1) 80%,
    transparent 100%
  );
}

.dyslexia-bot-input-area-rtl {
  flex-direction: row-reverse;
}

.dyslexia-bot-input {
  flex: 1;
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.875rem 1.25rem;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dyslexia-bot-input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
}

.dyslexia-bot-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Mic Button */
.dyslexia-bot-mic-button {
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
  border-radius: 1rem;
  height: 2.75rem;
  width: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dyslexia-bot-mic-button:hover {
  background-color: rgba(51, 65, 85, 0.8);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dyslexia-bot-mic-active {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
  animation: dyslexia-bot-pulse 1.5s infinite;
}

@keyframes dyslexia-bot-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Send Button */
.dyslexia-bot-send-button {
  background: var(--dyslexia-gradient);
  color: white;
  border: none;
  transition: all 0.2s;
  border-radius: 1rem;
  height: 2.75rem;
  width: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dyslexia-bot-send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dyslexia-bot-send-button:disabled {
  background: rgba(51, 65, 85, 0.8);
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Floating Button */
.dyslexia-bot-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background: var(--dyslexia-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  border: none;
  transition: all 0.3s ease;
  z-index: 50;
}

.dyslexia-bot-rtl .dyslexia-bot-button {
  right: auto;
  left: 1.5rem;
}

.dyslexia-bot-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.dyslexia-bot-button-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .dyslexia-bot-window {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .dyslexia-bot-rtl .dyslexia-bot-window {
    left: 0;
    right: auto;
  }

  .dyslexia-bot-header {
    border-radius: 0;
  }

  .dyslexia-bot-button {
    bottom: 1rem;
    right: 1rem;
  }

  .dyslexia-bot-rtl .dyslexia-bot-button {
    right: auto;
    left: 1rem;
  }
}

@media (max-width: 480px) {
  .dyslexia-bot-window {
    height: 500px;
    border-radius: 0.75rem;
  }

  .dyslexia-bot-window-header,
  .dyslexia-bot-input-area {
    padding: 1rem;
  }

  .dyslexia-bot-messages {
    padding: 1rem;
  }

  .dyslexia-bot-message {
    padding: 0.75rem 1rem;
  }

  .dyslexia-bot-input {
    padding: 0.75rem 1rem;
  }

  .dyslexia-bot-mic-button,
  .dyslexia-bot-send-button {
    height: 2.5rem;
    width: 2.5rem;
  }
}
`

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type Language = "fr" | "ar"

// Voice recognition (speech to text)
const useVoiceRecognition = (language: Language) => {
  const recognitionRef = useRef<any>(null)

  const startListening = (onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language === "fr" ? "fr-FR" : "ar-SA"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onResult(text)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  return { startListening, stopListening }
}

// Translations for UI text
const translations = {
  fr: {
    greeting: "Bonjour ! Comment puis-je vous aider avec votre lecture et votre écriture aujourd'hui ?",
    title: "DyslexiaCare AI chatbot",
    placeholder: "Tapez votre message...",
    listeningPlaceholder: "Écoute en cours...",
    send: "Envoyer",
    micStart: "Commencer l'entrée vocale",
    micStop: "Arrêter l'écoute",
    speak: "Lire à haute voix",
    errorPrefix: "Erreur : ",
    ttsErrorPrefix: "Erreur de synthèse vocale : ",
    switchToArabic: "العربية",
    minimize: "Réduire",
    maximize: "Agrandir",
    close: "Fermer",
    voiceEnabled: "Commandes vocales activées",
  },
  ar: {
    greeting: "مرحبًا! كيف يمكنني مساعدتك في القراءة والكتابة اليوم؟",
    title: "دعم ديسليكسيا كير",
    placeholder: "اكتب رسالتك...",
    listeningPlaceholder: "جاري الاستماع...",
    send: "إرسال",
    micStart: "بدء الإدخال الصوتي",
    micStop: "إيقاف الاستماع",
    speak: "قراءة بصوت عالٍ",
    errorPrefix: "خطأ: ",
    ttsErrorPrefix: "خطأ في تحويل النص إلى كلام: ",
    switchToFrench: "Français",
    minimize: "تصغير",
    maximize: "تكبير",
    close: "إغلاق",
    voiceEnabled: "الأوامر الصوتية مفعلة",
  },
}

interface ChatBotProps {
  embedded?: boolean
}

export default function ChatBot({ embedded = false }: ChatBotProps) {
  // Inject CSS styles
  useEffect(() => {
    // Create style element if it doesn't exist
    const styleId = "dyslexia-bot-styles"
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style")
      styleElement.id = styleId
      styleElement.textContent = styles
      document.head.appendChild(styleElement)

      // Cleanup on unmount
      return () => {
        const element = document.getElementById(styleId)
        if (element) {
          element.remove()
        }
      }
    }
  }, [])

  const [language, setLanguage] = useState<Language>("fr")
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: translations[language].greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { startListening, stopListening } = useVoiceRecognition(language)

  // Reset messages when language changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: language === "fr" ? translations.fr.greeting : translations.ar.greeting,
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  }, [language])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"))
  }

  const toggleChatWindow = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Stop voice recording if active
    if (isListening) {
      stopListening()
      setIsListening(false)
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Use different endpoint based on language
      const endpoint =
        language === "fr" ? "http://127.0.0.1:8000/assitante_physique/" : "http://127.0.0.1:8000/assitante_physique/"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong")
      }

      const botMessage = data.response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botMessage,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])

      // Auto-play bot response with appropriate language
      if (language === "fr") {
        await speakTextInFrench(botMessage)
      } else {
        await speakTextInArabic(botMessage)
      }
    } catch (error: any) {
      console.error("Error sending message:", error)
      const errorPrefix = language === "fr" ? translations.fr.errorPrefix : translations.ar.errorPrefix
      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        content: `${errorPrefix}${error.message}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const speakTextInFrench = async (text: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/convert-text-to-speechFR/?text=" + encodeURIComponent(text), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Text-to-speech API failed.")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
      audio.onended = () => URL.revokeObjectURL(audioUrl)
    } catch (error: any) {
      console.error("Error using text-to-speech:", error)
      const errorResponse: Message = {
        id: Date.now().toString(),
        content: `${translations.fr.ttsErrorPrefix}${error.message}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }

  const speakTextInArabic = async (text: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/convert-text-to-speechAR/?text=" + encodeURIComponent(text), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Text-to-speech API failed.")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
      audio.onended = () => URL.revokeObjectURL(audioUrl)
    } catch (error: any) {
      console.error("Error using text-to-speech:", error)
      const errorResponse: Message = {
        id: Date.now().toString(),
        content: `${translations.ar.ttsErrorPrefix}${error.message}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }

  // Get current translations based on selected language
  const t = language === "fr" ? translations.fr : translations.ar

  if (embedded) {
    return (
      <div className={cn("dyslexia-bot-window-embedded", language === "ar" && "dyslexia-bot-rtl")}>
        {/* Chat Header */}
        <div className="dyslexia-bot-header">
          <h3 className="font-medium text-white">{t.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="dyslexia-bot-language-toggle"
              aria-label={language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === "fr" ? "Arabic" : "Français"}
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="dyslexia-bot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "dyslexia-bot-message",
                message.sender === "user"
                  ? cn("dyslexia-bot-message-user", language === "ar" && "dyslexia-bot-message-user-rtl")
                  : cn("dyslexia-bot-message-bot", language === "ar" && "dyslexia-bot-message-bot-rtl"),
              )}
            >
              <div className="dyslexia-bot-message-content">{message.content}</div>
              <div
                className={cn("dyslexia-bot-message-footer", language === "ar" && "dyslexia-bot-message-footer-rtl")}
              >
                <div className="dyslexia-bot-message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {message.sender === "bot" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="dyslexia-bot-message-speak"
                    onClick={() =>
                      language === "fr" ? speakTextInFrench(message.content) : speakTextInArabic(message.content)
                    }
                    title={t.speak}
                  >
                    <VolumeIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className={cn("dyslexia-bot-loading", language === "ar" && "dyslexia-bot-loading-rtl")}>
              <div className={cn("dyslexia-bot-dot-typing", language === "ar" && "dyslexia-bot-dot-typing-rtl")}></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className={cn("dyslexia-bot-input-area", language === "ar" && "dyslexia-bot-input-area-rtl")}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isListening ? t.listeningPlaceholder : t.placeholder}
            className="dyslexia-bot-input"
            disabled={isLoading || isListening}
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          <Button
            type="button"
            size="icon"
            className={cn("dyslexia-bot-mic-button", isListening ? "dyslexia-bot-mic-active" : "")}
            onClick={() => {
              if (isListening) {
                stopListening()
                setIsListening(false)
              } else {
                setIsListening(true)
                startListening((text) => {
                  setInputValue(text)
                  setIsListening(false)
                })
              }
            }}
            title={isListening ? t.micStop : t.micStart}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="dyslexia-bot-send-button"
            title={t.send}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    )
  }

  return (
    <>
      {isOpen ? (
        <div className={cn("dyslexia-bot-window", language === "ar" && "dyslexia-bot-rtl")}>
          {/* Chat Header */}
          <div className="dyslexia-bot-header">
            <h3 className="font-medium text-white">{t.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="dyslexia-bot-language-toggle"
                aria-label={language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === "fr" ? "Arabic" : "Français"}
              </button>
              <button onClick={toggleChatWindow} className="dyslexia-bot-close" aria-label={t.close}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="dyslexia-bot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "dyslexia-bot-message",
                  message.sender === "user"
                    ? cn("dyslexia-bot-message-user", language === "ar" && "dyslexia-bot-message-user-rtl")
                    : cn("dyslexia-bot-message-bot", language === "ar" && "dyslexia-bot-message-bot-rtl"),
                )}
              >
                <div className="dyslexia-bot-message-content">{message.content}</div>
                <div
                  className={cn("dyslexia-bot-message-footer", language === "ar" && "dyslexia-bot-message-footer-rtl")}
                >
                  <div className="dyslexia-bot-message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {message.sender === "bot" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="dyslexia-bot-message-speak"
                      onClick={() =>
                        language === "fr" ? speakTextInFrench(message.content) : speakTextInArabic(message.content)
                      }
                      title={t.speak}
                    >
                      <VolumeIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className={cn("dyslexia-bot-loading", language === "ar" && "dyslexia-bot-loading-rtl")}>
                <div
                  className={cn("dyslexia-bot-dot-typing", language === "ar" && "dyslexia-bot-dot-typing-rtl")}
                ></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className={cn("dyslexia-bot-input-area", language === "ar" && "dyslexia-bot-input-area-rtl")}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={isListening ? t.listeningPlaceholder : t.placeholder}
              className="dyslexia-bot-input"
              disabled={isLoading || isListening}
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            <Button
              type="button"
              size="icon"
              className={cn("dyslexia-bot-mic-button", isListening ? "dyslexia-bot-mic-active" : "")}
              onClick={() => {
                if (isListening) {
                  stopListening()
                  setIsListening(false)
                } else {
                  setIsListening(true)
                  startListening((text) => {
                    setInputValue(text)
                    setIsListening(false)
                  })
                }
              }}
              title={isListening ? t.micStop : t.micStart}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputValue.trim()}
              className="dyslexia-bot-send-button"
              title={t.send}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      ) : (
        <button onClick={toggleChatWindow} className="dyslexia-bot-button" aria-label={t.maximize}>
          <div className="dyslexia-bot-button-inner">
            <MessageSquare className="h-6 w-6" />
          </div>
        </button>
      )}
    </>
  )
}
