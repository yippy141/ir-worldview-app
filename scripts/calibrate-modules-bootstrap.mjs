import {
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { fileURLToPath } from "node:url"

const dataPath = fileURLToPath(
  new URL("../lib/modules/calibration-data.ts", import.meta.url),
)
const writeMode = process.argv.includes("--write")
const placeholder = `export const MODULE_CALIBRATIONS = {
  security: {
    standard: { headline: {}, lanes: {} },
    analyst: { headline: {}, lanes: {} }
  },
  technology: {
    standard: { headline: {}, lanes: {} },
    analyst: { headline: {}, lanes: {} }
  }
}
`

if (!writeMode) {
  await import("./calibrate-modules.mts")
} else {
  const existed = existsSync(dataPath)
  const original = existed ? readFileSync(dataPath, "utf8") : null
  writeFileSync(dataPath, placeholder)

  try {
    await import("./calibrate-modules.mts")
  } catch (error) {
    if (original === null) {
      unlinkSync(dataPath)
    } else {
      writeFileSync(dataPath, original)
    }
    throw error
  }
}
