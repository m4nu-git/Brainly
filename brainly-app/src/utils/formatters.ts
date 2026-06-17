export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function mapServerErrors(
  errors: Array<{ field: string; message: string }>,
  setError: (field: string, error: { message: string }) => void
) {
  for (const e of errors) {
    setError(e.field, { message: e.message });
  }
}
