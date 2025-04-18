"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  disabled,
}: VoiceInputButtonProps) {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    hasSupport,
  } = useSpeechRecognition();

  // When listening stops and there's a transcript, pass it up
  useEffect(() => {
    if (!isListening && transcript) {
      onTranscript(transcript);
    }
    // Intentionally not including onTranscript in deps array
    // to avoid potential re-renders if the parent passes a new function instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!hasSupport) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="Speech recognition not supported"
      >
        <AlertCircle className="w-5 h-5 text-destructive" />
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title={`Speech recognition error: ${error}`}
      >
        <AlertCircle className="w-5 h-5 text-destructive" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleListening}
      disabled={disabled}
      className={cn(
        "flex-shrink-0",
        isListening && "text-red-500 animate-pulse"
      )}
      title={isListening ? "Stop recording" : "Start recording"}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
}
