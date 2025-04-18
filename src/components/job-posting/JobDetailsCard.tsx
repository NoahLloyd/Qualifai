"use client";

import { JobDetails } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MapPin, Building, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDetailsCardProps {
  job: JobDetails;
  onApplyClick: () => void;
}

export function JobDetailsCard({ job, onApplyClick }: JobDetailsCardProps) {
  return (
    <div className="border rounded-lg shadow-sm bg-card text-card-foreground w-full">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none mb-5 text-sm md:text-base">
          {job.description.map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mb-5">
          <h2 className="text-lg md:text-xl font-semibold mb-3 pb-2 border-b">
            Responsibilities
          </h2>
          <ul className="space-y-2 text-muted-foreground mt-3">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-5">
          <h2 className="text-lg md:text-xl font-semibold mb-3 pb-2 border-b">
            Qualifications
          </h2>
          <ul className="space-y-2 text-muted-foreground mt-3">
            {job.qualifications.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {job.niceToHave && job.niceToHave.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 pb-2 border-b">
              Nice to Have
            </h2>
            <ul className="space-y-2 text-muted-foreground mt-3">
              {job.niceToHave.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground/80 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-6">
          <Button size="lg" onClick={onApplyClick}>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
