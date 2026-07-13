/** Copy text without making clipboard permission a hard dependency. */
export async function copyText(text: string): Promise<boolean> {
  if (!text) return false

  // Run the selection fallback synchronously while the click still carries
  // transient user activation. Some browsers reject the async Clipboard API.
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.inset = "0 auto auto -9999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      if (document.execCommand("copy")) return true
    } catch {
      // Continue to the permission-based Clipboard API.
    } finally {
      textarea.remove()
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  return false
}
