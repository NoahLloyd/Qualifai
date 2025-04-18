"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessage } from "@/lib/types"; // Import ChatMessage type

// Define the possible stages
export type ScreeningStage =
  | "initial"
  | "guidance"
  | "upload"
  | "chat"
  | "completion"
  | "cancelled"
  | "submitted";

// Define the structure for uploaded files
interface UploadedFilesState {
  resume: string | null;
  coverLetter: string | null;
  links: string[];
}

// Define the shape of the context data
interface ScreeningFlowContextType {
  currentStage: ScreeningStage;
  uploadedFiles: UploadedFilesState;
  messages: ChatMessage[]; // Add messages state
  isProcessing: boolean; // Add processing state for AI responses
  setCurrentStage: (stage: ScreeningStage) => void;
  setUploadedFile: (
    type: "resume" | "coverLetter",
    name: string | null
  ) => void;
  addLink: (link: string) => void;
  removeLink: (link: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void; // Function to add a message
  setIsProcessing: (processing: boolean) => void; // Function to set processing state
  resetFlow: () => void; // Function to reset the flow
}

// Create the context with a default undefined value
const ScreeningFlowContext = createContext<
  ScreeningFlowContextType | undefined
>(undefined);

// Define the initial state with explicit type
const initialState: {
  currentStage: ScreeningStage;
  uploadedFiles: UploadedFilesState;
  messages: ChatMessage[]; // Initialize messages
  isProcessing: boolean; // Initialize processing state
} = {
  currentStage: "initial",
  uploadedFiles: {
    resume: null,
    coverLetter: null,
    links: [],
  },
  messages: [], // Start with no messages
  isProcessing: false,
};

// Create the provider component
export const ScreeningFlowProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentStage, setCurrentStage] = useState<ScreeningStage>(
    initialState.currentStage
  );
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
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Reset function
  const resetFlow = () => {
    setCurrentStage(initialState.currentStage);
    setUploadedFiles(initialState.uploadedFiles);
    setMessages(initialState.messages); // Reset messages
    setIsProcessing(initialState.isProcessing); // Reset processing state
  };

  const value = {
    currentStage,
    uploadedFiles,
    messages, // Provide messages
    isProcessing, // Provide processing state
    setCurrentStage,
    setUploadedFile,
    addLink,
    removeLink,
    addMessage, // Provide addMessage function
    setIsProcessing, // Provide setIsProcessing function
    resetFlow,
  };

  return (
    <ScreeningFlowContext.Provider value={value}>
      {children}
    </ScreeningFlowContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useScreeningFlow = () => {
  const context = useContext(ScreeningFlowContext);
  if (context === undefined) {
    throw new Error(
      "useScreeningFlow must be used within a ScreeningFlowProvider"
    );
  }
  return context;
};
