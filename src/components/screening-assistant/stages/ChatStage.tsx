"use client";

import React, { useEffect, useState } from "react";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { ChatInterface } from "../ChatInterface";
import { getNextQuestion, chatFlowData } from "@/lib/data"; // Use specific imports
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Add ArrowLeft

// Define props for ChatStage
interface ChatStageProps {
  onNext: () => void;
  onGoBack: () => void; // Add back navigation prop
}

export function ChatStage({ onNext, onGoBack }: ChatStageProps) {
  // Use props
  const { messages, addMessage, isProcessing, setIsProcessing } =
    useScreeningFlow();
  const [showFinishButton, setShowFinishButton] = useState(false);

  // Get Vapi credentials from environment variables
  const vapiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
  const vapiAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  // Send initial greeting from AI if messages are empty
  useEffect(() => {
    if (messages.length === 0 && chatFlowData.length > 0) {
      // Use the first question from the defined flow
      addMessage({
        sender: "ai",
        text: chatFlowData[0].aiPrompt,
      });
    }
    // Only run once on mount, assuming messages isn't externally modified rapidly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message immediately
    addMessage({ sender: "user", text });
    setIsProcessing(true);
    setShowFinishButton(false); // Hide button while processing new message

    // 2. Simulate AI thinking and determine next step
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 500)
    ); // Simulate varied delay

    const currentMessageCount = messages.length + 1; // +1 for the user message just added

    setIsProcessing(false);

    // Check if we've reached 3 messages (Initial AI + User Reply + This new AI message)
    if (currentMessageCount >= 3) {
      // Conclude the chat
      addMessage({
        sender: "ai",
        text: "Thanks! That's all the information I need for this initial screening. Please proceed to the final step.",
      });
      setShowFinishButton(true);
    } else {
      // This part might not even be reached with the new logic, but keep for potential future expansion
      const nextQuestion = getNextQuestion(currentMessageCount);
      if (nextQuestion) {
        addMessage({ sender: "ai", text: nextQuestion.aiPrompt });
      } else {
        // Fallback conclusion if getNextQuestion logic fails or flow changes
        addMessage({
          sender: "ai",
          text: "Great, thank you for that information. Let's move to the final step.",
        });
        setShowFinishButton(true);
      }
    }
  };

  const handleFinish = () => {
    // Use the onNext prop passed from HomePage
    onNext();
    // setCurrentStage('completion'); // REMOVE direct context update
  };

  // Render error if Vapi key is missing
  if (!vapiKey) {
    console.error(
      "VAPI Key (NEXT_PUBLIC_VAPI_KEY) is not defined in environment variables."
    );
    return (
      <div className="flex flex-col h-full flex-grow min-h-0 items-center justify-center p-4 text-center">
        <h2 className="text-xl font-semibold p-4 text-red-600">
          Configuration Error
        </h2>
        <p className="text-muted-foreground">
          The Voice Chat feature is unavailable because the Vapi API Key is
          missing. Please check the environment configuration.
        </p>
        <div className="mt-4">
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-grow min-h-0">
      <div className="flex-grow relative min-h-0 bg-background">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          vapiKey={vapiKey}
          vapiAssistantId={vapiAssistantId}
        />
      </div>
      {/* Footer Area */}
      <div className="p-4 border-t flex justify-between items-center bg-background flex-shrink-0">
        {/* Back Button - only show if not finished? Or always? Let's show always for now. */}
        <Button variant="outline" onClick={onGoBack} disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {/* Proceed Button - Always visible now */}
        <Button onClick={handleFinish} disabled={isProcessing}>
          Proceed to Final Step
        </Button>
      </div>
    </div>
  );
}
