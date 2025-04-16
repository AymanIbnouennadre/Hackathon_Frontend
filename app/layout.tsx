import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "DyslexiaCare - AI-Powered Support for Dyslexic Readers",
  description:
    "DyslexiaCare provides AI-powered tools to help dyslexic readers with features like speech-to-text, text-to-speech, quizzes, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'