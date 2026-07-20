import { execFileSync } from "node:child_process"

const SHA_PATTERN = /^[0-9a-f]{7,40}$/i
const environmentCandidates = [
  ["VERCEL_GIT_COMMIT_SHA", process.env.VERCEL_GIT_COMMIT_SHA],
  ["GITHUB_SHA", process.env.GITHUB_SHA],
  ["BUILD_COMMIT_SHA", process.env.BUILD_COMMIT_SHA],
]

let resolved = environmentCandidates.find(
  ([, value]) => typeof value === "string" && SHA_PATTERN.test(value.trim()),
)

if (!resolved) {
  try {
    const gitSha = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()

    if (SHA_PATTERN.test(gitSha)) resolved = ["git", gitSha]
  } catch {
    // The explicit error below covers source archives without Git metadata.
  }
}

if (!resolved) {
  console.error("Build commit SHA unavailable: set VERCEL_GIT_COMMIT_SHA, GITHUB_SHA, or BUILD_COMMIT_SHA.")
  process.exitCode = 1
} else {
  const [source, sha] = resolved
  console.log(`Build commit SHA (${source}): ${sha.toLowerCase()}`)
}
