import { describe, expect, it } from 'vitest';
import { motionChoice, resolveMotion } from './motion-preference';

describe('visitor motion authority', () => {
  it('follows system accessibility initially', () => {
    expect(resolveMotion(motionChoice(null), true)).toBe('reduced');
    expect(resolveMotion(motionChoice(null), false)).toBe('full');
  });
  it('allows an explicit full override of system reduction', () => {
    expect(resolveMotion(motionChoice('full'), true)).toBe('full');
  });
  it('keeps explicit reduction even on a full-motion system', () => {
    expect(resolveMotion(motionChoice('reduced'), false)).toBe('reduced');
  });
  it('rejects corrupted or obsolete choices', () => {
    expect(motionChoice('automatic')).toBe('system');
  });
});
