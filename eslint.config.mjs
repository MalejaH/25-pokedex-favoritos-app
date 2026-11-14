import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  ...expoConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": typescriptPlugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "no-console": "error",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": "error",
      "no-return-await": "error",
      "no-unneeded-ternary": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "react-hooks/set-state-in-effect": "off",
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-lines": ["error", 300],
      "max-lines-per-function": ["error", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 4],
      "max-statements": ["error", 20],
      "max-nested-callbacks": ["error", 3],
      "spaced-comment": ["error", "always"],
      "object-shorthand": ["error", "always"],
    },
  },
  {
    files: ["scripts/**/*.mjs", "jest.setup.ts", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-console": "off",
      "spaced-comment": "off",
      "max-lines-per-function": "off",
    },
  },
  globalIgnores(["dist/**", "coverage/**", ".expo/**", "node_modules/**"]),
]);
