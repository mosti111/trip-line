'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { journeyHref, journeyUi } from '@/lib/journey';
import { turkishPlaces } from '@/lib/turkiye';
import { useJourney } from './JourneyStore';

export function AddToJourney({ id, locale, className = '' }: { id: string; locale: Locale; className?: string }) {
  const { destinations, addDestination } = useJourney();
  const selected = destinations.includes(id);
  const place = turkishPlaces.find(place => place.slug === id);
  return <button type="button" className={`journey-action journey-action-outline ${className}`} aria-label={place ? `${journeyUi.add[locale]}: ${place.name[locale]}` : journeyUi.add[locale]} aria-pressed={selected} onClick={() => addDestination(id)}>{journeyUi.add[locale]}{selected ? <Check size={18} /> : <Plus size={18} />}</button>;
}
export function PlanJourney({ locale, id, children, className = '' }: { locale: Locale; id?: string; children?: ReactNode; className?: string }) {
  const { destinations, journeyType, addDestination, closeJourney } = useJourney();
  return <Link className={`journey-action journey-action-primary ${className}`} href={journeyHref(locale, id ? [...destinations, id] : destinations, journeyType)} onClick={() => { if (id) addDestination(id); closeJourney(); }}>{children || journeyUi.plan[locale]}<ArrowUpRight size={18} /></Link>;
}
