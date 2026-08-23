import { lstatSync, realpathSync, statSync } from "node:fs"
import { isAbsolute, relative, resolve, sep } from "node:path"

export type RepositoryPathValidation =
  | { ok: true; absolutePath: string }
  | { ok: false; reason: string }

function isWithin(parent: string, candidate: string) {
  const path = relative(parent, candidate)
  return (
    path === "" ||
    (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path))
  )
}

/**
 * Resolve a repository-relative path without following a symlinked component.
 * The final target must be an existing regular file whose real path remains in
 * the real repository root.
 */
export function validateRepositoryRegularFilePath(
  repositoryRoot: string,
  repositoryPath: string,
): RepositoryPathValidation {
  if (
    !repositoryPath.trim() ||
    isAbsolute(repositoryPath) ||
    repositoryPath.split(/[\\/]/u).includes("..") ||
    repositoryPath.startsWith("tmp/")
  ) {
    return { ok: false, reason: "path must be a safe repository-relative path" }
  }

  let realRoot: string
  try {
    const rootStatus = lstatSync(repositoryRoot)
    if (rootStatus.isSymbolicLink() || !rootStatus.isDirectory()) {
      return { ok: false, reason: "repository root must be a real directory" }
    }
    realRoot = realpathSync(repositoryRoot)
  } catch {
    return { ok: false, reason: "repository root does not resolve" }
  }

  const candidate = resolve(realRoot, repositoryPath)
  if (!isWithin(realRoot, candidate)) {
    return { ok: false, reason: "path escapes the repository" }
  }

  const relativeParts = relative(realRoot, candidate)
    .split(sep)
    .filter(Boolean)
  let cursor = realRoot
  try {
    for (const part of relativeParts) {
      cursor = resolve(cursor, part)
      if (lstatSync(cursor).isSymbolicLink()) {
        return { ok: false, reason: "path contains a symlink" }
      }
    }
    if (!statSync(candidate).isFile()) {
      return { ok: false, reason: "path is not a regular file" }
    }
    const realCandidate = realpathSync(candidate)
    if (!isWithin(realRoot, realCandidate)) {
      return { ok: false, reason: "real path escapes the repository" }
    }
    return { ok: true, absolutePath: realCandidate }
  } catch {
    return { ok: false, reason: "path is missing or unreadable" }
  }
}
