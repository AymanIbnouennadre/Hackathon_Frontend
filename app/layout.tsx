import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ChatBot from "@/components/chat-bot"

export const metadata = {
  title: "DyslexiaCare - AI-Powered Support for Dyslexic Readers",
  description:
    "DyslexiaCare provides AI-powered tools to help dyslexic readers with features like speech-to-text, text-to-speech, quizzes, and more.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  )
}
