"use client";

import React, { useState, useEffect } from "react";
import { JobPostingView } from "@/components/job-posting/JobPostingView";
import { JobListItem } from "@/components/job-posting/JobListItem";
import { PreScreeningInfo } from "@/components/screening-assistant/PreScreeningInfo";
import { UploadStage } from "@/components/screening-assistant/stages/UploadStage";
import { ChatStage } from "@/components/screening-assistant/stages/ChatStage";
import { CompletionStage } from "@/components/screening-assistant/stages/CompletionStage";
import { sampleJobListings, jobDetailsData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { motion, AnimatePresence } from "framer-motion";

// Define all possible view states
type PageView =
  | "list"
  | "detail"
  | "prescreening"
  | "upload"
  | "chat"
  | "completion";

// Updated Animation variants with slide + fade
const pageVariants = {
  initial: {
    opacity: 0,
    x: "30px", // Start slightly to the right
  },
  in: {
    opacity: 1,
    x: 0, // Animate to center
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    x: "-30px", // Exit slightly to the left
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function HomePage() {
  const [view, setView] = useState<PageView>("list");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { resetFlow } = useScreeningFlow();

  // Reset context state when navigating away from screening flow views
  useEffect(() => {
    if (!["upload", "chat", "completion"].includes(view)) {
      // Check if reset is necessary (e.g., if messages exist)
      // This prevents resetting unnecessarily on initial load
      // resetFlow(); // TODO: Add conditional check here based on context state if needed
    }
  }, [view, resetFlow]);

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setView("detail");
  };

  const handleShowList = () => {
    setSelectedJobId(null);
    setView("list");
    resetFlow(); // Reset flow state when going back to list
  };

  const handleStartApplyFlow = () => {
    setView("prescreening");
  };

  const handleExitPreScreening = () => {
    if (selectedJobId) {
      setView("detail");
    } else {
      setView("list");
    }
  };

  const handleBeginScreening = () => {
    setView("upload"); // Go directly to upload view
    // No need to set context stage here, view handles it
  };

  // Navigation functions for stages
  const handleNavigate = (targetView: PageView) => {
    setView(targetView);
  };

  // Handle submission/cancellation from CompletionStage
  const handleFinishFlow = () => {
    resetFlow();
    setView("list"); // Go back to the job list after completion/cancel
  };

  const currentJobDetails = selectedJobId
    ? sampleJobListings.find((job) => job.id === selectedJobId)
    : null;
  // For detail view, we still use the full jobDetailsData for now
  const detailedJobData =
    selectedJobId === jobDetailsData.id ? jobDetailsData : null;

  return (
    <AnimatePresence mode="wait">
      {view === "list" && (
        <motion.div
          key="list"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col gap-4 h-full"
        >
          <h1 className="text-2xl font-semibold">Available Job Postings</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleJobListings.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                onClick={handleViewDetails}
                isActive={job.id === selectedJobId}
              />
            ))}
          </div>
        </motion.div>
      )}

      {view === "detail" && detailedJobData && (
        <motion.div
          key="detail"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col gap-4 h-full"
        >
          <Button
            variant="outline"
            size="sm"
            className="mb-4 w-fit"
            onClick={handleShowList}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Listings
          </Button>
          <JobPostingView
            job={detailedJobData}
            onStartApplyFlow={handleStartApplyFlow}
          />
        </motion.div>
      )}

      {view === "prescreening" && currentJobDetails && (
        <motion.div
          key="prescreening"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
        >
          <PreScreeningInfo
            jobTitle={currentJobDetails.title}
            companyName={currentJobDetails.company}
            onBegin={handleBeginScreening}
            onExit={handleExitPreScreening}
          />
        </motion.div>
      )}

      {view === "upload" && (
        <motion.div
          key="upload"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col h-full"
        >
          <UploadStage
            onNext={() => handleNavigate("chat")}
            onGoBack={() => handleNavigate("prescreening")}
          />
        </motion.div>
      )}
      {view === "chat" && (
        <motion.div
          key="chat"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col h-full"
        >
          <ChatStage
            onNext={() => handleNavigate("completion")}
            onGoBack={() => handleNavigate("upload")}
          />
        </motion.div>
      )}
      {view === "completion" && (
        <motion.div
          key="completion"
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col h-full"
        >
          <CompletionStage
            onSubmit={handleFinishFlow}
            onCancel={handleFinishFlow}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
