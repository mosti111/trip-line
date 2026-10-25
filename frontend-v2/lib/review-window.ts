/** Optional deployment-only review window. A configured invalid deadline closes access. */
export function reviewHasExpired(deadline: string | undefined, now = Date.now()): boolean {
  if (deadline === undefined) return false;
  const expiresAt = Date.parse(deadline);
  return !Number.isFinite(expiresAt) || now >= expiresAt;
}
