export function exportFilenameFromContentDisposition(contentDisposition: string | undefined | null): string | null {
  if (!contentDisposition) return null;

  const match = contentDisposition.match(/filename="(.+)"/);
  return match ? match[1] : null;
}