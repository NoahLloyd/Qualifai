import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

// Sample profile data
const profileData = {
  firstName: "Alex",
  lastName: "Nakama",
  email: "alex.nakama@example.com",
  phone: "(123) 456-7890",
  address: "123 Tech Street, Los Angeles, CA 90001",
  linkedin: "https://linkedin.com/in/alexnakama-dev",
  portfolio: "https://alexnakama.design",
  avatarUrl: "/placeholder-user.jpg", // Use the same placeholder for now
};

export default function ProfilePage() {
  const initials = `${profileData.firstName?.charAt(0) ?? ""}${
    profileData.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Avatar Card */}
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={profileData.avatarUrl} alt="User Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <CardTitle>{`${profileData.firstName} ${profileData.lastName}`}</CardTitle>
            <CardDescription>{profileData.email}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
          </CardContent>
        </Card>

        {/* Right Column: Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={profileData.firstName} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={profileData.lastName} />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={profileData.email} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue={profileData.phone} />
            </div>
            <div className="grid gap-1.5">
              {/* For simplicity, using a single Address field */}
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={profileData.address} />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input
                id="linkedin"
                type="url"
                defaultValue={profileData.linkedin}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="portfolio">Portfolio/Website URL</Label>
              <Input
                id="portfolio"
                type="url"
                defaultValue={profileData.portfolio}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button disabled>Save Changes</Button>{" "}
            {/* Button is disabled for demo */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
