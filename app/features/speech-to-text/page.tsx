"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Play, Pause, CheckCircle, XCircle, ArrowLeft, ArrowRightCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SpeechToTextPage() {
  const frenchWords = [
    "Ballon", "Maman", "Salade", "Robot", "Vélo", "Cargo", "Canapé", "Citron",
    "Couverture", "Canicule", "Trompette", "Ordinateur", "Xylophone", "Pyramide",
    "Miroir", "Bouteille", "Chaussure", "Tasse", "Zèbre", "Mouche", "Nager", "Lire",
    "Sauter", "Dormir", "Crayon", "Lavabo", "Montre", "Veste", "Chien", "Carton"
  ];

  const arabicWords = [
    "مدرسه", "مقص", "سبوره", "حقيبه", "طاوله", "نافذه", "هاتف", "قطه",
    "سياره", "قطار", "جمل", "سمكه", "زهره", "عصفور", "خبز", "بيضه",
    "موزه", "نظارات", "مفتاح", "كرسي", "حصان", "أرنب", "مظله", "كتاب",
    "كره", "طائره", "ساعه", "سكين", "حذاء", "فرشاه"
  ];

  const [language, setLanguage] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [apiFeedback, setApiFeedback] = useState("");
  const [displayedApiFeedback, setDisplayedApiFeedback] = useState("");
  const [feedbackAudioURL, setFeedbackAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFeedbackAudioPlaying, setIsFeedbackAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isTranscribed, setIsTranscribed] = useState(false);
  const [isFeedbackReady, setIsFeedbackReady] = useState(false);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const feedbackAudioRef = useRef(null);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioURL) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  useEffect(() => {
    if (apiFeedback && isFeedbackReady) {
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
  }, [apiFeedback, isFeedbackReady]);

  useEffect(() => {
    if (feedbackAudioURL && isFeedbackReady) {
      console.log("Démarrage lecture audio :", feedbackAudioURL);
      feedbackAudioRef.current = new Audio(feedbackAudioURL);
      feedbackAudioRef.current
        .play()
        .then(() => setIsFeedbackAudioPlaying(true))
        .catch((error) => {
          console.warn("Erreur lecture audio feedback :", error);
          setIsFeedbackAudioPlaying(false);
          setFeedback(
            language === "french"
              ? "Erreur : interaction requise pour jouer le son."
              : "خطأ: التفاعل مطلوب لتشغيل الصوت."
          );
        });

      feedbackAudioRef.current.addEventListener("ended", () => {
        setIsFeedbackAudioPlaying(false);
      });

      return () => {
        if (feedbackAudioRef.current) {
          feedbackAudioRef.current.pause();
          feedbackAudioRef.current = null;
        }
        if (feedbackAudioURL) {
          URL.revokeObjectURL(feedbackAudioURL);
          setFeedbackAudioURL(null);
        }
      };
    }
  }, [feedbackAudioURL, isFeedbackReady, language]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }
    };
  }, []);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setFeedbackAudioURL(null);
    setRecordedAudio(null);
    setAudioURL(null);
    setIsLoading(false);
    setCorrectCount(0);
    setUsedWords([]);
    setIsFinished(false);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
    setIsFeedbackAudioPlaying(false);

    const words = lang === "french" ? frenchWords : arabicWords;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUsedWords([randomWord]);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscribedText("");
      setIsTranscribed(false);
      setFeedback("");
      setApiFeedback("");
      setDisplayedApiFeedback("");
      setFeedbackAudioURL(null);
      setIsFeedbackReady(false);
      setIsFeedbackAudioPlaying(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      const audioChunks = [];
      mediaRecorder.current.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setRecordedAudio(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.current.start();

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error(
          language === "french"
            ? "API de reconnaissance vocale non supportée dans ce navigateur."
            : "واجهة برمجة التعرف على الصوت غير مدعومة في هذا المتصفح."
        );
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = language === "french" ? "fr-FR" : "ar";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcribed = event.results[0][0].transcript;
          setTranscribedText(transcribed);
        } else {
          setTranscribedText("");
          setFeedback(
            language === "french"
              ? "Aucun texte transcrit par l'API de reconnaissance vocale."
              : "لم يتم استخراج أي نص بواسطة واجهة التعرف على الصوت."
          );
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Erreur SpeechRecognition :", event.error, event);
        setFeedback(
          language === "french"
            ? `Erreur de reconnaissance vocale : ${event.error}`
            : `خطأ في التعرف الصوتي: ${event.error}`
        );
        setTranscribedText(
          language === "french"
            ? "Erreur lors de la transcription."
            : "خطأ أثناء النسخ."
        );
      };

      recognitionRef.current.onend = () => {
        console.log("SpeechRecognition terminé.");
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Erreur démarrage enregistrement :", error);
      setFeedback(
        language === "french"
          ? `Erreur : ${error.message || "Accès au microphone refusé."}`
          : `خطأ: ${error.message || "تم رفض الوصول إلى الميكروفون."}`
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      setIsRecording(false);
      mediaRecorder.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendAudioToAPI = async () => {
    if (!recordedAudio) {
      setFeedback(
        language === "french"
          ? "Veuillez enregistrer un audio d’abord."
          : "يرجى تسجيل صوت أولاً."
      );
      return;
    }

    setIsLoading(true);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
    setIsFeedbackAudioPlaying(false);

    try {
      if (!transcribedText || typeof transcribedText !== "string") {
        throw new Error(
          language === "french"
            ? "Aucun texte transcrit par l'API de reconnaissance vocale."
            : "لم يتم استخراج أي نص بواسطة واجهة التعرف على الصوت."
        );
      }

      if (transcribedText.trim() === "") {
        setTranscribedText(
          language === "french"
            ? "Aucun texte transcrit."
            : "لم يتم استخراج أي نص."
        );
        setFeedback(
          language === "french" ? "❌ Aucun texte détecté." : "❌ لم يتم اكتشاف نص."
        );
        setIsLoading(false);
        setIsTranscribed(true);
        setIsFeedbackReady(true);
        return;
      }

      const normalizedTranscribed = transcribedText
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();
      const normalizedCurrentWord = currentWord
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();

      let feedbackText = "";
      if (normalizedTranscribed === normalizedCurrentWord) {
        feedbackText = language === "french" ? "🎉 Correct ! Excellent !" : "🎉 صحيح، أحسنت !";
        setCorrectCount((prev) => prev + 1);
      } else {
        feedbackText = language === "french" ? "❌ Incorrect. Essayez encore." : "❌ خطأ. حاول مرة أخرى.";
      }
      setFeedback(feedbackText);

      const feedbackFormData = new FormData();
      feedbackFormData.append("type_exercice", "prononciation");
      feedbackFormData.append("mot_attendu", currentWord);
      feedbackFormData.append("transcription_patient", transcribedText);
      feedbackFormData.append("langue", language === "french" ? "fr" : "ar");

      console.log("Envoi de la requête au backend pour le feedback...");
      const feedbackResponse = await fetch("http://localhost:8000/feedback_text_generator/", {
        method: "POST",
        body: feedbackFormData,
      });

      if (!feedbackResponse.ok) {
        const errorText = await feedbackResponse.text();
        throw new Error(
          `Erreur API feedback : ${feedbackResponse.status} - ${errorText}`
        );
      }

      const feedbackData = await feedbackResponse.json();
      let cleanFeedback = "";
      if (feedbackData.feedback && typeof feedbackData.feedback === "string") {
        cleanFeedback = feedbackData.feedback
          .trim()
          .replace(/undefined/gi, "")
          .replace(/\s+/g, " ")
          .replace(/(\.\s*)+$/, ".");
        setApiFeedback(cleanFeedback || (language === "french" ? "Feedback indisponible." : "الملاحظات غير متوفرة."));
      } else {
        throw new Error(
          language === "french"
            ? "La réponse de l'API feedback ne contient pas de feedback valide."
            : "استجابة API الملاحظات لا تحتوي على ملاحظات صحيحة."
        );
      }

      const ttsUrl = language === "french"
        ? `http://localhost:8000/convert-text-to-speechFR/?text=${encodeURIComponent(cleanFeedback)}`
        : `http://localhost:8000/convert-text-to-speechAR/?text=${encodeURIComponent(cleanFeedback)}`;

      console.log("Envoi de la requête au backend pour la synthèse vocale :", ttsUrl);
      const ttsResponse = await fetch(ttsUrl, {
        method: "POST",
      });

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        console.error("Erreur API text-to-speech :", ttsResponse.status, errorText);
        setApiFeedback(cleanFeedback);
        setIsTranscribed(true);
        setIsFeedbackReady(true);
        return;
      }

      const audioBlob = await ttsResponse.blob();
      if (audioBlob.size === 0) {
        throw new Error(
          language === "french"
            ? "Fichier audio vide reçu."
            : "تم استلام ملف صوتي فارغ."
        );
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      setFeedbackAudioURL(audioUrl);
      setIsTranscribed(true);
      setIsFeedbackReady(true);
    } catch (error) {
      console.error("Erreur dans sendAudioToAPI :", error);
      setFeedback(
        language === "french"
          ? `Erreur : ${error.message || "Erreur inconnue lors de la transcription ou du feedback."}`
          : `خطأ: ${error.message || "خطأ غير معروف أثناء النسخ أو الملاحظات."}`
      );
      setTranscribedText(
        language === "french"
          ? "Erreur lors de la transcription."
          : "خطأ أثناء النسخ."
      );
      setApiFeedback(
        language === "french"
          ? "Erreur lors de la génération du feedback."
          : "خطأ أثناء إنشاء الملاحظات."
      );
      setIsTranscribed(true);
      setIsFeedbackReady(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackAudioPlayPause = () => {
    if (feedbackAudioRef.current) {
      if (isFeedbackAudioPlaying) {
        feedbackAudioRef.current.pause();
        setIsFeedbackAudioPlaying(false);
      } else {
        feedbackAudioRef.current
          .play()
          .then(() => setIsFeedbackAudioPlaying(true))
          .catch((error) => {
            console.warn("Erreur lecture audio feedback :", error);
            setIsFeedbackAudioPlaying(false);
            setFeedback(
              language === "french"
                ? "Erreur : impossible de jouer le son."
                : "خطأ: لا يمكن تشغيل الصوت."
            );
          });
      }
    }
  };

  const handleNewWord = () => {
    const words = language === "french" ? frenchWords : arabicWords;
    const availableWords = words.filter((word) => !usedWords.includes(word));

    if (availableWords.length === 0) {
      setIsFinished(true);
      return;
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
    setUsedWords((prev) => [...prev, randomWord]);
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setFeedbackAudioURL(null);
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setIsFeedbackAudioPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
  };

  const handleRetry = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setFeedbackAudioURL(null);
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setIsFeedbackAudioPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
  };

  const handleReRecord = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setFeedbackAudioURL(null);
    setIsPlaying(false);
    setIsFeedbackAudioPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setCurrentWord("");
    setUsedWords([]);
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setFeedbackAudioURL(null);
    setIsRecording(false);
    setIsLoading(false);
    setCorrectCount(0);
    setIsPlaying(false);
    setIsFeedbackAudioPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsFinished(false);
    setIsTranscribed(false);
    setIsFeedbackReady(false);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.warn("Erreur lecture audio :", error);
          setIsPlaying(false);
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

  const handleRestartExercise = () => {
    selectLanguage(language);
  };

  return (
    <div className="relative h-screen w-screen text-white flex flex-col items-center overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl text-center pt-2">
        <div className="inline-flex items-center justify-center bg-indigo-900/50 px-4 py-2 rounded-full transition-all hover:bg-indigo-800/70">
          <Mic className="h-5 w-5 text-cyan-300 mr-2" />
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 font-arial">
            {language === "french" || !language
              ? "Prononcez et apprenez avec notre reconnaissance vocale – انطق وتعلم مع تقنية التعرف على الصوت"
              : "انطق وتعلم مع تقنية التعرف على الصوت – Prononcez et apprenez avec notre reconnaissance vocale"}
          </span>
        </div>

        {language && (
          <div className="mt-12 flex justify-center">
            <Card className="relative w-full max-w-6xl h-[520px] bg-gradient-to-br from-gray-900 via-indigo-950 to-black border border-indigo-500/50 rounded-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:40px_40px]"></div>
              </div>
              <CardContent className="p-8 relative z-10">
                {isFinished ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white font-arial text-left">
                      {language === "french" ? "Exercice Terminé !" : "انتهى التمرين!"}
                    </h2>
                    <p className="text-xl text-gray-200 font-arial leading-relaxed text-left">
                      {language === "french"
                        ? `Total des réponses correctes : ${correctCount} / ${(language === "french" ? frenchWords : arabicWords).length}`
                        : `مجموع الإجابات الصحيحة: ${correctCount} / ${(language === "french" ? frenchWords : arabicWords).length}`}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handleBackToLanguageChoice}
                        className="bg-[#A5158C] hover:bg-[#410445] text-white font-arial py-2 px-4 rounded-lg"
                      >
                        {language === "french" ? "Choix de langue" : "اختيار اللغة"}
                        <ArrowLeft className="ml-2 h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleRestartExercise}
                        className="bg-green-600 hover:bg-green-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                      >
                        {language === "french" ? "Refaire l'exercice" : "إعادة التمرين"}
                        <RefreshCw className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : isLoading && !recordedAudio && !isTranscribed ? (
                  <div className="text-left">
                    <p className="text-xl text-gray-200 font-arial">
                      {language === "french" ? "Chargement..." : "جاري التحميل..."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={handleBackToLanguageChoice}
                        className="bg-[#A5158C] hover:bg-[#410445] text-white font-arial py-2 px-4 rounded-lg"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        {language === "french" ? "Choix de langues" : "العودة لاختيار اللغة"}
                      </Button>
                      <div className="text-2xl text-gray-200 font-arial">
                        {language === "french" ? `Progrès : ${usedWords.length} / ${(language === "french" ? frenchWords : arabicWords).length}` : `التقدم: ${usedWords.length} / ${(language === "french" ? frenchWords : arabicWords).length}`}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl text-gray-200 font-arial mb-4">
                        {language === "french" ? "Mot à prononcer :" : "الكلمة للنطق :"}
                      </p>
                      <h2 className="text-4xl font-bold text-white font-arial">
                        {currentWord}
                      </h2>
                    </div>

                    {!isTranscribed && (
                      <div className="text-center">
                        {!recordedAudio ? (
                          <div className="flex flex-col items-center">
                            <Button
                              onClick={isRecording ? stopRecording : startRecording}
                              disabled={isLoading}
                              className={`w-16 h-16 rounded-full ${
                                isRecording
                                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                  : "bg-orange-500 hover:bg-orange-600"
                              } text-white`}
                            >
                              <Mic className="h-8 w-8" />
                            </Button>
                            {isRecording && (
                              <div className="mt-2 flex items-center gap-1">
                                <span>{language === "french" ? "Enregistrement..." : "جارٍ التسجيل..."}</span>
                                <span>{recordingTime}s</span>
                                <div className="flex gap-1 ml-2">
                                  <div className="w-1 h-4 bg-red-400 animate-[wave_0.8s_ease-in-out_infinite]"></div>
                                  <div className="w-1 h-4 bg-red-400 animate-[wave_0.8s_ease-in-out_infinite_0.2s]"></div>
                                  <div className="w-1 h-4 bg-red-400 animate-[wave_0.8s_ease-in-out_infinite_0.4s]"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center bg-cyan-500/20 p-4 rounded-lg w-[70%] mx-auto my-4">
                              <Button
                                onClick={handlePlayPause}
                                className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full"
                              >
                                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                              </Button>
                              <input
                                type="range"
                                min={0}
                                max={duration}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full mx-4 h-3 bg-gray-600 rounded-lg cursor-pointer accent-orange-500"
                              />
                              <div className="flex items-center gap-2 text-gray-200 font-arial text-lg">
                                <span>{formatTime(currentTime)}</span>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <Button
                                onClick={sendAudioToAPI}
                                disabled={isLoading}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                {language === "french" ? "Vérifier" : "تحقق"}
                              </Button>
                              <Button
                                onClick={handleReRecord}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                <Mic className="mr-2 h-5 w-5" />
                                {language === "french" ? "Réenregistrer" : "إعادة التسجيل"}
                              </Button>
                            </div>
                            {isLoading && (
                              <div className="mt-4 flex flex-col items-center">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                                </div>
                                <span className="mt-2 text-gray-200 font-arial">
                                  {language === "french" ? "Traitement..." : "جارٍ المعالجة..."}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {isTranscribed && isFeedbackReady && (
                      <div className={`py-6 px-4 rounded-lg my-3 min-h-[120px] ${
                        feedback.includes("Correct") || feedback.includes("صحيح")
                          ? "bg-teal-600/20"
                          : "bg-red-600/20"
                      }`}>
                        <div className={`flex ${language === "french" ? "flex-row" : "flex-row-reverse"} items-center justify-between gap-4`}>
                          <div className={`flex flex-col ${language === "french" ? "items-start" : "items-end"} gap-2`}>
                            <div className={`flex ${language === "french" ? "flex-row" : "flex-row-reverse"} items-center gap-2`}>
                              {feedback.includes("Correct") || feedback.includes("صحيح") ? (
                                <CheckCircle className="h-8 w-8 text-teal-400" />
                              ) : (
                                <XCircle className="h-8 w-8 text-red-400" />
                              )}
                              <p className={`text-2xl font-bold text-gray-200 font-arial ${language === "french" ? "text-left" : "text-right"}`}>
                                <span>{language === "french" ? "Texte transcrit :" : "النص المستخرج :"}</span>
                                <span className="ml-1">{transcribedText}</span>
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
                          {apiFeedback && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={handleFeedbackAudioPlayPause}
                                    disabled={!feedbackAudioURL}
                                    className={`bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-purple-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-700/40 text-white text-lg font-arial py-2 px-4 rounded-lg ${
                                      !feedbackAudioURL ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  >
                                    {isFeedbackAudioPlaying ? (
                                      <Pause className="mr-2 h-5 w-5" />
                                    ) : (
                                      <Play className="mr-2 h-5 w-5" />
                                    )}
                                    {isFeedbackAudioPlaying
                                      ? language === "french"
                                        ? "Arrêter la lecture"
                                        : "إيقاف التشغيل"
                                      : language === "french"
                                      ? "Lire Feedback"
                                      : "تشغيل الملاحظات"}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {language === "french"
                                      ? feedbackAudioURL
                                        ? "Lire ou mettre en pause le feedback audio"
                                        : "Chargement de l'audio..."
                                      : feedbackAudioURL
                                      ? "تشغيل أو إيقاف الصوت للملاحظات"
                                      : "جاري تحميل الصوت..."}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {feedback.includes("Correct") || feedback.includes("صحيح") ? (
                            <Button
                              onClick={handleNewWord}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                            >
                              <ArrowRightCircle className="mr-2 h-5 w-5" />
                              {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={handleRetry}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                {language === "french" ? "Réessayer" : "إعادة المحاولة"}
                              </Button>
                              <Button
                                onClick={handleNewWord}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
                              >
                                <ArrowRightCircle className="mr-2 h-5 w-5" />
                                {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
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

      <main className="relative z-10 w-full max-w-[95vw] flex flex-col items-center justify-start min-h-screen pt-16 pb-8">
        {!language && (
          <div className="flex flex-col items-center justify-start w-full min-h-[80vh] gap-8 pt-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-tajawal leading-tight flex items-center justify-center mb-8">
                Reconnaissance Vocale | التعرف على الصوت
              </h1>
              <p className="text-lg text-gray-300 font-inter mb-10 max-w-[90vw] mx-auto">
                PRONONCEZ ET VÉRIFIEZ VOTRE PRONONCIATION | انطق وتحقق من نطقك
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

      <audio ref={audioRef} src={audioURL} />

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

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }
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