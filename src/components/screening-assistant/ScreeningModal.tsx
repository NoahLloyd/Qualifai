"use client";

import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "@/components/ui/button";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { InitialStage } from "./stages/InitialStage";
import { GuidanceStage } from "./stages/GuidanceStage";
import { UploadStage } from "./stages/UploadStage";
import { ChatStage } from "./stages/ChatStage";
import { X } from "lucide-react"; // Icon for close button
import { CompletionStage } from "./stages/CompletionStage"; // Import CompletionStage
// import { CompletionStage } from './stages/CompletionStage';

interface ScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScreeningModal({ isOpen, onClose }: ScreeningModalProps) {
  const { currentStage, resetFlow } = useScreeningFlow();
  const nodeRef = useRef(null); // Ref for CSSTransition

  const handleClose = () => {
    onClose();
    // Delay reset until after the exit transition completes (match CSS duration)
    setTimeout(() => {
      resetFlow();
    }, 300);
  };

  const renderStage = () => {
    switch (currentStage) {
      case "initial":
        // Pass handleClose directly to InitialStage for the "Exit" button
        return <InitialStage onClose={handleClose} />;
      case "guidance":
        return <GuidanceStage />;
      case "upload":
        return <UploadStage />;
      case "chat":
        return <ChatStage />;
      case "completion": // Add case for completion stage
        return <CompletionStage />;
      case "cancelled": // This stage is set by CompletionStage usually
      case "submitted": // This stage is set by CompletionStage usually
        handleClose(); // Should trigger close
        return null;
      default:
        return <div>Unknown Stage</div>;
    }
  };

  // Determine max-width based on stage for better centering of content
  const getMaxWidthClass = () => {
    switch (currentStage) {
      case "initial":
      case "guidance":
      case "completion": // Assuming completion also uses similar width
        return "max-w-xl"; // Centered, moderate width
      case "upload":
        return "max-w-2xl"; // Slightly wider for file inputs
      case "chat":
        return "max-w-4xl"; // Widest for chat interface
      default:
        return "max-w-xl";
    }
  };

  return (
    <CSSTransition
      in={
        isOpen && currentStage !== "cancelled" && currentStage !== "submitted"
      }
      timeout={300}
      classNames={{
        enter: "screening-overlay-enter",
        enterActive: "screening-overlay-enter-active",
        exit: "screening-overlay-exit",
        exitActive: "screening-overlay-exit-active",
      }}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="screening-overlay flex flex-col items-center justify-center p-4"
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
          aria-label="Close screening"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Stage Content Area with Dynamic Width */}
        <div
          className={`w-full h-full flex items-center justify-center ${getMaxWidthClass()}`}
        >
          <div className="bg-background rounded-lg shadow-xl w-full h-[calc(100vh-8rem)] max-h-[900px] overflow-hidden flex flex-col">
            {/* Ensure stages fill this container */}
            {renderStage()}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
