import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample application data
const applications = [
  {
    id: "app-001",
    jobTitle: "Design Engineer",
    company: "Snap",
    dateApplied: "2024-07-20",
    status: "Submitted",
  },
  {
    id: "app-002",
    jobTitle: "Product Designer",
    company: "Innovate Solutions Inc.",
    dateApplied: "2024-07-15",
    status: "Under Review",
  },
  {
    id: "app-003",
    jobTitle: "UX Researcher",
    company: "Tech Corp",
    dateApplied: "2024-06-30",
    status: "Interviewing",
  },
  {
    id: "app-004",
    jobTitle: "Frontend Developer",
    company: "WebWorks",
    dateApplied: "2024-06-10",
    status: "Offer Extended",
  },
  {
    id: "app-005",
    jobTitle: "Data Scientist",
    company: "AnalyzeData",
    dateApplied: "2024-05-25",
    status: "Not Selected",
  },
];

// Helper to get badge variant based on status
const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case "submitted":
    case "under review":
      return "secondary";
    case "interviewing":
    case "offer extended":
      return "default"; // Use primary color
    case "not selected":
      return "destructive";
    default:
      return "outline";
  }
};

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            Track the status of jobs you&apos;ve applied for through Qualifai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date Applied
                </TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.jobTitle}</TableCell>
                  <TableCell>{app.company}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={getStatusVariant(app.status)}
                      className="capitalize"
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
