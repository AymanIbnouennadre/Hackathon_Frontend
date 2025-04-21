"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Mic, VolumeIcon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import "./chatbot-page.css"

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
    title: "Assistant Chatbot IA",
    supportTitle: "DyslexiaCare AI chatbot",
    inputPlaceholder: "Tapez votre message...",
    listeningPlaceholder: "Écoute en cours...",
    micButtonTitle: "Commencer l'entrée vocale",
    micButtonTitleActive: "Arrêter l'écoute",
    sendButtonTitle: "Envoyer le message",
    speakButtonTitle: "Lire à haute voix",
    errorPrefix: "Erreur : ",
    ttsErrorPrefix: "Erreur de synthèse vocale : ",
    voiceEnabled: "Commandes vocales activées",
    switchToArabic: "العربية",
  },
  ar: {
    greeting: "مرحبًا! كيف يمكنني مساعدتك في القراءة والكتابة اليوم؟",
    title: "مساعد الدردشة الذكي",
    supportTitle: "دعم ديسليكسيا كير",
    inputPlaceholder: "اكتب رسالتك...",
    listeningPlaceholder: "جاري الاستماع...",
    micButtonTitle: "بدء الإدخال الصوتي",
    micButtonTitleActive: "إيقاف الاستماع",
    sendButtonTitle: "إرسال الرسالة",
    speakButtonTitle: "قراءة بصوت عالٍ",
    errorPrefix: "خطأ: ",
    ttsErrorPrefix: "خطأ في تحويل النص إلى كلام: ",
    voiceEnabled: "الأوامر الصوتية مفعلة",
    switchToFrench: "Français",
  },
}

export default function ChatBot() {
  const [language, setLanguage] = useState<Language>("fr")
  const [currentDate, setCurrentDate] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: translations.fr.greeting,
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

  // Update date when language changes
  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    const formattedDate = date.toLocaleDateString(language === "fr" ? "fr-FR" : "ar-SA", options)
    setCurrentDate(formattedDate)
  }, [language])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "ar" : "fr"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

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
        body: JSON.stringify({ text }),
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
        body: JSON.stringify({ text }),
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

  return (
    <div className={cn("chatbot-wrapper", language === "ar" && "rtl")}>
      {/* Chat Window */}
      <div className="chat-window">
        {/* Chat Header */}
        <div className="chat-window-header">
          <div className="chat-header-content">
            <h3 className="font-medium text-white">{t.supportTitle}</h3>
            <div className="text-sm text-white/70">
              <span className="chat-date" aria-live="polite">{currentDate}</span> • {t.voiceEnabled}
            </div>
          </div>
          <button
            className={cn("language-toggle", language === "ar" && "language-toggle-rtl")}
            onClick={toggleLanguage}
            aria-label={language === "fr" ? "Passer à l'arabe" : "التبديل إلى الفرنسية"}
          >
            <Globe className="h-4 w-4" />
            {language === "fr" ? translations.fr.switchToArabic : translations.ar.switchToFrench}
          </button>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "chat-message",
                message.sender === "user"
                  ? cn("chat-message-user", language === "ar" && "chat-message-user-rtl")
                  : cn("chat-message-bot", language === "ar" && "chat-message-bot-rtl"),
              )}
            >
              <div className="chat-message-content">{message.content}</div>
              <div className={cn("chat-message-footer", language === "ar" && "chat-message-footer-rtl")}>
                <div className="chat-message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {message.sender === "bot" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="chat-message-speak"
                    onClick={() =>
                      language === "fr" ? speakTextInFrench(message.content) : speakTextInArabic(message.content)
                    }
                    title={t.speakButtonTitle}
                  >
                    <VolumeIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className={cn("chat-loading", language === "ar" && "chat-loading-rtl")}>
              <div className={cn("dot-typing", language === "ar" && "dot-typing-rtl")}></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className={cn("chat-input-area", language === "ar" && "chat-input-area-rtl")}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isListening ? t.listeningPlaceholder : t.inputPlaceholder}
            className="chat-input"
            disabled={isLoading || isListening}
            aria-label="Message du chat"
            dir={language === "ar" ? "rtl" : "ltr"}
          />
          <Button
            type="button"
            size="icon"
            className={cn("chat-mic-button", isListening ? "chat-mic-active" : "")}
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
            title={isListening ? t.micButtonTitleActive : t.micButtonTitle}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="chat-send-button"
            title={t.sendButtonTitle}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}