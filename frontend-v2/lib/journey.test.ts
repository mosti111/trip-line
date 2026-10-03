import { describe, expect, it } from 'vitest';
import { journeyMessage, parseJourney } from './journey';
import { turkishPlaces } from './turkiye';

describe('public itinerary context', () => {
  it('preserves chosen order while rejecting unknown and repeated IDs', () => {
    expect(parseJourney('unknown,antalya,istanbul,antalya,<script>,rize-ayder'))
      .toEqual(['antalya', 'istanbul', 'rize-ayder']);
  });
  it('bounds input and never accepts more than the source inventory', () => {
    expect(parseJourney()).toEqual([]);
    expect(parseJourney('x'.repeat(301) + ',istanbul')).toEqual([]);
    expect(parseJourney(turkishPlaces.map(p => p.slug).join(','))).toHaveLength(12);
  });
  it('prepares localized names in selection order without claiming submission', () => {
    expect(journeyMessage(['antalya', 'istanbul'], 'en')).toBe('Places I would like to visit: Antalya → Istanbul');
    expect(journeyMessage(['antalya', 'istanbul'], 'ar')).toBe('الأماكن التي أرغب في زيارتها: أنطاليا → إسطنبول');
    expect(journeyMessage([], 'tr')).toBe('');
  });
});
