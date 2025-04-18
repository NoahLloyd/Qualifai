"use client";

import { Button } from "@/components/ui/button";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";

interface InitialStageProps {
  onClose: () => void; // Function to close the modal/flow
}

export function InitialStage({ onClose }: InitialStageProps) {
  const { setCurrentStage } = useScreeningFlow();

  const handleBegin = () => {
    setCurrentStage("guidance"); // Move to the next stage
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Qualifai Screening Assistant
      </h2>
      <p className="mb-8 text-muted-foreground">
        Ready to start your application?
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onClose}>
          Exit
        </Button>
        <Button onClick={handleBegin}>Begin Application</Button>
      </div>
    </div>
  );
}
