"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Play, Pause, CheckCircle, XCircle, ArrowLeft, ArrowRightCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SpeechToTextPage() {
  const frenchWords = [
    "Ballon", "Maman", "Salade", "Robot", "Vélo", "Cargo", "Canapé", "Citron",
    "Couverture", "Canicule", "Trompette", "Ordinateur", "Xylophone", "Pyramide",
    "Miroir", "Bouteille", "Chaussure", "Tasse", "Zèbre", "Mouche", "Nager", "Lire",
    "Sauter", "Dormir", "Crayon", "Lavabo", "Montre", "Veste", "Chien", "Carton"
  ];

  const arabicWords = [
    "مدرسة", "مقص", "سبورة", "حقيبة", "طاولة", "نافذة", "هاتف", "قطة",
    "سيارة", "قطار", "جمل", "سمكة", "زهرة", "عصفور", "خبز", "بيضة",
    "موزة", "نظارات", "مفتاح", "كرسي", "حصان", "أرنب", "مظلة", "كتاب",
    "كرة", "طائرة", "ساعة", "سكين", "حذاء", "فرشاة"
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
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

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
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setRecordedAudio(null);
    setAudioURL(null);
    setIsLoading(false);
    setCorrectCount(0);
    setUsedWords([]);
    setIsFinished(false);

    const words = lang === "french" ? frenchWords : arabicWords;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUsedWords([randomWord]);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
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
    } catch (error) {
      console.error("Erreur démarrage enregistrement :", error);
      setFeedback(
        language === "french"
          ? "Erreur : accès au microphone refusé."
          : "خطأ: تم رفض الوصول إلى الميكروفون."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      setIsRecording(false);
      mediaRecorder.current.stop();
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
    const formData = new FormData();
    formData.append("file", recordedAudio, "recording.wav");

    const endpoint =
      language === "french"
        ? "http://localhost:8000/convert-speech-to-textFR/"
        : "http://localhost:8000/convert-speech-to-textAR/";

    try {
      console.log("Envoi à l’API STT :", endpoint);
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          language === "french"
            ? `Erreur API : ${response.status} - ${errorText}`
            : `خطأ API: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      const transcribed = data.transcribed_text;

      if (!transcribed || typeof transcribed !== "string") {
        throw new Error(
          language === "french"
            ? "La réponse de l'API ne contient pas de texte valide."
            : "استجابة API لا تحتوي على نص صحيح."
        );
      }

      if (transcribed === "") {
        setTranscribedText(
          language === "french"
            ? "Aucun texte transcrit."
            : "لم يتم استخراج أي نص."
        );
        setFeedback(
          language === "french" ? "❌ Aucun texte détecté." : "❌ لم يتم اكتشاف نص."
        );
        return;
      }

      setTranscribedText(transcribed);

      const normalizedTranscribed = transcribed
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();
      const normalizedCurrentWord = currentWord
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();

      if (normalizedTranscribed === normalizedCurrentWord) {
        setFeedback(
          language === "french" ? "🎉 Correct ! Excellent !" : "🎉 صحيح، أحسنت !"
        );
        setCorrectCount((prev) => prev + 1);
      } else {
        setFeedback(
          language === "french"
            ? "❌ Incorrect. Essayez encore."
            : "❌ خطأ. حاول مرة أخرى."
        );
      }

      const feedbackFormData = new FormData();
      feedbackFormData.append("type_exercice", "prononciation");
      feedbackFormData.append("mot_attendu", currentWord);
      feedbackFormData.append("transcription_patient", transcribed);
      feedbackFormData.append("langue", language === "french" ? "fr" : "ar");

      const feedbackResponse = await fetch("http://localhost:8000/feedback_text_generator/", {
        method: "POST",
        body: feedbackFormData,
      });

      const feedbackData = await feedbackResponse.json();
      if (feedbackData.feedback && typeof feedbackData.feedback === "string") {
        const cleanFeedback = feedbackData.feedback
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
      console.error("Erreur STT ou Feedback :", {
        message: error.message,
        stack: error.stack,
      });
      setFeedback(
        language === "french"
          ? `Erreur : ${error.message}`
          : `خطأ: ${error.message}`
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
    } finally {
      setIsLoading(false);
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
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleRetry = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setApiFeedback("");
    setDisplayedApiFeedback("");
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleReRecord = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
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
    setIsRecording(false);
    setIsLoading(false);
    setCorrectCount(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsFinished(false);
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
      {/* Badge en haut */}
      <div className="relative z-10 w-full max-w-7xl text-center pt-2">
        <div className="inline-flex items-center justify-center bg-indigo-900/50 px-4 py-2 rounded-full transition-all hover:bg-indigo-800/70">
          <Mic className="h-5 w-5 text-cyan-300 mr-2" />
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 font-arial">
            {language === "french" || !language
              ? "Prononcez et apprenez avec notre reconnaissance vocale – انطق وتعلم مع تقنية التعرف على الصوت"
              : "انطق وتعلم مع تقنية التعرف على الصوت – Prononcez et apprenez avec notre reconnaissance vocale"}
          </span>
        </div>

        {/* Speech-to-Text Card */}
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
                        className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-arial py-2 px-4 rounded-lg"
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
                ) : isLoading && !recordedAudio && !transcribedText ? (
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
                        className="bg-teal-600 hover:bg-teal-700 text-white font-arial py-2 px-4 rounded-lg"
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

                    {!transcribedText && (
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

                    {transcribedText && (
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

      {/* Homepage */}
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