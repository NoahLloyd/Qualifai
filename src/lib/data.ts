import { JobDetails } from "./types";

export const jobDetailsData: JobDetails = {
  id: "deseng-002",
  title: "Design Engineer",
  company: "Snap",
  location: "Los Angeles, CA | Remote Optional",
  description: [
    "Snap is seeking a creative and motivated Design Engineer to join our dynamic product development team. We are building the future of communication and augmented reality, and you'll play a key role in bringing innovative hardware ideas to life.",
    "In this role, you will be instrumental in transforming product concepts into tangible, high-quality designs ready for manufacturing. You will work closely with industrial designers, hardware engineers, and software teams to ensure seamless integration and optimal performance across Snap's hardware portfolio.",
  ],
  responsibilities: [
    "Contribute to the mechanical design and development of new hardware products.",
    "Create detailed 3D CAD models and 2D drawings using standard industry software.",
    "Perform engineering analysis (FEA, tolerance analysis) to validate designs.",
    "Collaborate with cross-functional teams including Industrial Design, Electrical Engineering, and Software.",
    "Work with manufacturing partners to ensure design for manufacturability (DFM) and design for assembly (DFA).",
    "Develop and execute test plans to validate product performance and reliability.",
    "Assist with component selection and vendor communication.",
  ],
  qualifications: [
    "Bachelor's degree in Mechanical Engineering or a related field.",
    "2+ years of experience in mechanical design, preferably in consumer electronics or related industries.",
    "Proficiency in 3D CAD software (e.g., NX, SolidWorks).",
    "Understanding of materials, manufacturing processes (injection molding, CNC machining, etc.), and DFM/DFA principles.",
    "Familiarity with simulation and analysis tools (FEA).",
    "Excellent problem-solving skills and attention to detail.",
    "Strong communication and collaboration skills.",
  ],
  niceToHave: [
    "Master's degree in Mechanical Engineering.",
    "Experience with high-volume manufacturing.",
    "Knowledge of optics or camera module integration.",
    "Experience designing products with embedded systems.",
  ],
};

// Additional simplified job listings for the board view
export const sampleJobListings: Pick<
  JobDetails,
  "id" | "title" | "company" | "location"
>[] = [
  jobDetailsData, // Include the main one
  {
    id: "pm-001",
    title: "Product Manager, Growth",
    company: "Innovate Solutions Inc.",
    location: "Remote (US Based)",
  },
  {
    id: "swe-005",
    title: "Software Engineer, Backend",
    company: "Cloud Systems Co.",
    location: "New York, NY",
  },
  {
    id: "uxr-010",
    title: "UX Researcher",
    company: "User Insights Ltd.",
    location: "San Francisco, CA",
  },
];

// TODO: Add hardcoded chat interaction data later

// Hardcoded Chat Interaction Data
interface ChatQuestion {
  id: number;
  aiPrompt: string; // What the AI asks the user
  // Optional: We could add expected keywords or categories for simple branching, but keep it linear for now
}

export const chatFlowData: ChatQuestion[] = [
  {
    id: 1,
    aiPrompt: `Great! Let's talk about your suitability for the Design Engineer role at Snap. Can you start by telling me about your experience with 3D CAD software like NX or SolidWorks? What kind of projects have you used them for?`,
  },
  {
    id: 2,
    aiPrompt:
      "Thanks for sharing. How about your experience with manufacturing processes like injection molding or CNC machining? Have you worked closely with manufacturers before?",
  },
  {
    id: 3,
    aiPrompt:
      "Interesting. Could you describe a challenging design problem you encountered and how you approached solving it?",
  },
  {
    id: 4,
    aiPrompt:
      "That's helpful context. Lastly, what aspects of working on hardware at a company like Snap particularly excite you?",
  },
];

// Function to get the next question based on the current message count (simple linear flow)
export const getNextQuestion = (
  currentMessageCount: number
): ChatQuestion | null => {
  // Count only AI messages acting as prompts (even indexes if user always replies once)
  const aiPromptIndex = Math.floor(currentMessageCount / 2); // Estimate which question we are on
  if (aiPromptIndex < chatFlowData.length) {
    return chatFlowData[aiPromptIndex];
  }
  return null; // No more questions
};
