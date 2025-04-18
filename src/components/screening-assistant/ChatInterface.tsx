"use client";

import React, { useRef, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInputArea } from "./ChatInputArea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean; // Indicates if AI is "thinking" (for text chat)
  vapiKey: string; // Vapi Public Key - TODO: Get this from env vars or secure source
  vapiAssistantId?: string; // Optional: Use a pre-defined assistant - TODO: Get this from env vars or config
  vapiAssistantConfig?: any; // Optional: Use inline config
}

type ChatMode = "text" | "voice";

const CALL_DURATION_TARGET_SECONDS = 180; // 3 minutes

export function ChatInterface({
  messages,
  onSendMessage,
  isProcessing,
  vapiKey,
  vapiAssistantId,
  vapiAssistantConfig,
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("voice");
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null); // Use Vapi type
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVapiConnecting, setIsVapiConnecting] = useState(false); // More specific state for connection attempt
  const [isVapiEnding, setIsVapiEnding] = useState(false); // State for when stop() is called
  const [isMuted, setIsMuted] = useState(false);
  const [lastVapiError, setLastVapiError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0); // State for call duration timer
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval timer
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  // Initialize Vapi and set up event listeners
  useEffect(() => {
    if (!vapiKey) {
      console.warn("Vapi key not provided.");
      setLastVapiError("Vapi Key not configured.");
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
      setCallDuration(0); // Reset timer on new call
    });

    vapi.on("call-end", () => {
      console.log("Vapi Call has ended.");
      setIsCallActive(false);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setIsMuted(false);
      setIsAssistantSpeaking(false);
      setCallDuration(0); // Reset timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant speech started.");
      setIsAssistantSpeaking(true);
    });
    vapi.on("speech-end", () => {
      console.log("Assistant speech ended.");
      setIsAssistantSpeaking(false);
    });
    vapi.on("message", (msg) => console.log("Vapi message:", msg));

    vapi.on("error", (e: any) => {
      console.error("Vapi Error:", e);
      setLastVapiError(e?.message || "An unknown Vapi error occurred.");
      setIsCallActive(false);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setIsAssistantSpeaking(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    // Cleanup function: stop call and remove listeners
    return () => {
      console.log("Cleaning up Vapi instance...");
      if (vapi && typeof vapi.stop === "function") {
        try {
          console.log("Attempting to stop Vapi call on unmount...");
          vapi.stop();
        } catch (stopError) {
          console.error("Error stopping Vapi during cleanup:", stopError);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setVapiInstance(null);
      setIsCallActive(false);
      setIsVapiConnecting(false);
      setIsVapiEnding(false);
      setIsAssistantSpeaking(false);
      setLastVapiError(null);
      setCallDuration(0);
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

  // Effect for Call Duration Timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prevDuration) => {
          const newDuration = prevDuration + 1;
          if (newDuration >= CALL_DURATION_TARGET_SECONDS) {
            if (timerRef.current) clearInterval(timerRef.current);
            return CALL_DURATION_TARGET_SECONDS;
          }
          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup interval on component unmount or when call becomes inactive
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCallActive]);

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
    } catch (e: any) {
      console.error("Failed to start Vapi call:", e);
      setLastVapiError(e?.message || "Failed to start call.");
      setIsVapiConnecting(false);
    }
  };

  const stopVapiCall = () => {
    if (!vapiInstance || !isCallActive || isVapiConnecting || isVapiEnding)
      return;
    console.log("Attempting to stop Vapi call...");
    setIsVapiEnding(true);
    setLastVapiError(null);
    try {
      vapiInstance.stop();
    } catch (e: any) {
      console.error("Error stopping Vapi call:", e);
      setLastVapiError(e?.message || "Failed to stop call.");
      setIsVapiEnding(false);
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

  const isVoiceProcessing = isVapiConnecting || isVapiEnding;
  const callProgress = (callDuration / CALL_DURATION_TARGET_SECONDS) * 100;

  // Helper function to render status text
  const getStatusText = () => {
    if (lastVapiError)
      return <span className="text-destructive">Error: {lastVapiError}</span>;
    if (isVapiConnecting) return "Connecting...";
    if (isVapiEnding) return "Ending call...";
    if (isCallActive)
      return isAssistantSpeaking ? "Assistant speaking..." : "Listening...";
    return "Ready to start voice call.";
  };

  // Render Active Voice Call UI
  const renderActiveCallUI = () => (
    <div className="flex flex-col items-center justify-between h-full p-6 pt-12 pb-10 bg-background text-foreground">
      {/* Top Status Area */}
      <div className="text-center">
        <p className="text-lg font-medium mb-4 min-h-[28px]">
          {getStatusText()}
        </p>
      </div>

      {/* Voice Visualization Area - Simplified concentric circles */}
      <div className="w-48 h-48 relative flex items-center justify-center mb-6">
        <div
          className={`absolute w-full h-full rounded-full bg-primary/10 transition-transform duration-300 ease-in-out ${
            isAssistantSpeaking ? "scale-110" : "scale-100"
          }`}
        ></div>
        <div
          className={`absolute w-3/4 h-3/4 rounded-full bg-primary/30 transition-all duration-300 ease-in-out ${
            isAssistantSpeaking
              ? "scale-100 opacity-100"
              : "scale-90 opacity-70"
          }`}
        ></div>
        <div className="absolute w-1/2 h-1/2 rounded-full bg-primary/50"></div>
      </div>

      {/* Bottom Controls Area */}
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Progress Bar and Label */}
        <div className="w-full mb-6">
          <label
            htmlFor="call-progress"
            className="text-sm text-muted-foreground mb-1 block text-center"
          >
            Estimated Progress
          </label>
          <Progress
            id="call-progress"
            value={callProgress}
            className="w-full h-2"
          />
        </div>

        {/* Buttons - Equal Size */}
        <div className="flex items-center justify-center space-x-6">
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className={`rounded-full w-16 h-16 border-2 ${
              isMuted
                ? "border-yellow-500 ring-2 ring-yellow-500/50"
                : "border-border"
            }`}
            disabled={isVoiceProcessing}
            aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </Button>
          <Button
            onClick={stopVapiCall}
            variant="destructive"
            size="icon"
            className="rounded-full w-16 h-16 disabled:opacity-50"
            disabled={isVoiceProcessing}
            aria-label={isVapiEnding ? "Ending Call" : "End Call"}
          >
            {isVapiEnding ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <PhoneOff size={28} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Render Tabs or Active Call UI based on isCallActive */}
      {!isCallActive ? (
        <Tabs
          value={chatMode}
          onValueChange={(value) => {
            if (isVoiceProcessing) return; // Prevent switching if connecting/ending
            setChatMode(value as ChatMode);
            setLastVapiError(null);
          }}
          className="flex flex-col flex-grow min-h-0 pt-2"
        >
          <TabsList className="shrink-0 mx-auto grid w-full max-w-xs grid-cols-2 mb-2">
            <TabsTrigger value="text" disabled={isVoiceProcessing}>
              Text Chat
            </TabsTrigger>
            <TabsTrigger value="voice" disabled={isVoiceProcessing}>
              Voice Chat
            </TabsTrigger>
          </TabsList>

          {/* Text Chat Pane */}
          <TabsContent
            value="text"
            className="flex flex-col flex-grow overflow-hidden data-[state=inactive]:hidden bg-muted/30"
          >
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isProcessing && (
                  <div className="flex justify-start items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                      AI
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

          {/* Voice Chat Pane (Pre-call state) */}
          <TabsContent
            value="voice"
            className="flex-grow p-4 flex flex-col items-center justify-center data-[state=inactive]:hidden bg-muted/30"
          >
            <div className="space-y-6 text-center max-w-sm">
              <h3 className="text-lg font-medium text-foreground">
                Start Voice Assessment
              </h3>
              <p
                className={`text-sm min-h-[40px] ${
                  lastVapiError ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {getStatusText()}
              </p>

              <Button
                onClick={startVapiCall}
                disabled={
                  !vapiInstance ||
                  isVoiceProcessing ||
                  (!vapiAssistantId && !vapiAssistantConfig)
                }
                size="lg"
                className="w-full max-w-xs"
              >
                {isVapiConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Starting...
                  </>
                ) : (
                  "Start Voice Call"
                )}
              </Button>

              {!vapiAssistantId &&
                !vapiAssistantConfig &&
                !isCallActive &&
                !isVoiceProcessing &&
                !lastVapiError && (
                  <p className="text-xs text-orange-500 mt-2">
                    Please provide a Vapi Assistant ID or Configuration via
                    props.
                  </p>
                )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        renderActiveCallUI()
      )}
    </div>
  );
}
