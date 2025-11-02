import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules - per Next.js 15 official recommendations
      // Reference: https://nextjs.org/docs/app/api-reference/config/eslint
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Warning instead of error for gradual migration

      // React Hooks - Critical rule must remain as error per React docs
      // However, conditional hooks are architectural issues that need code fixes
      "react-hooks/rules-of-hooks": "error", // Critical - cannot be disabled
      "react-hooks/exhaustive-deps": "warn",

      // Code quality rules
      "react/no-unescaped-entities": "warn", // Can be warnings for gradual fixes
      "no-console": "warn", // Warnings for console statements
      "no-debugger": "error", // Debuggers should always be errors
    },
  },
];
