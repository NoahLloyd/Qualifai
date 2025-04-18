"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import { Upload, Link as LinkIcon, X, Plus } from "lucide-react";

export function UploadStage() {
  const {
    setCurrentStage,
    uploadedFiles,
    setUploadedFile,
    addLink,
    removeLink,
  } = useScreeningFlow();
  const [newLink, setNewLink] = useState("");

  // Refs for hidden file inputs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    setCurrentStage("chat"); // Move to the chat stage
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "coverLetter"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(type, file.name);
    }
    // Reset input value to allow uploading the same file again if needed
    event.target.value = "";
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      // Basic validation: check if it looks somewhat like a URL
      if (newLink.startsWith("http://") || newLink.startsWith("https://")) {
        addLink(newLink.trim());
        setNewLink("");
      } else {
        // TODO: Add proper validation feedback (e.g., toast notification)
        alert("Please enter a valid URL starting with http:// or https://");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Upload Your Documents</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Please upload your resume and cover letter. You can also add links to
        your portfolio or other relevant online profiles. These documents help
        us understand your qualifications better.
      </p>

      {/* Resume Upload */}
      <div className="mb-4">
        <Label htmlFor="resume-upload" className="text-sm font-medium">
          Resume
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => resumeInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadedFiles.resume ? "Replace Resume" : "Upload Resume"}
          </Button>
          <span className="text-sm text-muted-foreground truncate flex-grow min-w-0">
            {uploadedFiles.resume || "No file selected"}
          </span>
          {uploadedFiles.resume && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => setUploadedFile("resume", null)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input
          id="resume-upload"
          type="file"
          ref={resumeInputRef}
          onChange={(e) => handleFileChange(e, "resume")}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
      </div>

      {/* Cover Letter Upload */}
      <div className="mb-6">
        <Label htmlFor="cover-letter-upload" className="text-sm font-medium">
          Cover Letter (Optional)
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => coverLetterInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadedFiles.coverLetter ? "Replace Letter" : "Upload Letter"}
          </Button>
          <span className="text-sm text-muted-foreground truncate flex-grow min-w-0">
            {uploadedFiles.coverLetter || "No file selected"}
          </span>
          {uploadedFiles.coverLetter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => setUploadedFile("coverLetter", null)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input
          id="cover-letter-upload"
          type="file"
          ref={coverLetterInputRef}
          onChange={(e) => handleFileChange(e, "coverLetter")}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
      </div>

      {/* Links Section */}
      <div className="mb-6">
        <Label htmlFor="link-input" className="text-sm font-medium">
          Relevant Links (Portfolio, LinkedIn, etc.)
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="link-input"
            type="url" // Use url type for basic browser validation
            placeholder="https://yourportfolio.com"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="flex-grow"
          />
          <Button
            size="icon"
            onClick={handleAddLink}
            disabled={!newLink.trim()}
            className="flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="mt-3 space-y-2">
          {uploadedFiles.links.map((link, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm bg-muted p-2 rounded"
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-muted-foreground">{link}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => removeLink(link)}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
          {uploadedFiles.links.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No links added yet.
            </p>
          )}
        </ul>
      </div>

      <div className="mt-auto flex justify-end">
        {" "}
        {/* Push button to the bottom */}
        <Button onClick={handleNext}>Continue to Assessment</Button>
      </div>
    </div>
  );
}
