import { describe, expect, it } from 'vitest';
import { journeyHref, journeyMessage, moveJourneyDestination, parseJourney, readJourney, validateJourney } from './journey';
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

describe('session journey boundary', () => {
  it('recovers from malformed storage and missing fields', () => {
    for (const value of [null, '{', 'null', '[]', '123', '"istanbul"']) {
      expect(readJourney(value)).toEqual({ destinations: [], journeyType: 'tours' });
    }
  });
  it('retains only ordered known IDs and an existing service, dropping personal data', () => {
    expect(validateJourney({ destinations: ['antalya', null, 'unknown', 'istanbul', 'antalya', 'bursa,yalova'], journeyType: 'hajj-umrah', name: 'Private', dates: 'October' }))
      .toEqual({ destinations: ['antalya', 'istanbul'], journeyType: 'hajj-umrah' });
    expect(validateJourney({ destinations: 'istanbul', journeyType: '<script>' }))
      .toEqual({ destinations: [], journeyType: 'tours' });
  });
  it('does not let reorder operations escape either boundary or introduce unknown IDs', () => {
    const ids = ['istanbul', 'antalya', 'rize-ayder'];
    expect(moveJourneyDestination(ids, 'antalya', -1)).toEqual(['antalya', 'istanbul', 'rize-ayder']);
    for (const [id, offset] of [['istanbul', -1], ['rize-ayder', 1], ['unknown', 1], ['antalya', 0.5]] as const) {
      expect(moveJourneyDestination(ids, id, offset)).toEqual(ids);
    }
    expect(ids).toEqual(['istanbul', 'antalya', 'rize-ayder']);
  });
  it('serializes validated context through the existing inquiry URL contract', () => {
    const url = new URL(journeyHref('ar', ['unknown', 'antalya', 'istanbul', 'antalya'], 'invalid'), 'https://example.com');
    expect(url.pathname).toBe('/ar/contact');
    expect(url.searchParams.get('destination')).toBe('antalya');
    expect(parseJourney(url.searchParams.get('journey') || '')).toEqual(['antalya', 'istanbul']);
    expect(url.searchParams.get('service')).toBe('tours');
    expect(journeyHref('tr')).toBe('/tr/contact?service=tours');
  });
});
