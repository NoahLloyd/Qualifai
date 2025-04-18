"use client";

import React from "react";
import { jobDetailsData } from "@/lib/data";
import { JobDetailsCard } from "./JobDetailsCard";
import { ScreeningModal } from "@/components/screening-assistant/ScreeningModal";

export function JobPostingView() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleApplyClick = () => {
    console.log("Apply button clicked!");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Context reset is handled within ScreeningModal on close
  };

  return (
    // Removed container, padding, and mx-auto - layout handles spacing
    <>
      <JobDetailsCard job={jobDetailsData} onApplyClick={handleApplyClick} />

      {/* Render the actual modal */}
      <ScreeningModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
