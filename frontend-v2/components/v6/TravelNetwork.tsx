'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { t, type Locale } from '@/lib/i18n';
import { useTravel } from '../travel/SiteShell';
import inventory from '@/public/brand/network/inventory.json';

export function TravelNetwork({ locale }: { locale: Locale }) {
  const { calm } = useTravel();
  const host = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    observer.observe(node);
    const visibility = () => setVisible(!document.hidden && node.getBoundingClientRect().bottom > 0 && node.getBoundingClientRect().top < innerHeight + 80);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const commercial = inventory.records.filter(record => !['institution', 'institutional-platform', 'trade-association'].includes(record.classification));
  const institutions = inventory.records.filter(record => !commercial.includes(record));
  return <section ref={host} className="v6-network" data-running={visible && !paused && !calm} aria-labelledby="network-title">
    <div className="rh-wrap v6-network-heading"><div><span className="rh-kicker">TRIP LINE / 2025</span><h2 id="network-title">{t('A world of connections.', 'عالم من الروابط.', 'Bağlantılarla dolu bir dünya.')[locale]}</h2></div><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? t('Resume movement', 'استئناف الحركة', 'Hareketi sürdür')[locale] : t('Pause movement', 'إيقاف الحركة', 'Hareketi durdur')[locale]}</button></div>
    <p className="rh-wrap v6-network-note">{t('Travel Network · Marks appearing in our 2025 company profile. Current relationships and publication approval remain to be confirmed.', 'شبكة السفر · علامات واردة في ملف الشركة لعام 2025. العلاقات الحالية والموافقة على النشر قيد التأكيد.', 'Seyahat ağı · 2025 şirket profilimizde yer alan markalar. Güncel ilişkiler ve yayın onayı teyit bekliyor.')[locale]}</p>
    <div className="v6-network-tracks" tabIndex={0} aria-label={t('Travel Network logos; movement pauses on focus', 'شعارات شبكة السفر؛ تتوقف الحركة عند التركيز', 'Seyahat ağı logoları; odaklandığında hareket durur')[locale]}>
      {[commercial.slice(0, 8), commercial.slice(8)].map((records, row) => <div className={`v6-network-window v6-network-row-${row}`} key={row}><div className="v6-network-track" style={{ animationDuration: `${records.length * 210 / (row ? 28 : 32)}s` }}>
        {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>{records.map(record => <li key={record.id}><Image src={record.localAsset} alt={record.brand} width={170} height={74}/></li>)}</ul>)}
      </div></div>)}
    </div>
    <div className="rh-wrap v6-institutions"><p>{t('Institutional and association marks in the profile · shown separately; no endorsement implied.', 'علامات المؤسسات والجمعيات في الملف · تعرض بشكل منفصل دون ادعاء تأييد.', 'Profildeki kurum ve birlik işaretleri · ayrı gösterilir; onay anlamına gelmez.')[locale]}</p><ul>{institutions.map(record => <li key={record.id}><Image src={record.localAsset} alt={record.brand} width={120} height={66}/>{record.verificationStatus.startsWith('uncertain') && <small>{t('Identification pending', 'الهوية قيد التأكيد', 'Kimlik teyit bekliyor')[locale]}</small>}</li>)}</ul></div>
  </section>;
}
