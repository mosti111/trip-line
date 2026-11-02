'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { type Locale, ui } from '@/lib/i18n';
import { countries } from '@/lib/travel-content';
import { journeyHref } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';

/** Country context is separate from the ordered Turkish journey; neither changes the store. */
export function CountryPlan({ locale, country }: { locale: Locale; country: string }) {
  const { destinations, journeyType } = useJourney();
  const [pathname, search] = journeyHref(locale, destinations, journeyType).split('?');
  const query = new URLSearchParams(search);
  if (countries.some(item => item.slug === country && item.slug !== 'turkiye')) query.set('destination', country);
  return <Link className="journey-action journey-action-primary" data-country-plan={country} href={`${pathname}?${query}`}>{ui.plan[locale]}<ArrowUpRight size={18}/></Link>;
}
