'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { countries } from '@/lib/travel-content';
import { journeyCopy } from '@/lib/journey';
import { Photo } from '../travel/Sections';
export function BeyondCarousel({ locale }: { locale: Locale }) {
  const list = countries.filter(country => country.slug !== 'turkiye');
  const [active, setActive] = useState(0);
  const region = useRef<HTMLDivElement>(null);
  const select = (index: number) => setActive((index + list.length) % list.length);
  return <section className="rh-beyond v6-beyond" data-chapter="13" aria-labelledby="beyond-title"><div className="rh-wrap">
    <div className="v6-beyond-heading"><div><span className="rh-kicker">13 / {t('Beyond Türkiye', 'خارج تركيا', 'Türkiye’nin ötesi')[locale]}</span><h2 id="beyond-title">{t('The line continues.', 'المسار مستمر.', 'Rota devam ediyor.')[locale]}</h2><Link className="journey-text-link" href={href(locale,'destinations')}>{t('Explore beyond Türkiye', 'اكتشف ما وراء تركيا', 'Türkiye’nin ötesini keşfet')[locale]}<ArrowUpRight size={18}/></Link></div><div className="v6-carousel-controls"><button type="button" aria-label={journeyCopy.previous[locale]} onClick={() => select(active - 1)}><ArrowLeft/></button><span dir="ltr">{String(active + 1).padStart(2,'0')} / 09</span><button type="button" aria-label={journeyCopy.next[locale]} onClick={() => select(active + 1)}><ArrowRight/></button></div></div>
    <div ref={region} className="v6-country-stage" role="region" aria-roledescription={t('carousel','عارض شرائح','slayt gösterisi')[locale]} aria-label={t('International destinations','الوجهات الدولية','Uluslararası destinasyonlar')[locale]} onKeyDown={event => { if(event.target!==region.current)return;if(event.key==='ArrowRight'){event.preventDefault();select(active+1);}if(event.key==='ArrowLeft'){event.preventDefault();select(active-1);} }} tabIndex={0}>
      {list.map((country,index) => { let offset=(index-active+list.length)%list.length;if(offset>list.length/2)offset-=list.length;return <article key={country.slug} className="v6-country" data-current={index===active} aria-hidden={Math.abs(offset)>1} inert={index!==active} style={{'--offset':offset} as React.CSSProperties}><Photo file={`${country.slug}.jpg`} alt={country.name[locale]}/><div><bdi>{country.coordinate}</bdi><h3>{country.name[locale]}</h3><p>{country.note[locale]}</p><Link className="v6-country-link" href={href(locale,`destinations/${country.slug}`)}>{t('Explore','اكتشف','Keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></article>; })}
    </div><div className="v6-country-index" role="group" aria-label={t('Choose a country','اختر دولة','Ülke seç')[locale]}>{list.map((country,index)=><button key={country.slug} type="button" aria-pressed={index===active} onClick={()=>select(index)}>{country.name[locale]}</button>)}</div>
  </div></section>;
}
