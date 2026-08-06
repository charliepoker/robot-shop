// Shared flat config for the Node services (cart, catalogue, user), which ship
// no eslint config of their own. CI installs eslint + these deps at repo root.
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs", // services use require()/module.exports
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": "warn", // legacy code — warn, don't fail
      "no-undef": "error",
    },
  },
  { ignores: ["**/node_modules/**", "web/**"] },
];
