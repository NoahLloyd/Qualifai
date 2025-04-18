"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building, ArrowRight } from "lucide-react";
import { JobDetails } from "@/lib/types";
import { cn } from "@/lib/utils";

// Use Pick to only require the necessary properties for the list item
interface JobListItemProps {
  job: Pick<JobDetails, "id" | "title" | "company" | "location">;
  isActive?: boolean; // Optional flag to indicate if this is the currently viewed job
  onClick: (jobId: string) => void;
}

export function JobListItem({
  job,
  isActive = false,
  onClick,
}: JobListItemProps) {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200 cursor-pointer",
        isActive && "ring-2 ring-primary border-primary" // Highlight if active
      )}
      onClick={() => onClick(job.id)} // Trigger parent handler on click
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(job.id)} // Allow activation with keyboard
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{job.location}</span>
          </div>
        </div>
      </CardHeader>
      {/* We might add a short description snippet here later */}
      {/* <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">A short description...</p>
      </CardContent> */}
      <CardFooter className="justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary"
        >
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
