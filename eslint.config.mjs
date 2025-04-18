import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    // Include existing extends or configurations if necessary
    // Example: extends: ['next/core-web-vitals']
    // If your original config had extends, add them here.
    // For now, assuming a basic setup based on the filename.
  }),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // Disable the specific rule
      "react/no-unescaped-entities": "off",

      // You might need to re-enable other specific rules from `next/core-web-vitals` if you were using it
      // e.g.:
      // '@next/next/no-img-element': 'error',
      // ... other core web vitals rules ...
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
      next: {
        rootDir: ".", // Specify root directory if needed, assumed '.'
      },
    },
  },
];

export default eslintConfig;
