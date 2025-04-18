"use client";

import { Button } from "@/components/ui/button";
import {
  Clock,
  ShieldCheck,
  ArrowRight,
  X,
  Briefcase,
  Building,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PreScreeningInfoProps {
  jobTitle: string;
  companyName: string;
  onBegin: () => void;
  onExit: () => void;
}

export function PreScreeningInfo({
  jobTitle,
  companyName,
  onBegin,
  onExit,
}: PreScreeningInfoProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full max-w-3xl mx-auto p-4 md:p-6">
      {/* Top Section: Logo, Title, Job/Company Info */}
      <div className="mb-8 flex flex-col items-center text-center w-full">
        <Briefcase className="w-12 h-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-3">Qualifai Screener</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mb-8">
          <Badge
            variant="outline"
            className="py-1.5 px-3 text-sm font-medium flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            {jobTitle}
          </Badge>
          <Badge
            variant="outline"
            className="py-1.5 px-3 text-sm font-medium flex items-center gap-1.5"
          >
            <Building className="w-4 h-4" />
            {companyName}
          </Badge>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8 w-full mb-10">
        <h2 className="text-xl text-center font-semibold mb-3">
          Let's get started!
        </h2>
        <Separator className="w-1/3 mx-auto mb-6" />
        <p className="mb-8 text-center text-muted-foreground">
          This quick interactive session helps us understand your background
          beyond your resume. It ensures your unique skills and experiences
          align perfectly with the role, giving you the best chance to stand
          out.
        </p>

        {/* Details Section: Time & Privacy (Inside the card) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <Clock className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Estimated Time
              </h3>
              <p className="text-sm text-muted-foreground">
                Around <strong>5 minutes</strong> to complete.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-7 h-7 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Privacy Assurance
              </h3>
              <p className="text-sm text-muted-foreground">
                Your responses and documents are confidential and used solely
                for evaluating your application. We don't share or sell your
                data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Now separate from the card) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
        <Button
          variant="outline"
          onClick={onExit}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <X className="mr-2 h-4 w-4" />
          Exit Screening
        </Button>
        <Button
          onClick={onBegin}
          size="lg"
          className="flex-1 sm:flex-none bg-foreground text-background hover:bg-foreground/90"
        >
          Begin Screening
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
