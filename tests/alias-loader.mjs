import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const loaderDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(loaderDir, "..")

const EXTENSIONS = [".ts", ".tsx", ".js", ".mjs"]

function resolveAliasPath(specifier) {
  const basePath = path.join(projectRoot, specifier.slice(2))
  const candidates = [
    basePath,
    ...EXTENSIONS.map((extension) => `${basePath}${extension}`),
    ...EXTENSIONS.map((extension) => path.join(basePath, `index${extension}`)),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? basePath
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return nextResolve(pathToFileURL(resolveAliasPath(specifier)).href, context)
  }

  return nextResolve(specifier, context)
}
