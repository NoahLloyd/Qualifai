export interface JobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string[]; // Array of paragraphs
  responsibilities: string[]; // List of responsibilities
  qualifications: string[]; // List of qualifications
  niceToHave?: string[]; // Optional list
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}
