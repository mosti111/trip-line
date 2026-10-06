'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { journeyCopy } from '@/lib/journey';
import { AddToJourney } from '../experience/JourneyActions';
import { useJourney } from '../experience/JourneyStore';
import { TurkeyMap } from '../turkiye/TurkeyMap';
import { href, t, type Locale } from '@/lib/i18n';
import { turkeyCopy as copy, turkishPlaces } from '@/lib/turkiye';
import { Photo } from './Sections';
import '@/styles/recovery-turkiye.css';
export function TurkeyDiscovery({ locale, full = false, guided = false }: { locale: Locale; full?: boolean; guided?: boolean }) {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState('istanbul');
  const manual = useRef(false);

  const { destinations } = useJourney();
  const place = turkishPlaces[active];
  const select = (id: string) => { manual.current = true; const index = turkishPlaces.findIndex(item => item.slug === id); if (index >= 0) setActive(index); };
  useEffect(() => {
    if (!guided) return;
    const guide = (event: Event) => { if (manual.current) return; const index = turkishPlaces.findIndex(item => item.slug === (event as CustomEvent<string>).detail); if (index >= 0) setActive(index); };
    window.addEventListener('bronze-place', guide);
    return () => window.removeEventListener('bronze-place', guide);
  }, [guided]);
  return <section className={`rt-explorer ${full ? 'rt-explorer-full' : ''}`} id="turkiye" aria-label={copy.choose[locale]}><div className="rt-wrap"><div className="rt-explorer-layout"><div className="rt-index" role="group" aria-label={copy.choose[locale]}>{turkishPlaces.map((item, index) => <button key={item.slug} aria-pressed={index === active} onClick={() => select(item.slug)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name[locale]}</strong><ArrowUpRight size={15}/></button>)}</div>
    <div className="rt-desktop-map"><TurkeyMap locale={locale} active={place.slug} onSelect={select} selectedIds={destinations}/></div>
    <div className="rt-preview"><div className="rt-preview-media">{turkishPlaces.filter(item => item.slug === place.slug || item.slug === displayed).map(item => <div className="rt-preview-image" key={item.slug} data-active={item.slug === displayed} aria-hidden={item.slug !== place.slug} onLoadCapture={() => { if (item.slug === place.slug) setDisplayed(item.slug); }}><Photo file={item.image} alt={item.slug === place.slug ? item.name[locale] : ''}/></div>)}<span className="rt-preview-number" aria-hidden="true">{String(active + 1).padStart(2, '0')}</span></div><div className="rt-preview-content" aria-live="polite"><bdi className="rt-coordinate" dir="ltr">{place.lat.toFixed(2)}° N / {place.lon.toFixed(2)}° E</bdi><h3>{place.name[locale]}</h3><div className="rt-step-controls"><button type="button" aria-label={journeyCopy.previous[locale]} onClick={() => select(turkishPlaces[(active + 11) % 12].slug)}><ArrowLeft size={17}/></button><button type="button" aria-label={journeyCopy.next[locale]} onClick={() => select(turkishPlaces[(active + 1) % 12].slug)}><ArrowRight size={17}/></button></div><p>{place.note[locale]}</p><ul className="rt-interests">{place.interests.map((interest, index) => <li key={index}>{interest[locale]}</li>)}</ul><span className="rt-source">{t('Trip Line · Türkiye destination collection', 'تريب لاين · مجموعة وجهات تركيا', 'Trip Line · Türkiye destinasyonları')[locale]}</span><div className="rt-preview-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${place.slug}`)}>{t('Explore destination', 'اكتشف الوجهة', 'Destinasyonu keşfet')[locale]}<ArrowUpRight size={18}/></Link><AddToJourney id={place.slug} locale={locale}/></div></div></div>
    <details className="rt-mobile-map"><summary>{t('Locate in Türkiye', 'الموقع داخل تركيا', 'Türkiye’deki konumu')[locale]}</summary><TurkeyMap locale={locale} active={place.slug} onSelect={select} selectedIds={destinations}/></details></div><div className="rt-explorer-foot"><Link className="journey-text-link" href={href(locale, 'destinations/turkiye#places')}>{copy.directory[locale]}<ArrowUpRight size={18}/></Link><Link className="rt-secondary-link" href={href(locale, 'destinations')}>{copy.international[locale]}<ArrowUpRight size={14}/></Link></div></div></section>;
}
export function TurkeyDirectory({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState('istanbul');
  const groups = [['city', copy.city], ['black-sea', copy.blackSea], ['coast', copy.coast], ['nature', copy.nature]] as const;
  const place = turkishPlaces.find(item => item.slug === active)!;
  return <section className="rt-directory" id="places"><div className="rt-wrap"><span className="rt-eyebrow">{copy.domestic[locale]}</span><h2>{copy.directory[locale]}</h2><div className="rt-filters" role="group" aria-label={copy.choose[locale]}>{[['all', copy.groupAll], ...groups].map(([id, label]) => <button key={id as string} aria-pressed={filter === id} onClick={() => { setFilter(id as string); const first = turkishPlaces.find(item => id === 'all' || item.group === id); if (first) setActive(first.slug); }}>{typeof label === 'string' ? label : label[locale]}</button>)}</div><div className="rt-directory-layout"><div className="rt-directory-groups">{groups.filter(([id]) => filter === 'all' || filter === id).map(([id, label]) => <div className="rt-directory-group" key={id}><h3>{label[locale]}</h3>{turkishPlaces.filter(item => item.group === id).map(item => <div className="rt-directory-row" key={item.slug} data-active={active === item.slug} onPointerEnter={() => setActive(item.slug)} onFocusCapture={() => setActive(item.slug)}><Link href={href(locale, `destinations/turkiye/${item.slug}`)}><span>{String(turkishPlaces.indexOf(item) + 1).padStart(2, '0')}</span><strong>{item.name[locale]}</strong><ArrowUpRight size={17}/><span className="sr-only">{t('Explore', 'اكتشف', 'Keşfet')[locale]}</span></Link><AddToJourney id={item.slug} locale={locale}/></div>)}</div>)}</div><div className="rt-directory-preview"><Photo file={place.image} alt={place.name[locale]}/><bdi className="rt-coordinate" dir="ltr">{place.lat.toFixed(2)}° N / {place.lon.toFixed(2)}° E</bdi><h3>{place.name[locale]}</h3><p>{place.note[locale]}</p><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${place.slug}`)}>{t('Explore', 'اكتشف', 'Keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></div></div></section>;
}
