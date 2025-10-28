import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Ignore build output
  { ignores: ["dist/**"] },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended (no type-checking to keep it lightweight here)
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
    },
  },
];
