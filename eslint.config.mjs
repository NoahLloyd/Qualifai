import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

// Mimic __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for extending JSON-based configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
  // No need for recommendedConfig here, js.configs.recommended is used below
});

export default tseslint.config(
  // 1. Base JS rules
  js.configs.recommended,

  // 2. Base TS rules
  ...tseslint.configs.recommended,

  // 3. Next.js specific configuration (using FlatCompat)
  // This typically includes React, React Hooks, JSX A11y, Next.js plugin rules & settings
  ...compat.extends("next/core-web-vitals"),

  // 4. Custom overrides and settings
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply to all relevant files
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
    rules: {
      // Your specific overrides:
      "react/react-in-jsx-scope": "off", // Often off in Next.js
      "react/prop-types": "off", // Off with TypeScript
      "react/no-unescaped-entities": "off", // The one you requested

      // Keep default severity for unused vars from recommended configs,
      // or adjust if needed e.g., change to "warn"
      // "@typescript-eslint/no-unused-vars": "warn",

      // Re-enable specific rules if next/core-web-vitals turned them off undesirably
      // Example:
      // "@next/next/no-img-element": "warn",
    },
    // Settings are usually handled by `compat.extends("next/core-web-vitals")`
    // settings: {
    //     react: { version: "detect" },
    //     next: { rootDir: "." }
    // },
  }
);
