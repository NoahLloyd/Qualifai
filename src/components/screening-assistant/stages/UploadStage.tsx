"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScreeningFlow } from "@/contexts/ScreeningFlowContext";
import {
  Upload,
  Link as LinkIcon,
  X,
  Plus,
  FileText,
  FileUp,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable component for the file upload box
interface FileUploadBoxProps {
  id: string;
  label: string;
  uploadedFileName: string | null;
  onUploadClick: () => void;
  onRemoveClick: () => void;
  accept: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileUploadBox({
  id,
  label,
  uploadedFileName,
  onUploadClick,
  onRemoveClick,
  accept,
  inputRef,
  onFileChange,
}: FileUploadBoxProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-base font-semibold mb-2 block">
        {label}
      </Label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={id}
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors",
            uploadedFileName
              ? "border-primary/50"
              : "border-muted-foreground/30"
          )}
          onClick={(e) => {
            if (uploadedFileName) e.preventDefault();
          }} // Prevent opening file dialog if already uploaded via this label
        >
          {!uploadedFileName ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX (MAX. 5MB)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <FileText className="w-8 h-8 mb-4 text-primary" />
              <p
                className="mb-1 text-sm font-medium text-foreground truncate max-w-full px-2"
                title={uploadedFileName}
              >
                {uploadedFileName}
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onUploadClick();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <Upload className="mr-1 h-3 w-3" /> Replace
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveClick();
                  }}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <X className="mr-1 h-3 w-3" /> Remove
                </Button>
              </div>
            </div>
          )}
          <input
            id={id}
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={onFileChange}
            accept={accept}
          />
        </label>
      </div>
    </div>
  );
}

// Interface for UploadStage props
interface UploadStageProps {
  onNext: () => void;
  onGoBack: () => void;
}

// Main Upload Stage Component
export function UploadStage({ onNext, onGoBack }: UploadStageProps) {
  const { uploadedFiles, setUploadedFile, addLink, removeLink } =
    useScreeningFlow();
  const [newLink, setNewLink] = useState("");

  // Refs for hidden file inputs
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);

  const handleNext = () => {
    onNext();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "coverLetter"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic size check (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        event.target.value = "";
        return;
      }
      setUploadedFile(type, file.name);
    }
    event.target.value = ""; // Reset input value
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      if (newLink.startsWith("http://") || newLink.startsWith("https://")) {
        if (uploadedFiles.links.length < 5) {
          // Limit links
          addLink(newLink.trim());
          setNewLink("");
        } else {
          alert("You can add a maximum of 5 links.");
        }
      } else {
        alert("Please enter a valid URL starting with http:// or https://");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
        Upload Your Documents
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Please upload your resume and cover letter. You can also add links to
        your portfolio or other relevant online profiles. These documents help
        us understand your qualifications better.
      </p>

      {/* Use a grid layout for the upload sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FileUploadBox
          id="resume-upload"
          label="Resume*"
          uploadedFileName={uploadedFiles.resume}
          onUploadClick={() => resumeInputRef.current?.click()}
          onRemoveClick={() => setUploadedFile("resume", null)}
          accept=".pdf,.doc,.docx"
          inputRef={resumeInputRef}
          onFileChange={(e) => handleFileChange(e, "resume")}
        />
        <FileUploadBox
          id="cover-letter-upload"
          label="Cover Letter (Optional)"
          uploadedFileName={uploadedFiles.coverLetter}
          onUploadClick={() => coverLetterInputRef.current?.click()}
          onRemoveClick={() => setUploadedFile("coverLetter", null)}
          accept=".pdf,.doc,.docx"
          inputRef={coverLetterInputRef}
          onFileChange={(e) => handleFileChange(e, "coverLetter")}
        />
      </div>

      {/* Links Section */}
      <div className="mb-8">
        <Label
          htmlFor="link-input"
          className="text-base font-semibold mb-2 block"
        >
          Relevant Links (Portfolio, LinkedIn, etc.)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="link-input"
            type="url"
            placeholder="https://yourportfolio.com"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="flex-grow"
            aria-label="Add relevant link"
          />
          <Button
            size="icon"
            onClick={handleAddLink}
            disabled={!newLink.trim() || uploadedFiles.links.length >= 5}
            className="flex-shrink-0"
            aria-label="Add link"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="mt-3 space-y-2">
          {uploadedFiles.links.map((link, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm bg-muted p-2.5 rounded"
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-muted-foreground" title={link}>
                  {link}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => removeLink(link)}
                aria-label={`Remove link ${link}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
          {uploadedFiles.links.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">
              No links added yet.
            </p>
          )}
        </ul>
      </div>

      <div className="mt-auto flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onGoBack} size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} size="lg">
          Continue to Assessment
        </Button>
      </div>
    </div>
  );
}
