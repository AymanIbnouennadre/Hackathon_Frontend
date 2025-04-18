"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Play, Pause, CheckCircle, XCircle, ArrowLeft, ArrowRightCircle, RefreshCw, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const [language, setLanguage] = useState<"french" | "arabic" | null>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const selectLanguage = (lang: "french" | "arabic") => {
    setLanguage(lang);
    setTranscribedText("");
    setFeedback("");
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

      const audioChunks: Blob[] = [];
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
    } catch (error) {
      console.error("Erreur STT :", {
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleRestartExercise = () => {
    selectLanguage(language!);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden pt-4">
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] animate-pulse"></div>
          <div
            className="absolute top-3/4 left-2/3 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      </div>

      <main className="container mx-auto px-4 pt-4 pb-20 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-3">
            <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
              Reconnaissance Vocale
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 font-tajawal">
            Reconnaissance Vocale | التعرف على الصوت
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {language === "arabic"
              ? "انطق كلمة وتحقق من نطقك باستخدام تقنية التعرف على الصوت."
              : "Prononcez un mot et vérifiez votre prononciation avec la reconnaissance vocale."}
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center font-tajawal">
              <Volume2 className="h-6 w-6 text-cyan-400 mr-2" />
              {language === "arabic" ? "التعرف على الصوت" : "Speech-to-Text"}
            </CardTitle>
          </CardHeader>
          <CardContent className={`${language === "arabic" ? "font-tajawal text-right" : "font-poppins"}`}>
            {language && !isFinished ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <Button
                    onClick={handleBackToLanguageChoice}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {language === "french" ? "Choix de langues" : "العودة لاختيار اللغة"}
                  </Button>
                  <div className="text-gray-300">
                    {language === "french" ? "Progrès :" : "التقدم :"} {usedWords.length}/
                    {(language === "french" ? frenchWords : arabicWords).length}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-white">
                    {language === "french" ? "Mot à prononcer :" : "الكلمة للنطق :"}
                  </h4>
                  <h2
                    className="text-3xl font-bold text-cyan-400"
                    style={{ fontSize: language === "arabic" ? "2.5rem" : "2rem" }}
                  >
                    {currentWord}
                  </h2>
                </div>

                {!transcribedText && (
                  <div className="text-center mb-6">
                    {!recordedAudio ? (
                      <div className="flex flex-col items-center">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isLoading}
                          className={`w-16 h-16 rounded-full ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 animate-pulse"
                              : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
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
                        <div className="flex items-center bg-white/10 rounded-full p-2 w-full max-w-sm">
                          <Button
                            onClick={handlePlayPause}
                            className="bg-transparent text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          <div className="flex-1 mx-2">
                            <input
                              type="range"
                              min={0}
                              max={duration}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full accent-cyan-500"
                            />
                          </div>
                          <span className="text-sm text-gray-300">{formatTime(currentTime)}</span>
                        </div>
                        <div className="mt-4 flex gap-4">
                          <Button
                            onClick={sendAudioToAPI}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                          >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            {language === "french" ? "Vérifier" : "تحقق"}
                          </Button>
                          <Button
                            onClick={handleReRecord}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
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
                            <span className="mt-2 text-gray-300">
                              {language === "french" ? "Traitement..." : "جارٍ المعالجة..."}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {transcribedText && (
                  <div className="mt-6 rounded-lg bg-white/10 p-4 text-center">
                    <h5 className="mb-2 font-semibold text-white">
                      {language === "french" ? "Texte transcrit :" : "النص المستخرج :"}
                    </h5>
                    <p
                      className={`text-base sm:text-lg text-gray-200 ${
                        language === "arabic" ? "text-right" : "text-left"
                      }`}
                      style={{ fontFamily: language === "arabic" ? "Tajawal, sans-serif" : "Poppins, sans-serif" }}
                    >
                      {transcribedText}
                    </p>
                    <h5 className="mt-4 mb-2 font-semibold text-white">
                      {language === "french" ? "Résultat :" : "النتيجة :"}
                    </h5>
                    <Badge
                      variant={feedback.includes("Correct") || feedback.includes("صحيح") ? "default" : "destructive"}
                      className={`text-lg px-4 py-2 ${
                        feedback.includes("Correct") || feedback.includes("صحيح")
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {feedback}
                    </Badge>
                  </div>
                )}

                {transcribedText && (
                  <div className="mt-6 flex justify-center gap-4">
                    {feedback.includes("Correct") || feedback.includes("صحيح") ? (
                      <Button
                        onClick={handleNewWord}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      >
                        <ArrowRightCircle className="mr-2 h-5 w-5" />
                        {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleRetry}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                        >
                          <RefreshCw className="mr-2 h-5 w-5" />
                          {language === "french" ? "Réessayer" : "إعادة المحاولة"}
                        </Button>
                        <Button
                          onClick={handleNewWord}
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                        >
                          <ArrowRightCircle className="mr-2 h-5 w-5" />
                          {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : isFinished ? (
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-green-400 mb-6">
                  {language === "french" ? "Fin Phonotrack" : "نهاية فونوتراك"}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {language === "french"
                    ? `Félicitations ! Vous avez terminé l'exercice avec ${correctCount} réponses correctes sur ${
                        language === "french" ? frenchWords.length : arabicWords.length
                      }.`
                    : `تهانينا! لقد أكملت التمرين بـ ${correctCount} إجابات صحيحة من أصل ${
                        language === "french" ? frenchWords.length : arabicWords.length
                      }.`}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleRestartExercise}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    {language === "french" ? "Recommencer" : "إعادة التمرين"}
                  </Button>
                  <Button
                    onClick={handleBackToLanguageChoice}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {language === "french" ? "Retour" : "العودة"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => selectLanguage("french")}
                    className="w-full sm:w-48 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                  >
                    Français
                  </Button>
                  <Button
                    onClick={() => selectLanguage("arabic")}
                    className="w-full sm:w-48 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-tajawal"
                  >
                    العربية
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <audio ref={audioRef} src={audioURL} />
    </div>
  );
}