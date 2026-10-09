import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  nextPlugin.configs["core-web-vitals"],
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".kilo/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "next.config.js",
    ],
  },
];
