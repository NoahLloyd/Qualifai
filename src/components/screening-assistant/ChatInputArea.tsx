"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal /*, Mic*/ } from "lucide-react";
import { VoiceInputButton } from "./VoiceInputButton";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  isSending: boolean; // To disable input while processing
}

export function ChatInputArea({
  onSendMessage,
  isSending,
}: ChatInputAreaProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const trimmedInput = inputText.trim();
    if (trimmedInput) {
      onSendMessage(trimmedInput);
      setInputText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline on Enter
      handleSend();
    }
  };

  // Handler for voice input
  const handleVoiceInput = (transcript: string) => {
    setInputText((prev) =>
      prev ? `${prev.trim()} ${transcript}` : transcript
    ); // Append transcript
  };

  return (
    <div className="relative flex items-end gap-2 p-4 border-t bg-background sticky bottom-0">
      <VoiceInputButton onTranscript={handleVoiceInput} disabled={isSending} />

      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer here... (Shift+Enter for newline)"
        rows={1}
        className="flex-grow resize-none max-h-32 min-h-[40px] overflow-y-auto pr-12"
        disabled={isSending}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!inputText.trim() || isSending}
        className="absolute right-4 bottom-[18px] flex-shrink-0 h-8 w-8"
        title="Send message"
      >
        <SendHorizonal className="w-4 h-4" />
      </Button>
    </div>
  );
}
