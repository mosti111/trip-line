'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { turkeyCopy as copy, turkishPlaces } from '@/lib/turkiye';
import { AddToJourney } from '../experience/JourneyActions';
import { AtlasStage } from '../v61/AtlasStage';
import { Photo } from './Sections';
import '@/styles/recovery-turkiye.css';
export function TurkeyDiscovery(props: {locale:Locale;full?:boolean;guided?:boolean}) { return <AtlasStage {...props}/>; }
export function TurkeyDirectory({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState('istanbul');
  const groups = [['city', copy.city], ['black-sea', copy.blackSea], ['coast', copy.coast], ['nature', copy.nature]] as const;
  const place = turkishPlaces.find(item => item.slug === active)!;
  return <section className="rt-directory" id="places"><div className="rt-wrap"><span className="rt-eyebrow">{copy.domestic[locale]}</span><h2>{copy.directory[locale]}</h2><div className="rt-filters" role="group" aria-label={copy.choose[locale]}>{[['all', copy.groupAll], ...groups].map(([id, label]) => <button key={id as string} aria-pressed={filter === id} onClick={() => { setFilter(id as string); const first = turkishPlaces.find(item => id === 'all' || item.group === id); if (first) setActive(first.slug); }}>{typeof label === 'string' ? label : label[locale]}</button>)}</div><div className="rt-directory-layout"><div className="rt-directory-groups">{groups.filter(([id]) => filter === 'all' || filter === id).map(([id, label]) => <div className="rt-directory-group" key={id}><h3>{label[locale]}</h3>{turkishPlaces.filter(item => item.group === id).map(item => <div className="rt-directory-row" key={item.slug} data-active={active === item.slug} onPointerEnter={() => setActive(item.slug)} onFocusCapture={() => setActive(item.slug)}><Link href={href(locale, `destinations/turkiye/${item.slug}`)}><span>{String(turkishPlaces.indexOf(item) + 1).padStart(2, '0')}</span><strong>{item.name[locale]}</strong><ArrowUpRight size={17}/><span className="sr-only">{t('Explore', 'اكتشف', 'Keşfet')[locale]}</span></Link><AddToJourney id={item.slug} locale={locale}/></div>)}</div>)}</div><div className="rt-directory-preview"><Photo file={place.image} alt={place.name[locale]}/><bdi className="rt-coordinate" dir="ltr">{place.lat.toFixed(2)}° N / {place.lon.toFixed(2)}° E</bdi><h3>{place.name[locale]}</h3><p>{place.note[locale]}</p><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${place.slug}`)}>{t('Explore', 'اكتشف', 'Keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></div></div></section>;
}
