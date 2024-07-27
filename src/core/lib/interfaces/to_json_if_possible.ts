export function toJsonIfPossible(value: unknown): Record<string, string> | null {
  if (value == null) return null;

  if (typeof value === "object") return value as Record<string, string>;

  if (!(typeof value === "string" && value.length > 0)) return null;

  try {
    return JSON.parse(value)
  } catch(e) {}

  return null;
}