// eslint-config-next v16 ships native flat-config arrays.
// `core-web-vitals` already bundles the base config (TypeScript, React,
// react-hooks, import, jsx-a11y) plus the Next.js core-web-vitals rules.
import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...next,
];

export default eslintConfig;
