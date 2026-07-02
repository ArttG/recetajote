import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Data fetching / theme restore në useEffect (pattern-i i mësuar në lëndë)
      // aktivon rregullën e re strikte të Next 16; e lëmë si "warn".
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
