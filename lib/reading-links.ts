/** Scholar is the fallback when an editorial entry has no canonical source URL. */
export function readingUrl(entry: { title: string; author?: string; url?: string }) {
  return entry.url || `https://scholar.google.com/scholar?q=${encodeURIComponent([entry.title, entry.author].filter(Boolean).join(" "))}`
}
