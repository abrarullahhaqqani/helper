import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const fallbackIntervalRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/sigin");
    } catch (error) {
      console.log(error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      // restart recognition after short delay
      setTimeout(() => {
        if (!isRecognizingRef.current) {
          recognitionRef.current?.start();
        }
      }, 500);
    };
    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const openURL = (url) => window.open(url, "_blank");
    const query = encodeURIComponent(userInput || "");

    switch (type) {
      case "google_search":
        openURL(`https://www.google.com/search?q=${query}`);
        break;
      case "calculator_open":
        openURL(`https://www.google.com/search?q=calculator`);
        break;
      case "instagram_open":
        openURL(`https://www.instagram.com/`);
        break;
      case "facebook_open":
        openURL(`https://www.facebook.com/`);
        break;
      case "linkedin_open":
        openURL(`https://www.linkedin.com/`);
        break;
      case "youtube_search":
      case "youtube_play":
        openURL(`https://www.youtube.com/results?search_query=${query}`);
        break;
      case "weather-show":
        openURL(`https://www.google.com/search?q=weather`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    const safeStart = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log(" Recognition requested to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Recognition start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => safeStart(), 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn(" Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => safeStart(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (
        userData?.assistantName &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop(); // temporarily stop
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        if (data?.response) {
          handleCommand(data);
        } else {
          speak("Sorry, I didn't understand that.");
        }
      }
    };

    // start once
    safeStart();

    // restart fallback every 15 seconds
    fallbackIntervalRef.current = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        console.log(" Fallback trying to restart recognition");
        safeStart();
      }
    }, 15000);

    return () => {
      recognition.stop();
      clearInterval(fallbackIntervalRef.current);
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, [userData, getGeminiResponse]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]">
      <button
        className="min-w-[150px] h-[40px] bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-black font-semibold text-20px px-[20px] py-[10px]"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <button
        className="min-w-[150px] h-[40px] bg-white rounded-full cursor-pointer text-black font-semibold absolute top-[20px] right-[20px] text-20px mt-[30px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg cursor-pointer">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
}

export default Home;
