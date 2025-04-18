"use client"; // Need client component for Switch state

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  // Sample state for notification toggles
  const [appStatusUpdates, setAppStatusUpdates] = useState(true);
  const [newJobAlerts, setNewJobAlerts] = useState(false);
  const [promoEmails, setPromoEmails] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Account Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account details and security.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Update Password</Button>
        </CardFooter>
      </Card>

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications from Qualifai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="app-status-updates"
              className="flex flex-col space-y-1"
            >
              <span>Application Status Updates</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive email updates when the status of your job applications
                changes.
              </span>
            </Label>
            <Switch
              id="app-status-updates"
              checked={appStatusUpdates}
              onCheckedChange={setAppStatusUpdates}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="new-job-alerts" className="flex flex-col space-y-1">
              <span>New Job Alerts</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get notified about new job postings matching your profile or
                saved searches.
              </span>
            </Label>
            <Switch
              id="new-job-alerts"
              checked={newJobAlerts}
              onCheckedChange={setNewJobAlerts}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="promo-emails" className="flex flex-col space-y-1">
              <span>Promotional Emails</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive occasional emails about Qualifai features and news.
              </span>
            </Label>
            <Switch
              id="promo-emails"
              checked={promoEmails}
              onCheckedChange={setPromoEmails}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>Save Notification Preferences</Button>
        </CardFooter>
      </Card>

      {/* Data & Privacy Placeholder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your personal data and privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Options for managing your data usage, downloading your information,
            or deleting your account would appear here.
          </p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          {/* Example Button */}
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
