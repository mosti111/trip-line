'use client';
import { ViewTransition } from 'react';
import { useTravel } from '../travel/SiteShell';

export function DestinationPortal({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { calm } = useTravel();
  return <ViewTransition name={`place-${slug}`} default="none" share={calm ? 'none' : 'bronze-portal'}>{children}</ViewTransition>;
}
