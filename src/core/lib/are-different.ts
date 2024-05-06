export function areDifferent(value1: unknown, value2: unknown): boolean {
  if (typeof value1 !== typeof value2) return true;
  if (value1 === value2) return false;

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return true;

    for (let i = 0; i < value1.length; i++) {
      if (areDifferent(value1[i], value2[i])) return true;
    }

    return false;
  }

  if (typeof value1 === 'object' && typeof value2 === 'object') {
    if (value1 == null || value2 == null) return true;

    let v1: Record<string, unknown> = value1 as Record<string, unknown>;
    let v2: Record<string, unknown> = value2 as Record<string, unknown>;

    if (Object.keys(v1).length !== Object.keys(v2).length) return true;

    for (const key in value1) {
      if (areDifferent(v1[key], v2[key])) return true;
    }

    return false;
  }

  return true;
}