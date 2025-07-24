module.exports = (config = {}) => {
  const isSelfHosted = process.env.RENOVATE_SELF_HOSTED === "true";

  if (!isSelfHosted) {
    console.log("Renovate is disabled when running via GitHub App.");
    return {
      enabled: false,
      onboarding: false,
    };
  }

  console.log("Renovate is running in self-hosted mode.");

  return {
    $schema: "https://docs.renovatebot.com/renovate-schema.json",
    baseBranches: ["main"],
    extends: [":timezone(Europe/London)"],
    flux: {
      labels: ["dependencies", "flux"],
      managerFilePatterns: ["**/*.yaml", "**/*.yml"],
    },
    ignorePaths: [
      "**/examples/azure/**",
      "**/scripts/**"
    ],
    onboarding: false,
    packageRules: [
      {
        matchManagers: ["flux"],
        pinDigests: false,
        schedule: ["* 9-13,14-17 * * 1-5"],
      },
      {
        matchManagers: ["flux"],
        addLabels: ["automerge", "base"],
        automerge: true,
        groupName: "flux - base layer",
        matchFileNames: [
          "applications/**/*.yaml",
          "applications/**/*.yml"
        ],
        matchUpdateTypes: ["minor", "patch", "pin", "digest"],
        separateMajorMinor: true,
        separateMinorPatch: false,
        separateMultipleMajor: true,
      },
      {
        matchManagers: ["flux"],
        addLabels: ["automerge", "kind"],
        automerge: true,
        groupName: "flux - kind example",
        matchFileNames: [
          "examples/kind/**/*.yaml",
          "examples/kind/**/*.yml"
        ],
        matchUpdateTypes: ["minor", "patch", "pin", "digest"],
        separateMajorMinor: true,
        separateMinorPatch: false,
        separateMultipleMajor: true,
      },
      {
        matchManagers: ["github-actions"],
        labels: ["dependencies", "github-actions"],
      },
      {
        matchManagers: ["github-actions"],
        addLabels: ["automerge"],
        automerge: true,
        extends: ["schedule:automergeNonOfficeHours"],
        matchPackageNames: ["actions/checkout", "actions/cache"],
        matchUpdateTypes: ["major", "minor", "patch"],
      },
      {
        matchManagers: ["flux"],
        enabled: false,
        matchFileNames: [
          "clusters/azure/**/*.yaml",
          "clusters/azure/**/*.yml"
        ],
      },
    ],
    prHourlyLimit: 20,
    prConcurrentLimit: 20,
    recreateWhen: "always",
    requireConfig: false,
  };
};
