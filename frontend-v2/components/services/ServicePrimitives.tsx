'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { journeyHref, journeyUi } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';
import { PageSceneMotion } from '../v6/PageSceneMotion';

/** A service override is URL context, without replacing the visitor's saved journey type. */
export function ServicePlan({ locale, service }: { locale: Locale; service: string }) {
  const { destinations, closeJourney } = useJourney();
  return <Link className="journey-action journey-action-primary" data-service-plan={service} href={journeyHref(locale, destinations, service)} onClick={closeJourney}>{journeyUi.plan[locale]}<ArrowUpRight size={18}/></Link>;
}

/** One scoped GSAP owner replaces the earlier CSS observer for this family. */
export function ServiceMotion() { return <PageSceneMotion/>; }
