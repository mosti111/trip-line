import { describe, expect, it } from 'vitest';
import { reviewHasExpired } from './review-window';

describe('temporary public review deadline', () => {
  const deadline = '2026-10-27T15:22:45Z';
  const expiry = Date.parse(deadline);
  it('preserves ordinary deployments without a configured review window', () => {
    expect(reviewHasExpired(undefined, expiry + 1)).toBe(false);
  });
  it('allows access until the last millisecond before expiry', () => {
    expect(reviewHasExpired(deadline, expiry - 1)).toBe(false);
  });
  it('closes access at the exact deadline and afterwards', () => {
    expect(reviewHasExpired(deadline, expiry)).toBe(true);
    expect(reviewHasExpired(deadline, expiry + 86_400_000)).toBe(true);
  });
  it('fails closed for empty or malformed configured deadlines', () => {
    for (const value of ['', 'invalid', '2026-99-99']) expect(reviewHasExpired(value)).toBe(true);
  });
  it('uses an absolute instant across UTC and Istanbul representations', () => {
    expect(reviewHasExpired('2026-10-27T18:22:45+03:00', expiry)).toBe(true);
    expect(expiry - Date.parse('2026-10-25T15:22:45Z')).toBe(48 * 60 * 60 * 1000);
  });
});
