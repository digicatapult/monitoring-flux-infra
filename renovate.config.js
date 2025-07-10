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
    },
    ignorePaths: [
      "**/clusters/**",
      "**/examples/**",
      "**/scripts/**"
    ],
    onboarding: false,
    packageRules: [
      {
        matchManagers: ["flux"],
        addLabels: ["automerge", "base"],
        automerge: true,
        groupName: "flux - base layer",
        matchManagers: ["flux"],
        matchPaths: ["applications/.*\\.ya?ml$"],
        pinDigests: false,
        schedule: ["* 9-13,14-17 * * 1-5"],
        separateMajorMinor: true,
        separateMinorPatch: false,
        separateMultiple: true,
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
    ],
    prHourlyLimit: 20,
    prConcurrentLimit: 20,
    recreateWhen: "always",
    requireConfig: false,
  };
};
