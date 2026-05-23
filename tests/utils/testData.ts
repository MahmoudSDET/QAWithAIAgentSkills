export function uniqueEmail(prefix: string): string {
  const slug = prefix.toLowerCase().replace(/[^a-z0-9]+/g, '.');
  return `${slug}.${Date.now()}@example.com`;
}
