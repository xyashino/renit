// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

const domainNames = [
  "authentication",
  "user-profile",
  "equipment",
  "inventory",
  "rentals",
  "reviews",
];

const domainBoundaryConfigs = domainNames.map((domainName) => {
  const disallowedDomains = domainNames
    .filter((name) => name !== domainName)
    .flatMap((name) => [
      `@/src/domains/${name}/application/*`,
      `@/src/domains/${name}/infrastructure/*`,
      `@/src/domains/${name}/ui/*`,
    ]);

  return {
    files: [`src/domains/${domainName}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: disallowedDomains,
        },
      ],
    },
  };
});

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  ...domainBoundaryConfigs,
]);
