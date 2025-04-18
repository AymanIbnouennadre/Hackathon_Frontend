"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Upload, Camera, Play, Pause, Trash, XCircle, ArrowLeft, RotateCcw, Sparkles, Image as LucideImage } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      console.log("Appel API OCR vers :", apiUrl);

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
    if (!extractedText || extractedText.includes("Erreur") || extractedText.includes("خطأ")) {
      console.log("TTS bloqué : texte vide ou contient une erreur");
      return;
    }

    setIsAudioLoading(true);
    try {
      const apiUrl =
        language === "FR"
          ? "http://localhost:8000/convert-text-to-speechFR/"
          : "http://localhost:8000/convert-text-to-speechAR/";
      console.log("Appel API TTS vers :", apiUrl, "avec texte :", extractedText);

      // Valider la taille du texte pour éviter une URL trop longue
      if (encodeURIComponent(extractedText).length > 2000) {
        throw new Error(language === "FR" ? "Texte trop long pour TTS." : "النص طويل جدًا لتحويل النص إلى كلام.");
      }

      const response = await axios.post(
        `${apiUrl}?text=${encodeURIComponent(extractedText)}`,
        {},
        { responseType: "blob" }
      );

      // Vérifier que la réponse est un Blob valide
      if (!(response.data instanceof Blob)) {
        throw new Error(language === "FR" ? "Réponse API invalide : pas un Blob." : "استجابة API غير صالحة: ليس Blob.");
      }

      const audioBlob = response.data;
      console.log("Taille du Blob audio :", audioBlob.size);

      if (audioBlob.size === 0) {
        throw new Error(language === "FR" ? "Fichier audio vide." : "ملف صوتي فارغ.");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("URL audio créé :", audioUrl);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error("Erreur TTS détaillée :", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        stack: error.stack,
      });

      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${error.response.data.detail || error.message}`
        : `Erreur: ${error.message}`;
      setExtractedText(
        language === "FR"
          ? `Erreur de synthèse vocale : ${errorMessage}`
          : `خطأ في تحويل النص إلى كلام: ${errorMessage}`
      );
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    if (!audioSrc || !audioRef.current) {
      console.log("useEffect TTS ignoré : audioSrc ou audioRef manquant");
      return;
    }

    audioRef.current.src = audioSrc;
    const playAudio = () => {
      if (audioRef.current) {
        console.log("Tentative de lecture audio");
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Lecture audio démarrée");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn("Erreur lecture automatique :", error);
              setIsPlaying(false);
            });
        }
      }
    };

    audioRef.current.addEventListener("loadedmetadata", playAudio, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", playAudio);
      }
    };
  }, [audioSrc]);

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
              console.warn("Erreur lors de la reprise :", error);
              setIsPlaying(false);
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
        className={index === currentWordIndex ? "bg-cyan-400/30 px-0.5" : "px-0.5"}
      >
        {word}{" "}
      </span>
    ));
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
              Reconnaissance d'Images
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 font-tajawal">
            Reconnaissance d’Images | التعرف على الصور
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {language === "AR"
              ? "اسحب، قم بالتحميل أو استخدم الكاميرا لاستخراج النص من الصور وتحويله إلى صوت."
              : "Déposez, téléchargez ou utilisez la caméra pour extraire le texte des images et le convertir en audio."}
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center font-tajawal">
              <LucideImage className="h-6 w-6 text-cyan-400 mr-2" />
              {language === "AR" ? "التعرف على الصور" : "Image-to-Text"}
            </CardTitle>
          </CardHeader>
          <CardContent className={`${language === "AR" ? "font-tajawal text-right" : "font-poppins"}`}>
            {language ? (
              <div>
                <div className="mb-6 flex flex-col items-center">
                  <Button
                    onClick={handleBackToLanguageChoice}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {language === "FR" ? "Choix de langues" : "العودة لاختيار اللغة"}
                  </Button>
                  {isConverted && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <Button
                        onClick={handleTextToSpeech}
                        disabled={isAudioLoading || !!audioSrc || extractedText.includes("Erreur") || extractedText.includes("خطأ")}
                        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                        title={language === "FR" ? "Lire le texte" : "استمع إلى النص"}
                      >
                        {isAudioLoading ? (
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-100"></div>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-200"></div>
                          </div>
                        ) : (
                          <span className="mr-2">(Volume)</span>
                        )}
                        {language === "FR" ? "Lire" : "استمع"}
                      </Button>
                      {audioSrc && (
                        <>
                          <Button
                            onClick={handlePlayPause}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                            title={language === "FR" ? "Pause/Reprendre" : "إيقاف/استئناف"}
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
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                            title={language === "FR" ? "Relire" : "إعادة التشغيل"}
                          >
                            <RotateCcw className="mr-2 h-5 w-5" />
                            {language === "FR" ? "Relire" : "إعادة"}
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={handleClear}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                        title={language === "FR" ? "Effacer" : "مسح"}
                      >
                        <Trash className="mr-2 h-5 w-5" />
                        {language === "FR" ? "Effacer" : "مسح"}
                      </Button>
                    </div>
                  )}
                </div>

                {!imageCaptured && !isConverted && (
                  <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-white/10 p-6 text-center">
                    <h4 className="text-lg font-semibold text-white">
                      {language === "FR"
                        ? "Déposer, télécharger ou coller une image"
                        : "اسحب، قم بالتحميل أو ألصق صورة"}
                    </h4>
                    <p className="mt-2 text-gray-300">
                      {language === "FR"
                        ? "Formats pris en charge : JPG, PNG, PDF"
                        : "الصيغ المدعومة: JPG, PNG, PDF"}
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-cyan-600 hover:to-purple-700">
                      <Upload className="mr-2 h-5 w-5" />
                      {language === "FR" ? "Parcourir" : "استعرض"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*, application/pdf"
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-400">
                      {language === "FR"
                        ? "*Votre vie privée est protégée ! Aucune donnée n'est transmise ou stockée."
                        : "*حماية خصوصيتك! لا يتم نقل أو تخزين أي بيانات."}
                    </p>
                    <Button
                      onClick={openCameraModal}
                      className="mt-4 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      {language === "FR" ? "Utiliser la caméra" : "استخدم الكاميرا"}
                    </Button>
                  </div>
                )}

                {imageCaptured && !isConverted && (
                  <div className="text-center">
                    <div className="relative mx-auto h-64 w-full max-w-md overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={imageCaptured}
                        alt="Aperçu"
                        fill
                        className="rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-2 text-gray-300">{selectedFile?.name}</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <Button
                        onClick={handleStartClick}
                        disabled={isConverting}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      >
                        {isConverting ? (
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-100"></div>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-200"></div>
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
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        {language === "FR" ? "Annuler" : "إلغاء"}
                      </Button>
                    </div>
                  </div>
                )}

                {isConverted && (
                  <div className="mt-6 rounded-lg bg-white/10 p-4 text-center">
                    <h5 className="mb-2 font-semibold text-white">
                      {language === "FR" ? "Texte extrait :" : "النص المستخرج :"}
                    </h5>
                    <p
                      className={`text-base leading-relaxed text-gray-200 sm:text-lg ${language === "AR" ? "text-right" : "text-left"}`}
                      style={{ fontFamily: language === "AR" ? "Tajawal, sans-serif" : "Poppins, sans-serif" }}
                    >
                      {renderHighlightedText()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => handleLanguageSelect("FR")}
                    className="w-full sm:w-48 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                  >
                    Français
                  </Button>
                  <Button
                    onClick={() => handleLanguageSelect("AR")}
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

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Card className="relative w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/10">
            <Button
              onClick={closeCameraModal}
              className="absolute right-4 top-4 bg-transparent text-gray-300 hover:text-white"
            >
              <XCircle className="h-6 w-6" />
            </Button>
            <CardHeader>
              <CardTitle className="text-white text-center">
                <Camera className="inline-block mr-2 h-6 w-6 text-cyan-400" />
                {language === "FR" ? "Capturez votre image" : "التقط صورتك"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                className="w-full rounded-lg shadow-md"
                videoConstraints={videoConstraints}
              />
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  onClick={handleCaptureImage}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {language === "FR" ? "Prendre une photo" : "التقط صورة"}
                </Button>
                <Button
                  onClick={closeCameraModal}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  {language === "FR" ? "Annuler" : "إلغاء"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        }}
      />
    </div>
  );
}