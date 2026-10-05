import { describe, expect, it } from 'vitest';
import { turkishPlaces } from './turkiye';

describe('Türkiye source destination inventory', () => {
  it('retains all twelve source destinations with unique route IDs', () => {
    const ids = turkishPlaces.map(place => place.slug);
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual([
      'antalya', 'bodrum', 'bursa', 'cappadocia', 'fethiye', 'istanbul',
      'marmaris', 'rize-ayder', 'sapanca', 'trabzon', 'uzungol', 'yalova',
    ]);
  });

  it.each(turkishPlaces)('$slug has three distinct existing related destinations', place => {
    const knownIds = new Set(turkishPlaces.map(candidate => candidate.slug));
    expect(place.related).toHaveLength(3);
    expect(new Set(place.related).size).toBe(3);
    expect(place.related).not.toContain(place.slug);
    for (const id of place.related) expect(knownIds.has(id)).toBe(true);
  });

  it.each(turkishPlaces)('$slug retains valid geographic coordinates in Türkiye', place => {
    expect(Number.isFinite(place.lon)).toBe(true);
    expect(Number.isFinite(place.lat)).toBe(true);
    // Broad geographic bounds catch swapped axes, wrong signs and invalid pins.
    expect(place.lon).toBeGreaterThanOrEqual(26);
    expect(place.lon).toBeLessThanOrEqual(45);
    expect(place.lat).toBeGreaterThanOrEqual(35);
    expect(place.lat).toBeLessThanOrEqual(43);
  });
});
