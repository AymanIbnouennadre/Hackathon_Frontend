"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, ArrowLeft, ArrowRightCircle, RefreshCw, Volume2, Trophy, Star, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { questions as frenchQuestions } from "@/public/js/quiz_fr";
import { questions as arabicQuestions } from "@/public/js/quiz_ar";
import confetti from "canvas-confetti";

const questionsFr = frenchQuestions.fr;
const questionsAr = arabicQuestions.ar;

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[i], shuffled[j]];
  }
  return shuffled;
};

export default function QuizPage() {
  const [language, setLanguage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [apiFeedback, setApiFeedback] = useState("");
  const [displayedApiFeedback, setDisplayedApiFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [treasures, setTreasures] = useState(0);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      winAudioRef.current = new Audio("/win.wav");
      loseAudioRef.current = new Audio("/lost.wav");
    }
  }, []);

  const originalQuestions = language === "french" ? questionsFr : questionsAr;

  useEffect(() => {
    if (language) {
      setIsLoading(true);
      const shuffled = shuffleArray(originalQuestions);
      setAvailableQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [language]);

  const currentQuestion = availableQuestions[currentQuestionIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentQuestion) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
      audio.volume = 1;
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setFeedback(language === "french" ? "Erreur : impossible de charger l'audio." : "خطأ: تعذر تحميل الصوت.");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentQuestion, language]);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#00ced1", "#ffd700"],
    });
  };

  useEffect(() => {
    if (feedback) {
      if (feedback.includes("Bravo") || feedback.includes("أحسنت")) {
        launchConfetti();
        winAudioRef.current?.play().catch((error) => console.warn("Erreur son correct :", error));
      } else {
        loseAudioRef.current?.play().catch((error) => console.warn("Erreur son incorrect :", error));
      }
    }
  }, [feedback]);

  useEffect(() => {
    if (apiFeedback) {
      setDisplayedApiFeedback("");
      const cleanedFeedback = apiFeedback.replace(/\n/g, " ");
      let index = 0;
      const interval = setInterval(() => {
        if (index < cleanedFeedback.length) {
          const char = cleanedFeedback[index];
          if (char !== undefined) {
            setDisplayedApiFeedback((prev) => prev + char);
          }
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [apiFeedback]);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setTreasures(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQuizCompleted(false);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.playbackRate = 1.2;
        audioRef.current.play().catch((error) => {
          console.warn("Erreur lecture audio :", error);
          setIsPlaying(false);
          setFeedback(language === "french" ? "Erreur : impossible de jouer l'audio." : "خطأ: لا يمكن تشغيل الصوت.");
        });
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswerSelect = async (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      setFeedback(language === "french" ? "🎉 Bravo, champion !" : "🎉 أحسنت، بطل!");
      setTreasures((prev) => prev + 1);
    } else {
      setFeedback(language === "french" ? "❌ Oups, essaie encore !" : "❌ أوبس، حاول مرة أخرى!");
    }

    const formData = new FormData();
    formData.append("type_exercice", "quiz");
    formData.append("choix_correct", currentQuestion.choices[currentQuestion.correctAnswer]);
    formData.append("choix_patient", currentQuestion.choices[index]);
    formData.append("langue", language === "french" ? "fr" : "ar");

    try {
      const response = await fetch("http://127.0.0.1:8000/feedback_text_generator/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Réponse brute de l'API :", data);

      if (data.feedback && typeof data.feedback === "string") {
        const cleanFeedback = data.feedback
          .trim()
          .replace(/undefined/gi, "")
          .replace(/\s+/g, " ")
          .replace(/(\.\s*)+$/, ".");
        setApiFeedback(cleanFeedback || (language === "french" ? "Feedback indisponible." : "الملاحظات غير متوفرة."));
      } else {
        setApiFeedback(
          language === "french"
            ? "Désolé, je n'ai pas pu générer de feedback."
            : "عذرًا، لم أتمكن من إنشاء ملاحظات."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      setApiFeedback(
        language === "french"
          ? "Erreur lors de la génération du feedback."
          : "خطأ أثناء إنشاء الملاحظات."
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= availableQuestions.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setApiFeedback("");
      setDisplayedApiFeedback("");
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setTreasures(0);
    setAvailableQuestions([]);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQuizCompleted(false);
  };

  const handleRestartQuiz = () => {
    setIsLoading(true);
    const shuffled = shuffleArray(originalQuestions);
    setAvailableQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setTreasures(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQuizCompleted(false);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="relative h-screen w-screen text-white flex flex-col items-center overflow-hidden">
      {/* Badge en haut */}
      <div className="relative z-10 w-full max-w-7xl text-center pt-2">
        <div className="inline-flex items-center justify-center bg-indigo-900/50 px-4 py-2 rounded-full transition-all hover:bg-indigo-800/70">
          <Volume2 className="h-5 w-5 text-cyan-300 mr-2" />
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 font-arial">
            {language === "french" || !language
              ? "Écoutez et apprenez avec notre quiz audio – استمع وتعلم مع اختبارنا الصوتي"
              : "استمع وتعلم مع اختبارنا الصوتي – Écoutez et apprenez avec notre quiz audio"}
          </span>
        </div>

        {/* Quiz Card */}
        {language && (
          <div className="mt-12 flex justify-center">
            <Card className="relative w-full max-w-6xl h-[520px] bg-gradient-to-br from-gray-900 via-indigo-950 to-black border border-indigo-500/50 rounded-xl shadow-lg overflow-hidden">
              {/* Superposition pour la grille et l'effet de pulsation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:40px_40px]"></div>
              </div>
              <CardContent className="p-8 relative z-10">
                {quizCompleted ? (
                  <div className="space-y-4">
                    <Trophy className="h-16 w-16 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white font-arial text-left">
                      {language === "french" ? "Quiz Terminé !" : "انتهى الاختبار!"}
                    </h2>
                    <p className="text-xl text-gray-200 font-arial leading-relaxed text-left">
                      {language === "french"
                        ? `Total des trésors : ${treasures} / ${availableQuestions.length}`
                        : `مجموع الكنوز: ${treasures} / ${availableQuestions.length}`}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handleBackToLanguageChoice}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                      >
                        {language === "french" ? "Choix de langue" : "اختيار اللغة"}
                        <ArrowLeft className="ml-2 h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleRestartQuiz}
                        className="bg-green-600 hover:bg-green-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                      >
                        {language === "french" ? "Refaire le quiz" : "إعادة الاختبار"}
                        <RefreshCw className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="text-left">
                    <p className="text-xl text-gray-200 font-arial">
                      {language === "french" ? "Chargement des questions..." : "جاري تحميل الأسئلة..."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={handleBackToLanguageChoice}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-arial py-2 px-4 rounded-lg"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        {language === "french" ? "Choix de langues" : "العودة لاختيار اللغة"}
                      </Button>
                      <Badge className="bg-yellow-400 hover:bg-yellow-400 text-black text-lg font-arial py-2 px-4">
                        {language === "french" ? `💎 Trésors : ${treasures}` : `كنوز 💎 : ${treasures}`}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl text-gray-200 font-arial mb-4">
                        {language === "french"
                          ? `Question ${currentQuestionIndex + 1} / ${availableQuestions.length}`
                          : `السؤال ${currentQuestionIndex + 1} / ${availableQuestions.length}`}
                      </p>
                    </div>

                    {currentQuestion && (
                      <div className="flex items-center justify-center bg-cyan-500/20 p-4 rounded-lg w-[70%] mx-auto my-4">
                        <Button
                          onClick={handlePlayPause}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max={duration || 1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full mx-4 h-3 bg-gray-600 rounded-lg cursor-pointer accent-orange-500"
                        />
                        <div className="flex items-center gap-2 text-gray-200 font-arial text-lg">
                          <Clock className="h-5 w-5" />
                          <span>{formatTime(currentTime)}</span>
                        </div>
                      </div>
                    )}

                    {!feedback && currentQuestion && (
                      <div className="space-y-6">
                        <p className="text-2xl text-white font-arial text-center leading-relaxed my-6">
                          {language === "french"
                            ? "Écoutez attentivement l’audio et choisissez une réponse :"
                            : "استمع جيدًا للصوت واختر إجابة :"}
                        </p>
                        <div className="flex flex-wrap gap-8 justify-center">
                          {currentQuestion.choices.map((choice, index) => (
                            <Button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className={`bg-purple-600 hover:bg-purple-700 text-white text-4xl font-arial py-7 px-12 rounded-lg transition-all ${
                                selectedAnswer === index ? "bg-purple-500" : ""
                              }`}
                            >
                              {choice}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {feedback && currentQuestion && (
                      <div className={`py-6 px-4 rounded-lg my-3 min-h-[120px] ${
                        feedback.includes("Bravo") || feedback.includes("أحسنت")
                          ? "bg-teal-600/20"
                          : "bg-red-600/20"
                      }`}>
                        <div className={`flex ${language === "french" ? "flex-row" : "flex-row-reverse"} items-center justify-between gap-4`}>
                          <div className={`flex flex-col ${language === "french" ? "items-start" : "items-end"} gap-2`}>
                            <div className={`flex ${language === "french" ? "flex-row" : "flex-row-reverse"} items-center gap-2`}>
                              {feedback.includes("Bravo") || feedback.includes("أحسنت") ? (
                                <Star className="h-8 w-8 text-teal-400" />
                              ) : (
                                <XCircle className="h-8 w-8 text-red-400" />
                              )}
                              <p className={`text-2xl font-bold text-gray-200 font-arial ${language === "french" ? "text-left" : "text-right"}`}>
                                <span>{language === "french" ? "Ta réponse :" : "إجابتك :"}</span>
                                <span className="ml-1">{currentQuestion.choices[selectedAnswer]}</span>
                              </p>
                            </div>
                            <p className={`text-2xl font-bold text-white font-arial ${language === "french" ? "text-left" : "text-right"}`}>
                              {feedback}
                            </p>
                          </div>
                          <div className={`message-container ${language === "french" ? "flex-row" : "flex-row-reverse"}`}>
                            <div className="profile-pic">
                              <img src="/img/robot.png" alt="Robot Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="message-bubble">
                              <p className={`text-xl text-gray-200 font-mono typewriter ${language === "french" ? "text-left" : "text-right"}`}>
                                {displayedApiFeedback}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-3 mt-2">
                          {feedback.includes("Bravo") || feedback.includes("أحسنت") ? (
                            <Button
                              onClick={handleNextQuestion}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                            >
                              {language === "french" ? "Question suivante" : "السؤال التالي"}
                              <ArrowRightCircle className="ml-2 h-5 w-5" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={handleRetry}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                {language === "french" ? "Réessayer" : "إعادة المحاولة"}
                                <RefreshCw className="ml-2 h-5 w-5" />
                              </Button>
                              <Button
                                onClick={handleNextQuestion}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                {language === "french" ? "Question suivante" : "السؤال التالي"}
                                <ArrowRightCircle className="ml-2 h-5 w-5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Homepage */}
      <main className="relative z-10 w-full max-w-[95vw] flex flex-col items-center justify-start min-h-screen pt-16 pb-8">
        {!language && (
          <div className="flex flex-col items-center justify-start w-full min-h-[80vh] gap-8 pt-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-tajawal leading-tight flex items-center justify-center mb-8">
                <Volume2 className="h-10 w-10 text-pink-400 mr-2" />
                Quiz Audio | اختبار صوتي
              </h1>
              <p className="text-lg text-gray-300 font-inter mb-10 max-w-[90vw] mx-auto">
                ÉCOUTEZ ET CHOISISSEZ LA BONNE RÉPONSE | استمع واختر الإجابة الصحيحة
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  onClick={() => selectLanguage("french")}
                  className="w-52 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-4 text-lg transition-all transform hover:scale-105 shadow-md font-inter"
                >
                  Français
                </Button>
                <Button
                  onClick={() => selectLanguage("arabic")}
                  className="w-52 rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-8 py-4 text-lg font-tajawal transition-all transform hover:scale-105 shadow-md"
                >
                  العربية
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {currentQuestion && !quizCompleted && <audio ref={audioRef} src={currentQuestion.path} />}

      {/* Styles globaux pour le fond */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: linear-gradient(to bottom right, #111827, #1e1b4b, #000000);
        }
        body::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
          opacity: 0.3;
          animation: pulse 5s infinite;
          pointer-events: none;
        }
        body::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 247, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
      `}</style>

      {/* Styles locaux pour l'effet de machine à écrire et la bulle de message */}
      <style jsx>{`
        .typewriter {
          position: relative;
          white-space: pre-wrap;
        }
        .typewriter::after {
          content: '|';
          position: absolute;
          right: 0;
          color: #ffffff;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .message-container {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 400px;
        }
        .profile-pic {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #00d4ff;
          box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
        }
        .message-bubble {
          flex: 1;
          background: linear-gradient(135deg, #00d4ff, #a855f7);
          padding: 12px 16px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3), 0 4px 12px rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </div>
  );
}