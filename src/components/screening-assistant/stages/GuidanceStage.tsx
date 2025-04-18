"use client";

import { Button } from "@/components/ui/button";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { Clock, ShieldCheck } from "lucide-react"; // Using lucide-react icons

export function GuidanceStage() {
  const { setCurrentStage } = useScreeningFlow();

  const handleNext = () => {
    setCurrentStage("upload"); // Move to the upload stage
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Welcome to the Qualifai Screener!
      </h2>
      <p className="mb-6 text-muted-foreground">
        This quick interactive session helps us understand your background
        beyond your resume. It ensures your unique skills and experiences align
        perfectly with the Design Engineer role, giving you the best chance to
        stand out.
      </p>

      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Clock className="w-5 h-5 text-primary" />
        <span>
          Estimated time: <strong>5 minutes</strong>
        </span>
      </div>

      <div className="mb-8 flex items-start gap-3 text-sm text-muted-foreground">
        <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <span>
          <strong>Privacy Assurance:</strong> Your responses and documents are
          confidential and used solely for evaluating your application for this
          role. We don't share or sell your data.
        </span>
      </div>

      <div className="mt-auto flex justify-end">
        {" "}
        {/* Push button to the bottom */}
        <Button onClick={handleNext}>Let's Get Started</Button>
      </div>
    </div>
  );
}
