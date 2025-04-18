"use client";

import React from "react";
import { JobDetails } from "@/lib/types";
import { JobDetailsCard } from "./JobDetailsCard";

interface JobPostingViewProps {
  job: JobDetails;
  onStartApplyFlow: () => void;
}

export function JobPostingView({ job, onStartApplyFlow }: JobPostingViewProps) {
  const handleApplyClick = () => {
    onStartApplyFlow();
  };

  return (
    <>
      <JobDetailsCard job={job} onApplyClick={handleApplyClick} />
    </>
  );
}
