"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { CheckCircle, XCircle, Send, CalendarDays } from "lucide-react"; // Updated icons

// Define props
interface CompletionStageProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function CompletionStage({ onSubmit, onCancel }: CompletionStageProps) {
  // Context no longer needed here if summary is removed
  // const { uploadedFiles } = useScreeningFlow();

  const handleSubmit = () => {
    console.log("Submitting application..."); // Simplified log
    onSubmit();
  };

  const handleCancel = () => {
    console.log("Cancelling application.");
    onCancel();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h2 className="text-2xl font-semibold mb-4">Screening Complete!</h2>
      {/* Updated description text */}
      <p className="mb-10 text-muted-foreground max-w-lg">
        You've successfully completed the initial interactive screening. This
        helps us understand your unique skills better and gives your application
        a great chance to stand out.
      </p>

      {/* Next Steps Section */}
      <div className="w-full max-w-md mb-10 p-6 border bg-muted/40 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
          Next Steps
        </h3>
        <div className="flex items-start gap-4 mb-4">
          <Send className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <p className="text-sm text-left text-muted-foreground">
            Clicking "Submit Application" will send your uploaded documents and
            screening responses directly to the hiring team at Snap.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <CalendarDays className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <p className="text-sm text-left text-muted-foreground">
            We typically review applications within 5-7 business days. You can
            track your status under "My Applications".
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={handleCancel} size="lg">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Application
        </Button>
        <Button onClick={handleSubmit} size="lg">
          <Send className="mr-2 h-4 w-4" /> {/* Changed icon */}
          Submit Application
        </Button>
      </div>
    </div>
  );
}
