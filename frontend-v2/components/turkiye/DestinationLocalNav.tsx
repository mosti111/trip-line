'use client';
import { useEffect, useRef, useState } from 'react';
import { t, type Locale } from '@/lib/i18n';
const chapters = [
  { key: 'overview', id: 'place-overview', title: t('Overview', 'نظرة عامة', 'Genel bakış') },
  { key: 'experience', id: 'place-experience', title: t('Experience', 'التجربة', 'Deneyim') },
  { key: 'plan', id: 'place-plan', title: t('Plan', 'خطط', 'Planla') },
  { key: 'trip-line', id: 'place-services', title: t('Trip Line', 'تريب لاين', 'Trip Line') },
  { key: 'continue', id: 'place-continue', title: t('Continue', 'واصل', 'Devam et') },
];
export function DestinationLocalNav({ locale }: { locale: Locale }) {
  const host = useRef<HTMLElement>(null);
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const nav = host.current;
    if (!nav) return;
    nav.dataset.navEnhanced = '';
    if (typeof IntersectionObserver !== 'function') return () => { delete nav.dataset.navEnhanced; };
    const sections = [...nav.closest('.recovery-destination')!.querySelectorAll<HTMLElement>('[data-local-chapter]')];
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      // One reading line below both bars, including the existing document anchor padding.
      const line = Math.min(innerHeight - 1, 72 + nav.getBoundingClientRect().height + 120);
      observer = new IntersectionObserver(() => {
        // Evaluate every current rectangle, not only this callback's changed entries.
        const section = sections.find(node => { const rect = node.getBoundingClientRect(); return rect.top <= line && rect.bottom > line; });
        if (section?.dataset.localChapter) setActive(section.dataset.localChapter);
      }, { rootMargin: `-${line}px 0px -${Math.max(0, innerHeight - line - 1)}px 0px`, threshold: 0 });
      sections.forEach(node => observer.observe(node));
    };
    observe();
    window.addEventListener('resize', observe);
    return () => { observer.disconnect(); window.removeEventListener('resize', observe); delete nav.dataset.navEnhanced; };
  }, []);
  const selected = chapters.find(chapter => chapter.key === active)!;
  const label = t('Destination chapters', 'فصول الوجهة', 'Destinasyon bölümleri')[locale];
  return <nav ref={host} className="rd-local-nav" aria-label={label}><div className="rd-wrap"><div className="rd-nav-links">{chapters.map(chapter => <a href={`#${chapter.id}`} key={chapter.key} aria-current={active === chapter.key ? 'location' : undefined}>{chapter.title[locale]}</a>)}</div><div className="rd-nav-select"><label htmlFor="destination-chapter">{label}</label><select id="destination-chapter" value={selected.id} onChange={event => { const chapter = chapters.find(item => item.id === event.target.value)!; setActive(chapter.key); window.location.hash = chapter.id; }}>{chapters.map(chapter => <option value={chapter.id} key={chapter.key}>{chapter.title[locale]}</option>)}</select></div><div className="rd-nav-native">{chapters.map(chapter => <a href={`#${chapter.id}`} key={chapter.key}>{chapter.title[locale]}</a>)}</div></div></nav>;
}
