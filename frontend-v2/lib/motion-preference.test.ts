import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { motionBootstrap, motionChoice, resolveMotion } from './motion-preference';

describe('visitor motion authority', () => {
  it.each([false, true])('defaults to Full when system reduction is %s', systemReduced => {
    expect(motionChoice(null)).toBe('full');
    expect(resolveMotion(motionChoice(null), systemReduced)).toBe('full');
  });
  it('allows an explicit full override of system reduction', () => {
    expect(resolveMotion(motionChoice('full'), true)).toBe('full');
  });
  it('keeps explicit reduction even on a full-motion system', () => {
    expect(resolveMotion(motionChoice('reduced'), false)).toBe('reduced');
  });
  it.each(['full', 'system', 'reduced'] as const)('preserves explicitly saved %s', choice => {
    expect(motionChoice(choice)).toBe(choice);
  });
  it('follows OS changes only when System was selected', () => {
    expect(resolveMotion('system', true)).toBe('reduced');
    expect(resolveMotion('system', false)).toBe('full');
  });
  it.each(['automatic', '', 'invalid'])('uses Full for invalid storage %j', value => {
    expect(motionChoice(value)).toBe('full');
  });
  for (const systemReduced of [false, true]) {
    it.each([null, 'full', 'system', 'reduced', 'invalid'])('prepaint matches the resolver for %j, OS reduced=' + systemReduced, saved => {
      const dataset = {};
      runInNewContext(motionBootstrap, {
        localStorage: { getItem: () => saved, setItem: () => { throw Error('Must not persist defaults'); } },
        matchMedia: () => ({ matches: systemReduced }),
        document: { documentElement: { dataset } },
      });
      const effective = resolveMotion(motionChoice(saved), systemReduced);
      expect(dataset).toEqual({ motionChoice: motionChoice(saved), motionEffective: effective, motionLayout: effective === 'full' ? 'motion' : 'static' });
    });
  }
  it('keeps Full when storage is unavailable', () => {
    const dataset = {};
    runInNewContext(motionBootstrap, {
      localStorage: { getItem: () => { throw Error('Storage blocked'); } },
      matchMedia: () => ({ matches: true }),
      document: { documentElement: { dataset } },
    });
    expect(dataset).toEqual({ motionChoice: 'full', motionEffective: 'full', motionLayout: 'motion' });
  });
});
