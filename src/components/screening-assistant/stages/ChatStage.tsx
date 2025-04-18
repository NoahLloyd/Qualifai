"use client";

import React, { useEffect, useState } from "react";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { ChatInterface } from "../ChatInterface";
import { getNextQuestion, chatFlowData } from "@/lib/data"; // Use specific imports
import { Button } from "@/components/ui/button";

export function ChatStage() {
  const {
    messages,
    addMessage,
    isProcessing,
    setIsProcessing,
    setCurrentStage,
  } = useScreeningFlow();
  const [showFinishButton, setShowFinishButton] = useState(false);

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

    // Calculate based on the number of messages *after* adding the user's message
    const nextQuestion = getNextQuestion(messages.length + 1); // +1 for the message just added

    setIsProcessing(false);

    // 3. Add AI response (next question) or conclude
    if (nextQuestion) {
      addMessage({ sender: "ai", text: nextQuestion.aiPrompt });
    } else {
      // No more questions - conversation is considered complete
      addMessage({
        sender: "ai",
        text: "Thanks! That's all the information I need for this initial screening. Please proceed to the final step.",
      });
      setShowFinishButton(true);
    }
  };

  const handleFinish = () => {
    setCurrentStage("completion");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold p-4 border-b text-center bg-background">
        Conversational Assessment
      </h2>
      <div className="flex-grow relative">
        {" "}
        {/* Make this relative for potential absolute positioning inside ChatInterface */}
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>
      {showFinishButton && !isProcessing && (
        <div className="p-4 border-t flex justify-end bg-background">
          <Button onClick={handleFinish}>Proceed to Final Step</Button>
        </div>
      )}
    </div>
  );
}
