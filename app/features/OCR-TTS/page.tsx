"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Upload, Camera, Play, Pause, Trash, XCircle, ArrowLeft, RotateCcw, LucideImage, Volume2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function OCRTTSPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [language, setLanguage] = useState<"FR" | "AR" | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const webcamRef = useRef<Webcam>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod/.test(window.navigator.userAgent);
  };

  const videoConstraints = {
    facingMode: isMobileDevice() ? { exact: "environment" } : "user",
  };

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    if (audioSrc) {
      URL.revokeObjectURL(audioSrc);
      setAudioSrc(null);
    }
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImageCaptured(e.target.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageSelect = (lang: "FR" | "AR") => {
    setLanguage(lang);
  };

  const handleBackToLanguageChoice = () => {
    cleanupAudio();
    setLanguage(null);
    setSelectedFile(null);
    setExtractedText("");
    setImageCaptured(null);
    setIsConverted(false);
  };

  const handleStartClick = async () => {
    if (!selectedFile) {
      setExtractedText(language === "FR" ? "Veuillez sélectionner un fichier." : "يرجى اختيار ملف.");
      setIsConverted(true);
      return;
    }

    setIsConverting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiUrl =
        language === "FR"
          ? "http://localhost:8000/convert-image-to-textFR/"
          : "http://localhost:8000/convert-image-to-textAR/";
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const normalizedText = response.data.extracted_text
        ? response.data.extracted_text.replace(/\n+/g, " ").trim()
        : language === "FR"
        ? "Aucun texte extrait."
        : "لم يتم استخراج نص.";
      setExtractedText(normalizedText);
      setIsConverted(true);
    } catch (error) {
      console.error("Erreur OCR :", error);
      const errorMessage = error.response
        ? `Erreur : ${error.response.status} - ${error.response.data.detail || error.message}`
        : `Erreur : ${error.message}`;
      setExtractedText(
        language === "FR"
          ? errorMessage
          : `خطأ: ${errorMessage}`
      );
      setIsConverted(true);
    } finally {
      setIsConverting(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!extractedText || extractedText.includes("Erreur") || extractedText.includes("خطأ") || extractedText.trim() === "") {
      setExtractedText(
        language === "FR"
          ? "Erreur de synthèse vocale : Aucun texte valide à convertir."
          : "خطأ في تحويل النص إلى كلام: لا يوجد نص صالح للتحويل."
      );
      return;
    }

    setIsAudioLoading(true);
    try {
      console.log("Sending text to synthesize:", extractedText);
      const apiUrl =
        language === "FR"
          ? "http://localhost:8000/convert-text-to-speechFR/"
          : "http://localhost:8000/convert-text-to-speechAR/";

      const response = await axios.post(
        `${apiUrl}?text=${encodeURIComponent(extractedText)}`,
        {},
        { responseType: "blob" }
      );

      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error(language === "FR" ? "Réponse API invalide : pas un Blob." : "استجابة API غير صالحة: ليس Blob.");
      }

      const audioBlob = response.data;
      if (audioBlob.size === 0) {
        throw new Error(language === "FR" ? "Fichier audio vide." : "ملف صوتي فارغ.");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        const playAudio = () => {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((error) => {
                console.warn("Lecture automatique bloquée, interaction requise :", error);
                setIsPlaying(false);
                setExtractedText(
                  language === "FR"
                    ? "Erreur: interaction requise pour jouer le son."
                    : "خطأ: التفاعل مطلوب لتشغيل الصوت."
                );
              });
          }
        };

        audioRef.current.addEventListener("canplay", playAudio, { once: true });
      }
    } catch (error) {
      console.error("Text-to-speech error details:", error);
      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${error.response.data?.detail || error.message}`
        : `Erreur: ${error.message}`;
      setExtractedText(
        language === "FR"
          ? `Erreur de synthèse vocale : ${errorMessage}`
          : `خطأ في تحويل النص إلى كلام: ${errorMessage}`
      );
      setAudioSrc(null);
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const handleTimeUpdate = () => {
      const words = extractedText.split(/\s+/);
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      const wordDuration = duration / words.length;
      const adjustedTime = currentTime * 1.04;
      const newWordIndex = Math.floor(adjustedTime / wordDuration);
      setCurrentWordIndex(newWordIndex < words.length ? newWordIndex : -1);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      cleanupAudio();
    };
  }, [audioSrc, extractedText]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.warn("Erreur lors de la reprise de la lecture :", error);
              setIsPlaying(false);
              setExtractedText(
                language === "FR"
                  ? "Erreur: impossible de jouer le son."
                  : "خطأ: لا يمكن تشغيل الصوت."
              );
            });
        }
      }
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.warn("Erreur lors de la relecture :", error);
            setIsPlaying(false);
            setExtractedText(
              language === "FR"
                ? "Erreur: impossible de jouer le son."
                : "خطأ: لا يمكن تشغيل الصوت."
            );
          });
      }
    }
  };

  const openCameraModal = () => setModalIsOpen(true);
  const closeCameraModal = () => setModalIsOpen(false);

  const handleCaptureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImageCaptured(imageSrc);
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "captured-image.png", { type: "image/png" });
            setSelectedFile(file);
          });
        setModalIsOpen(false);
      }
    }
  };

  const handleClear = () => {
    cleanupAudio();
    setSelectedFile(null);
    setImageCaptured(null);
    setExtractedText("");
    setIsConverted(false);
  };

  const renderHighlightedText = () => {
    if (!extractedText) return "...";
    const words = extractedText.split(/\s+/);
    return words.map((word, index) => (
      <span
        key={index}
        className={`transition-colors duration-300 px-1 py-0.5 rounded-sm ${
          index === currentWordIndex ? "bg-cyan-500/30 text-cyan-100" : "text-gray-100"
        }`}
      >
        {word}{" "}
      </span>
    ));
  };

  return (
    <div className="relative h-screen w-screen text-white flex flex-col items-center overflow-hidden">
      <main className="relative z-10 w-full max-w-[95vw] flex flex-col items-center justify-start min-h-screen pt-16 pb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-indigo-900/50 px-4 py-2 rounded-full transition-all hover:bg-indigo-800/70">
            <LucideImage className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 font-inter">
              Pour t’aider à lire, comprendre et entendre ce que tu vois – لمساعدتك على قراءة وفهم وسماع ما تراه
            </span>
            <Volume2 className="h-5 w-5 text-cyan-400 ml-2" />
          </div>
        </div>

        {language ? (
          <div className="flex flex-col w-full min-h-[80vh] items-center justify-start pt-8">
            <div className="mb-6 flex justify-center">
              <Button
                onClick={handleBackToLanguageChoice}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 flex items-center transition-all transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {language === "FR" ? "Choix de langues" : "العودة لاختيار اللغة"}
              </Button>
            </div>

            {!imageCaptured && !isConverted && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-400/50 bg-indigo-900/30 p-10 text-center w-full max-w-[90vw] shadow-xl transition-all hover:shadow-2xl">
                <h4 className="text-2xl font-semibold text-white mb-3 font-tajawal">
                  {language === "FR"
                    ? "Téléchargez ou capturez une image"
                    : "قم بالتحميل أو التقاط صورة"}
                </h4>
                <p className="text-sm text-gray-400 mb-6 font-inter">
                  {language === "FR"
                    ? "Formats pris en charge : JPG, PNG, PDF"
                    : "الصيغ المدعومة: JPG, PNG, PDF"}
                </p>
                <label className="inline-flex cursor-pointer items-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 font-semibold text-white hover:from-cyan-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-md">
                  <Upload className="mr-3 h-6 w-6" />
                  {language === "FR" ? "Parcourir" : "استعرض"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*, application/pdf"
                  />
                </label>
                <Button
                  onClick={openCameraModal}
                  className="mt-6 rounded-full bg-gradient-to-r from-pink-400 to-red-500 hover:from-pink-500 hover:to-red-600 text-white px-8 py-4 transition-all transform hover:scale-105 shadow-md"
                >
                  <Camera className="mr-3 h-6 w-6" />
                  {language === "FR" ? "Utiliser la caméra" : "استخدم الكاميرا"}
                </Button>
                <p className="mt-6 text-xs text-gray-500 font-inter">
                  {language === "FR"
                    ? "*Votre vie privée est protégée ! Aucune donnée n'est transmise ou stockée."
                    : "*حماية خصوصيتك! لا يتم نقل أو تخزين أي بيانات."}
                </p>
              </div>
            )}

            {imageCaptured && !isConverted && (
              <div className="text-center w-full max-w-[90vw]">
                <div className="relative mx-auto h-72 w-full max-w-lg overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={imageCaptured}
                    alt="Aperçu"
                    fill
                    className="rounded-2xl object-contain"
                  />
                </div>
                <p className="mt-4 text-gray-400 font-inter text-lg">{selectedFile?.name}</p>
                <div className="mt-6 flex justify-center gap-6">
                  <Button
                    onClick={handleStartClick}
                    disabled={isConverting}
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white px-8 py-4 transition-all transform hover:scale-105 shadow-md"
                  >
                    {isConverting ? (
                      <div className="flex gap-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white"></div>
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-100"></div>
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-200"></div>
                      </div>
                    ) : (
                      language === "FR" ? "Convertir" : "تحويل"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setImageCaptured(null);
                    }}
                    className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 transition-all transform hover:scale-105 shadow-md"
                  >
                    <XCircle className="mr-3 h-6 w-6" />
                    {language === "FR" ? "Annuler" : "إلغاء"}
                  </Button>
                </div>
              </div>
            )}

            {isConverted && (
              <div className="flex flex-col items-center gap-6 w-full max-w-[90vw]">
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={handleTextToSpeech}
                    disabled={isAudioLoading || !!audioSrc || extractedText.includes("Erreur") || extractedText.includes("خطأ")}
                    className="rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-6 py-3 transition-all transform hover:scale-105 shadow-md"
                  >
                    {isAudioLoading ? (
                      <div className="flex gap-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white"></div>
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-100"></div>
                        <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-200"></div>
                      </div>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        {language === "FR" ? "Lire" : "استمع"}
                      </>
                    )}
                  </Button>
                  {audioSrc && (
                    <>
                      <Button
                        onClick={handlePlayPause}
                        className="rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white px-6 py-3 transition-all transform hover:scale-105 shadow-md"
                      >
                        {isPlaying ? (
                          <Pause className="mr-2 h-5 w-5" />
                        ) : (
                          <Play className="mr-2 h-5 w-5" />
                        )}
                        {language === "FR" ? "Pause/Reprendre" : "إيقاف/استئناف"}
                      </Button>
                      <Button
                        onClick={handleReplay}
                        className="rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-6 py-3 transition-all transform hover:scale-105 shadow-md"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        {language === "FR" ? "Relire" : "إعادة"}
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={handleClear}
                    className="rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-6 py-3 transition-all transform hover:scale-105 shadow-md"
                  >
                    <Trash className="mr-2 h-5 w-5" />
                    {language === "FR" ? "Effacer" : "مسح"}
                  </Button>
                </div>

                <div className="w-full rounded-2xl bg-indigo-900/50 p-8 text-center shadow-xl transition-all hover:shadow-2xl">
                  <h5 className="mb-4 font-semibold text-xl text-cyan-300 font-tajawal">
                    {language === "FR" ? "Texte extrait :" : "النص المستخرج :"}
                  </h5>
                  <div className="max-h-48 overflow-y-auto text-lg leading-relaxed text-gray-100 sm:text-xl p-6 bg-black/30 rounded-xl font-inter">
                    {renderHighlightedText()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full min-h-[80vh] gap-8 pt-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-tajawal leading-tight flex items-center justify-center mb-8">
                Reconnaissance d’Images | التعرف على الصور
              </h1>
              <p className="text-lg text-gray-300 font-inter mb-10 max-w-[90vw] mx-auto">
                DÉPOSER, TÉLÉCHARGER OU COLLER L'IMAGE | استمتع بالتحميل او النسخ او اللصق
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  onClick={() => handleLanguageSelect("FR")}
                  className="w-52 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-4 text-lg transition-all transform hover:scale-105 shadow-md font-inter"
                >
                  Français
                </Button>
                <Button
                  onClick={() => handleLanguageSelect("AR")}
                  className="w-52 rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-8 py-4 text-lg font-tajawal transition-all transform hover:scale-105 shadow-md"
                >
                  العربية
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl bg-indigo-950/80 backdrop-blur-lg border border-indigo-500/30 rounded-2xl shadow-2xl">
            <Button
              onClick={closeCameraModal}
              className="absolute right-4 top-4 bg-transparent text-gray-300 hover:text-white transition-all"
            >
              <XCircle className="h-8 w-8" />
            </Button>
            <div className="p-8">
              <h3 className="text-white text-center text-2xl font-tajawal mb-6">
                <Camera className="inline-block mr-3 h-8 w-8 text-cyan-400" />
                {language === "FR" ? "Capturez votre image" : "التقط صورتك"}
              </h3>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                className="w-full rounded-2xl shadow-md"
                videoConstraints={videoConstraints}
              />
              <div className="mt-6 flex justify-center gap-6">
                <Button
                  onClick={handleCaptureImage}
                  className="rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-8 py-4 transition-all transform hover:scale-105 shadow-md"
                >
                  <Camera className="mr-3 h-6 w-6" />
                  {language === "FR" ? "Prendre une photo" : "التقط صورة"}
                </Button>
                <Button
                  onClick={closeCameraModal}
                  className="rounded-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-8 py-4 transition-all transform hover:scale-105 shadow-md"
                >
                  <XCircle className="mr-3 h-6 w-6" />
                  {language === "FR" ? "Annuler" : "إلغاء"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        }}
      />

      {/* Styles globaux pour appliquer le fond à toute la page */}
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
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}