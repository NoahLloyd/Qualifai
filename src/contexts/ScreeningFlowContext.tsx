"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessage } from "@/lib/types"; // Import ChatMessage type

// Define the possible stages - NO LONGER NEEDED FOR VIEW CONTROL
// export type ScreeningStage = ...

// Define the structure for uploaded files
interface UploadedFilesState {
  resume: string | null;
  coverLetter: string | null;
  links: string[];
}

// Define the shape of the context data
interface ScreeningFlowContextType {
  // currentStage: ScreeningStage; // REMOVED
  uploadedFiles: UploadedFilesState;
  messages: ChatMessage[];
  isProcessing: boolean;
  // setCurrentStage: (stage: ScreeningStage) => void; // REMOVED
  setUploadedFile: (
    type: "resume" | "coverLetter",
    name: string | null
  ) => void;
  addLink: (link: string) => void;
  removeLink: (link: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setIsProcessing: (processing: boolean) => void;
  resetFlow: () => void;
}

// Create the context
const ScreeningFlowContext = createContext<
  ScreeningFlowContextType | undefined
>(undefined);

// Define the initial state - REMOVE currentStage
const initialState: {
  // currentStage: ScreeningStage; // REMOVED
  uploadedFiles: UploadedFilesState;
  messages: ChatMessage[];
  isProcessing: boolean;
} = {
  // currentStage: "upload", // REMOVED
  uploadedFiles: {
    resume: null,
    coverLetter: null,
    links: [],
  },
  messages: [],
  isProcessing: false,
};

// Create the provider component
export const ScreeningFlowProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // const [currentStage, setCurrentStage] = useState<ScreeningStage>(initialState.currentStage); // REMOVED
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>(
    initialState.uploadedFiles
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialState.messages
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(
    initialState.isProcessing
  );

  const setUploadedFile = (
    type: "resume" | "coverLetter",
    name: string | null
  ) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: name }));
  };
  const addLink = (link: string) => {
    setUploadedFiles((prev) => ({ ...prev, links: [...prev.links, link] }));
  };
  const removeLink = (link: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l !== link),
    }));
  };
  const addMessage = (messageData: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Reset function
  const resetFlow = () => {
    // setCurrentStage(initialState.currentStage); // REMOVED
    setUploadedFiles(initialState.uploadedFiles);
    setMessages(initialState.messages);
    setIsProcessing(initialState.isProcessing);
  };

  const value = {
    // currentStage, // REMOVED
    uploadedFiles,
    messages,
    isProcessing,
    // setCurrentStage, // REMOVED
    setUploadedFile,
    addLink,
    removeLink,
    addMessage,
    setIsProcessing,
    resetFlow,
  };

  return (
    <ScreeningFlowContext.Provider value={value}>
      {children}
    </ScreeningFlowContext.Provider>
  );
};

export const useScreeningFlow = () => {
  const context = useContext(ScreeningFlowContext);
  if (context === undefined) {
    throw new Error(
      "useScreeningFlow must be used within a ScreeningFlowProvider"
    );
  }
  return context;
};
