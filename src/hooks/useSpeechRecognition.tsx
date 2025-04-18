"use client";

import { useState, useEffect, useRef } from "react";

// Define the interface for the SpeechRecognition object (add vendor prefixes for broader compatibility)
interface CustomSpeechRecognition extends SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

// Extend the Window interface to include potential vendor-prefixed versions
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    mozSpeechRecognition: typeof SpeechRecognition;
    msSpeechRecognition: typeof SpeechRecognition;
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<CustomSpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in this browser.");
      console.warn("Speech recognition not supported");
      return;
    }

    // Initialize recognition instance
    const recognition = new SpeechRecognitionAPI() as CustomSpeechRecognition;
    recognition.continuous = true; // Keep listening even after pauses
    recognition.interimResults = true; // Get results as they come in
    recognition.lang = "en-US"; // Set language

    recognitionRef.current = recognition;

    // Event Handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Update with the latest final or interim transcript
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Only set isListening to false if it wasn't manually stopped
      // This allows for continuous listening unless explicitly stopped
      // However, some browsers might stop automatically after silence.
      // We might need to restart it if needed, but let's keep it simple for now.
      if (recognitionRef.current) {
        // Check if ref still exists
        // setIsListening(false); // Let's not automatically turn off listening on end for now
      }
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
  }, []); // Run only on mount

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript(""); // Clear previous transcript
        setError(null); // Clear previous errors
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        // Handle potential errors if already started, etc.
        console.error("Error starting speech recognition:", err);
        setError("Could not start listening.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    hasSupport: !!recognitionRef.current,
  };
};
