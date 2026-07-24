export type RecoveryTokens = { accessToken: string; refreshToken: string };

export function recoveryTokensFromUrl(url: string): RecoveryTokens | null {
  const fragment = url.split('#', 2)[1] ?? url.split('?', 2)[1];
  if (!fragment) return null;
  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}
