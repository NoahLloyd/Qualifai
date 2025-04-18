"use client";

import React, { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInputArea } from "./ChatInputArea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean; // Indicates if AI is "thinking"
}

export function ChatInterface({
  messages,
  onSendMessage,
  isProcessing,
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for the main ScrollArea component

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollAreaElement = scrollAreaRef.current;
    if (scrollAreaElement) {
      // Find the viewport div within the ScrollArea component
      const viewport = scrollAreaElement.querySelector<HTMLDivElement>(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {" "}
      {/* Changed background slightly */}
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {/* Ref is on the ScrollArea itself */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isProcessing && (
            <div className="flex justify-start items-center">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                {/* Optional: Add Bot icon here too */}
              </div>
              <div className="p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none animate-pulse">
                <span className="text-sm italic">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <ChatInputArea onSendMessage={onSendMessage} isSending={isProcessing} />
    </div>
  );
}
