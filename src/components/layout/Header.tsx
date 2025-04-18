"use client";

// import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { LogOut } from "lucide-react";
import { LayoutGrid /*, LogOut*/ } from "lucide-react"; // Example icons

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="h-8 w-8">
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Toggle Apps</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="overflow-hidden rounded-full h-8 w-8"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
          <AvatarFallback>AN</AvatarFallback> {/* Applicant Name Initials */}
        </Avatar>
      </Button>
    </header>
  );
}
