export function deriveDisplayName(email: string): string {
  const localPart = email.split('@', 1)[0]?.trim() ?? '';
  return (localPart || 'user').slice(0, 50);
}
