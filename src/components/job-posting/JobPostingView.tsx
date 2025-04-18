"use client";

import React from "react";
import { jobDetailsData } from "@/lib/data";
import { JobDetailsCard } from "./JobDetailsCard";
// Import the modal component when created
// import { ScreeningModal } from '@/components/screening-assistant/ScreeningModal';

export function JobPostingView() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleApplyClick = () => {
    console.log("Apply button clicked!");
    setIsModalOpen(true);
    // TODO: Open the ScreeningModal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <JobDetailsCard job={jobDetailsData} onApplyClick={handleApplyClick} />

      {/* Render the modal conditionally */}
      {/* isModalOpen && <ScreeningModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
      {/* Placeholder for modal state demonstration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Screening Modal Will Open Here</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Close Placeholder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
