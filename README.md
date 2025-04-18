# Qualifai - Applicant Screening Demo

[![Deploy with Vercel](https://vercel.com/button)](https://qualifai-one.vercel.app/)

This project is the front-end for Qualifai, including an applicant screening flow for the platform. It includes the experience of applying for a job, uploading documents, and going through a AI-driven conversational assessment.

**Live Demo:** [**https://qualifai-one.vercel.app/**](https://qualifai-one.vercel.app/)

## Features

- View sample job postings.
- Interactive application flow with multiple stages:
  - Pre-screening information (time estimate, privacy).
  - Document upload interface (resume, cover letter, links).
  - AI-driven conversational assessment.
  - Final submission confirmation.
- Smooth page transitions using Framer Motion.
- Clean UI built with Next.js (App Router) and shadcn/ui.
- Pages for "My Applications", "Profile", and "Settings".
- Text and voice input conversation for the chat, powered by VAPI AI.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15+ (App Router)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Voice AI:** [VAPI AI](https://vapi.ai/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

To run this project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/NoahLloyd/Qualifai.git
    cd Qualifai
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    # or
    # bun install
    ```

3.  **(Optional) Configure VAPI:** If implementing VAPI integration, set up necessary API keys/environment variables (details would go here).

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    # or
    # bun dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

## Notes

- The conversational AI flow follows a defined path for demonstration purposes.
- Ensure necessary environment variables are configured if running locally with full voice features:
  - `NEXT_PUBLIC_VAPI_KEY`: Your VAPI API key
  - `NEXT_PUBLIC_VAPI_ASSISTANT_ID`: Your VAPI assistant ID
- Create a `.env.local` file in the root directory with these variables to enable voice features.

---

_Aino, Oliver, Noah_
