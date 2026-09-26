// Masks a raw backend ObjectId for display — shows the last 4 hex digits with a readable prefix.
// The full ID is still used in URLs and API calls; this is display-only.

export function formatEventId(id: string | undefined | null): string {
  if (!id) return "—";
  return `EVT_${String(id).slice(-4).toUpperCase()}`;
}

export function formatUserId(id: string | undefined | null): string {
  if (!id) return "—";
  return `USR_${String(id).slice(-4).toUpperCase()}`;
}
