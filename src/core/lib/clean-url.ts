export function cleanUrl(dirtyUrl: string): string {
  return removeDoubleSlashes(removeTrailingSlash(dirtyUrl));
}

export function removeDoubleSlashes(dirtyUrl: string): string {
  return dirtyUrl.replace(/([^:]\/)\/+/g, `$1`);
}

export function removeTrailingSlash(dirtyUrl: string): string {
  return dirtyUrl.replace(/\/$/, ``);
}