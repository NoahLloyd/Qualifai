"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { CheckCircle, XCircle, FileText, Link as LinkIcon } from "lucide-react";

export function CompletionStage() {
  const { setCurrentStage, uploadedFiles } = useScreeningFlow();

  const handleSubmit = () => {
    console.log("Submitting application with:", uploadedFiles);
    // In a real app, you would send data to the backend here
    setCurrentStage("submitted"); // This will trigger the modal close via ScreeningModal logic
  };

  const handleCancel = () => {
    console.log("Cancelling application.");
    setCurrentStage("cancelled"); // This will also trigger the modal close
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h2 className="text-2xl font-semibold mb-4">Ready to Submit?</h2>
      <p className="mb-8 text-muted-foreground max-w-md">
        You've completed the initial screening. Review your provided information
        below. Click "Submit Application" to finalize or "Cancel" to withdraw.
      </p>

      {/* Optional: Summary of uploaded info */}
      <div className="mb-8 text-sm text-left bg-muted/50 p-4 rounded-lg w-full max-w-sm">
        <h3 className="font-medium mb-2 text-foreground">
          Application Summary:
        </h3>
        <ul className="space-y-1.5 text-muted-foreground">
          {uploadedFiles.resume && (
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Resume: {uploadedFiles.resume}</span>
            </li>
          )}
          {uploadedFiles.coverLetter && (
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                Cover Letter: {uploadedFiles.coverLetter}
              </span>
            </li>
          )}
          {uploadedFiles.links.length > 0 && (
            <li className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 flex-shrink-0" />
              <span>{uploadedFiles.links.length} Link(s) provided</span>
            </li>
          )}
          {/* Add Chat Summary placeholder if needed later */}
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleCancel}>
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Application
        </Button>
        <Button onClick={handleSubmit}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit Application
        </Button>
      </div>
    </div>
  );
}
