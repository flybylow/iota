import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/test-wasm/**",
      "app/onchain-test/**",
      "lib/wasm-test.ts",
      "lib/iotaIdentityReal.ts",
      "lib/keyStorage.ts",
      "lib/simpleWasm.ts",
    ],
  },
];

export default eslintConfig;
