'use client';

import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ArrowUpRight, X } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { journeyCopy, journeyUi } from '@/lib/journey';
import { turkishPlaces, turkeyCopy } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { useJourney } from './JourneyStore';
import { PlanJourney } from './JourneyActions';

export function trapDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),select:not(:disabled),input:not(:disabled),[tabindex="0"]')).filter(element => element.getClientRects().length > 0);
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}
export function JourneyDrawer({ locale }: { locale: Locale }) {
  const journey = useJourney();
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<{ id: string; offset: number } | null>(null);
  const title = useId();
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (journey.drawerOpen && !node.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      node.showModal();
    } else if (!journey.drawerOpen && node.open) node.close();
  }, [journey.drawerOpen]);
  useEffect(() => {
    if (!journey.drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [journey.drawerOpen]);
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const row = dialog.current?.querySelector(`[data-journey-stop="${target.id}"]`);
    (row?.querySelector<HTMLButtonElement>(`[data-move="${target.offset}"]:not(:disabled)`) || row?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
  }, [journey.destinations]);
  function remove(id: string, index: number) {
    const nextId = journey.destinations[index + 1] || journey.destinations[index - 1];
    if (nextId) pendingFocus.current = { id: nextId, offset: 0 };
    else dialog.current?.querySelector<HTMLButtonElement>('.journey-close')?.focus();
    journey.removeDestination(id);
  }
  function restoreFocus() {
    journey.closeJourney();
    requestAnimationFrame(() => {
      if (returnFocus.current?.isConnected && returnFocus.current.getClientRects().length > 0 && getComputedStyle(returnFocus.current).visibility === 'visible') returnFocus.current.focus();
      else Array.from(document.querySelectorAll<HTMLElement>('.header-plan, .menu-button')).find(node => node.getClientRects().length > 0)?.focus();
    });
  }
  return <dialog ref={dialog} className="journey-drawer" aria-labelledby={title} onKeyDown={trapDialogFocus} onCancel={() => journey.closeJourney()} onClose={restoreFocus} data-native-scroll>
    <div className="journey-drawer-heading"><div><span className="journey-eyebrow">TRIP LINE</span><h2 id={title}>{journeyCopy.selected[locale]} <span>· {journey.destinations.length}</span></h2></div><button type="button" className="journey-close" aria-label={journeyUi.close[locale]} onClick={journey.closeJourney}><X size={24} /></button></div>
    <div className="journey-drawer-content">
      <p role="status" className="sr-only" aria-live="polite">{journeyCopy.selected[locale]}: {journey.destinations.length}{journey.destinations.length > 0 && ` — ${journey.destinations.map(id => turkishPlaces.find(place => place.slug === id)?.name[locale]).join(' → ')}`}</p>
      {journey.destinations.length ? <><ol className="journey-stops">{journey.destinations.map((id, index) => {
        const place = turkishPlaces.find(place => place.slug === id)!;
        return <li key={id} data-journey-stop={id}><span className="journey-stop-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div className="journey-stop-photo"><Image src={`/media/${place.image}`} alt="" fill sizes="64px" /></div><Link href={href(locale, `destinations/turkiye/${id}`)} onClick={journey.closeJourney}>{place.name[locale]}</Link><div className="journey-stop-controls"><button type="button" disabled={index === 0} data-move="-1" aria-label={`${journeyCopy.earlier[locale]}: ${place.name[locale]}`} onClick={() => { pendingFocus.current = { id, offset: -1 }; journey.moveDestination(id, -1); }}><ArrowUp size={17} /></button><button type="button" disabled={index === journey.destinations.length - 1} data-move="1" aria-label={`${journeyCopy.later[locale]}: ${place.name[locale]}`} onClick={() => { pendingFocus.current = { id, offset: 1 }; journey.moveDestination(id, 1); }}><ArrowDown size={17} /></button><button type="button" aria-label={`${journeyCopy.remove[locale]}: ${place.name[locale]}`} onClick={() => remove(id, index)}><X size={17} /></button></div></li>;
      })}</ol><label className="journey-type-label">{ui.service[locale]}<select value={journey.journeyType} onChange={event => journey.setJourneyType(event.target.value)}>{services.map(service => <option key={service.slug} value={service.slug}>{service.title[locale]}</option>)}</select></label></> : <div className="journey-empty"><span className="journey-empty-line" aria-hidden="true" /><h3>{journeyCopy.empty[locale]}</h3><p>{journeyUi.emptyBody[locale]}</p><Link className="journey-action journey-action-outline" href={href(locale, 'destinations/turkiye')} onClick={journey.closeJourney}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18} /></Link></div>}
    </div>
    <div className="journey-drawer-bottom"><PlanJourney locale={locale}>{journeyUi.continue[locale]}</PlanJourney><p>{journeyUi.session[locale]}</p></div>
  </dialog>;
}
