"use client";

import React, { useRef, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInputArea } from "./ChatInputArea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean; // Indicates if AI is "thinking" (for text chat)
  vapiKey: string; // Vapi Public Key - TODO: Get this from env vars or secure source
  vapiAssistantId?: string; // Optional: Use a pre-defined assistant - TODO: Get this from env vars or config
  vapiAssistantConfig?: any; // Optional: Use inline config
}

type ChatMode = "text" | "voice";

export function ChatInterface({
  messages,
  onSendMessage,
  isProcessing,
  vapiKey,
  vapiAssistantId,
  vapiAssistantConfig,
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null); // Use Vapi type
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVapiConnecting, setIsVapiConnecting] = useState(false); // More specific state for connection attempt
  const [isVapiEnding, setIsVapiEnding] = useState(false); // State for when stop() is called
  const [isMuted, setIsMuted] = useState(false);
  const [lastVapiError, setLastVapiError] = useState<string | null>(null);

  // Initialize Vapi and set up event listeners
  useEffect(() => {
    if (!vapiKey) {
      console.warn("Vapi key not provided.");
      return;
    }

    console.log("Initializing Vapi...");
    const vapi = new Vapi(vapiKey);
    setVapiInstance(vapi);
    setLastVapiError(null); // Clear previous errors

    vapi.on("call-start", () => {
      console.log("Vapi Call has started.");
      setIsCallActive(true);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setLastVapiError(null);
    });

    vapi.on("call-end", () => {
      console.log("Vapi Call has ended.");
      setIsCallActive(false);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setIsMuted(false); // Reset mute state on call end
    });

    vapi.on("speech-start", () => console.log("Assistant speech started."));
    vapi.on("speech-end", () => console.log("Assistant speech ended."));
    // vapi.on("volume-level", (level) => console.log(`Volume: ${level}`)); // Often too noisy
    vapi.on("message", (msg) => console.log("Vapi message:", msg));

    vapi.on("error", (e) => {
      console.error("Vapi Error:", e);
      setLastVapiError(e?.message || "An unknown Vapi error occurred.");
      setIsCallActive(false); // Ensure call state is reset on error
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
    });

    // Cleanup function: stop call and remove listeners
    return () => {
      console.log("Cleaning up Vapi instance...");
      if (vapi) {
        // Check if stop method exists before calling
        if (typeof vapi.stop === "function") {
          try {
            console.log("Attempting to stop Vapi call on unmount...");
            vapi.stop();
          } catch (stopError) {
            console.error("Error stopping Vapi during cleanup:", stopError);
          }
        } else {
          console.warn("vapi.stop is not available on cleanup");
        }
        // Remove all listeners attached to this instance
        // Note: Vapi SDK might not have a specific removeAllListeners,
        // but creating a new instance on key change implicitly handles this.
      }
      setVapiInstance(null);
      setIsCallActive(false);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setLastVapiError(null);
    };
  }, [vapiKey]); // Re-initialize ONLY if vapiKey changes

  // Text chat auto-scroll effect
  useEffect(() => {
    if (chatMode === "text") {
      const scrollAreaElement = scrollAreaRef.current;
      if (scrollAreaElement) {
        const viewport = scrollAreaElement.querySelector<HTMLDivElement>(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          // Use requestAnimationFrame for smoother scrolling after render
          requestAnimationFrame(() => {
            viewport.scrollTo({
              top: viewport.scrollHeight,
              behavior: "smooth",
            });
          });
        }
      }
    }
  }, [messages, chatMode]); // Trigger on new messages or mode change to text

  // Vapi Actions
  const startVapiCall = async () => {
    if (!vapiInstance || isCallActive || isVapiConnecting || isVapiEnding)
      return;

    const assistantOptions = vapiAssistantId
      ? vapiAssistantId
      : vapiAssistantConfig;
    if (!assistantOptions) {
      console.error("Vapi requires either an assistant ID or config to start.");
      setLastVapiError("Missing Vapi Assistant ID or Configuration.");
      return;
    }

    console.log("Attempting to start Vapi call with:", assistantOptions);
    setIsVapiConnecting(true);
    setLastVapiError(null);
    try {
      await vapiInstance.start(assistantOptions);
      // Success state change (isCallActive=true) is handled by the 'call-start' event listener
    } catch (e: any) {
      console.error("Failed to start Vapi call:", e);
      setLastVapiError(e?.message || "Failed to start call.");
      setIsVapiConnecting(false); // Reset connecting state on failure
    }
  };

  const stopVapiCall = () => {
    if (!vapiInstance || !isCallActive || isVapiConnecting || isVapiEnding)
      return;
    console.log("Attempting to stop Vapi call...");
    setIsVapiEnding(true); // Indicate the stopping process has started
    setLastVapiError(null);
    try {
      vapiInstance.stop();
      // Success state change (isCallActive=false) is handled by the 'call-end' event listener
    } catch (e: any) {
      console.error("Error stopping Vapi call:", e);
      setLastVapiError(e?.message || "Failed to stop call.");
      setIsVapiEnding(false); // Reset ending state on failure
    }
  };

  const toggleMute = () => {
    if (!vapiInstance || !isCallActive) return;
    const newMutedState = !isMuted;
    console.log(newMutedState ? "Muting microphone" : "Unmuting microphone");
    try {
      vapiInstance.setMuted(newMutedState);
      setIsMuted(newMutedState);
    } catch (e: any) {
      console.error("Failed to toggle mute:", e);
      setLastVapiError(e?.message || "Failed to toggle mute state.");
    }
  };

  // Determine combined processing state for UI feedback
  const isVoiceProcessing = isVapiConnecting || isVapiEnding;

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Tabs Navigation */}
      <Tabs
        value={chatMode}
        onValueChange={(value) => {
          // Prevent switching tabs if a call is active or connecting/ending
          if (isCallActive || isVoiceProcessing) {
            console.warn(
              "Cannot switch tabs during active or transitioning voice call."
            );
            return;
          }
          setChatMode(value as ChatMode);
          setLastVapiError(null); // Clear errors when switching tabs
        }}
        className="flex flex-col flex-grow min-h-0" // Ensure Tabs takes full height and allows content scrolling
      >
        <TabsList className="shrink-0 mx-auto grid w-full max-w-md grid-cols-2 mb-2">
          <TabsTrigger
            value="text"
            disabled={isCallActive || isVoiceProcessing}
          >
            Text Chat
          </TabsTrigger>
          <TabsTrigger
            value="voice"
            disabled={isCallActive || isVoiceProcessing}
          >
            Voice Chat
          </TabsTrigger>
        </TabsList>

        {/* Text Chat Pane */}
        <TabsContent
          value="text"
          className="flex flex-col flex-grow overflow-hidden data-[state=inactive]:hidden" // Hide inactive tab content
        >
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {" "}
              {/* Added padding bottom */}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isProcessing && ( // Text chat specific processing indicator
                <div className="flex justify-start items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                    {/* Bot Icon Placeholder */} AI
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none animate-pulse">
                    <span className="text-sm italic">Typing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <ChatInputArea
            onSendMessage={onSendMessage}
            isSending={isProcessing}
          />
        </TabsContent>

        {/* Voice Chat Pane */}
        <TabsContent
          value="voice"
          className="flex-grow p-4 flex flex-col items-center justify-center data-[state=inactive]:hidden" // Hide inactive tab content
        >
          <div className="space-y-4 text-center max-w-sm">
            {/* Status Message */}
            <p className="text-muted-foreground text-sm min-h-[20px]">
              {" "}
              {/* Reserve space */}
              {lastVapiError ? (
                <span className="text-red-500">Error: {lastVapiError}</span>
              ) : isCallActive ? (
                "Voice call in progress..."
              ) : isVapiConnecting ? (
                "Connecting call..."
              ) : isVapiEnding ? (
                "Ending call..."
              ) : (
                "Ready to start voice call."
              )}
            </p>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-3">
              {!isCallActive ? (
                <Button
                  onClick={startVapiCall}
                  disabled={
                    !vapiInstance ||
                    isVoiceProcessing ||
                    (!vapiAssistantId && !vapiAssistantConfig)
                  }
                  size="lg"
                >
                  {isVapiConnecting ? "Starting..." : "Start Voice Call"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={stopVapiCall}
                    variant="destructive"
                    disabled={isVoiceProcessing}
                    size="lg"
                  >
                    {isVapiEnding ? "Stopping..." : "Stop Call"}
                  </Button>
                  <Button
                    onClick={toggleMute}
                    variant="outline"
                    disabled={isVoiceProcessing}
                    size="lg"
                    className={isMuted ? "ring-2 ring-yellow-500" : ""} // Indicate muted state
                  >
                    {isMuted ? "Unmute Mic" : "Mute Mic"}
                  </Button>
                </>
              )}
            </div>

            {/* Configuration Warning */}
            {!vapiAssistantId &&
              !vapiAssistantConfig &&
              !isCallActive &&
              !isVoiceProcessing &&
              !lastVapiError && (
                <p className="text-xs text-orange-500 mt-2">
                  Please provide a Vapi Assistant ID or Configuration via props.
                </p>
              )}

            {/* Optional: Add visualizer or transcript display here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
