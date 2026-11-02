import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { countries, services, type Country } from '@/lib/travel-content';
import { turkeyCopy } from '@/lib/turkiye';
import { Photo } from '../travel/Sections';
import { CountryPlan } from './CountryPlan';
import '@/styles/recovery-secondary.css';

const copy = {
  discover: t('Discover Türkiye','اكتشف تركيا','Türkiye’yi keşfet'),
  beyond: t('Beyond Türkiye','خارج تركيا','Türkiye’nin ötesinde'),
  continues: t('The line continues.','المسار يستمر.','Rota devam ediyor.'),
  twelve: t('12 places. Your Türkiye.','١٢ وجهة. تركيا على طريقتك.','12 yer. Senin Türkiye’n.'),
  interests: t('A starting point for discovery.','نقطة بداية للاكتشاف.','Keşif için bir başlangıç.'),
  context: t('Bring your ideas together.','اجمع أفكار رحلتك.','Yolculuk fikirlerini bir araya getir.'),
  retained: t('This country and your saved Türkiye journey can be discussed together. The next page keeps both in your inquiry.','يمكن مناقشة هذه الدولة مع رحلتك المحفوظة في تركيا. تحتفظ الصفحة التالية بكليهما في استفسارك.','Bu ülkeyi ve kaydettiğin Türkiye yolculuğunu birlikte konuşabiliriz. Sonraki sayfa ikisini de talebinde korur.'),
};

export function InternationalExperience({locale}:{locale:Locale}) {
  return <div className="recovery-secondary secondary-directory">
    <section className="sx-turkiye"><div className="sx-wrap sx-turkiye-layout"><div><span className="sx-kicker">TRIP LINE / TÜRKİYE</span><h1>{copy.twelve[locale]}</h1><p>{turkeyCopy.intro[locale]}</p><Link className="journey-action journey-action-primary" data-primary-turkiye href={href(locale,'destinations/turkiye')}>{copy.discover[locale]}<ArrowUpRight size={20}/></Link></div><Link className="sx-turkiye-image" href={href(locale,'destinations/turkiye')} aria-label={turkeyCopy.domestic[locale]}><Photo file="turkiye.jpg" alt={turkeyCopy.domestic[locale]} priority/><span dir="ltr">TÜRKİYE / 12</span></Link></div></section>
    <section className="sx-directory" id="international"><div className="sx-wrap"><div className="sx-section-heading"><span className="sx-kicker">{copy.beyond[locale]}</span><h2>{copy.continues[locale]}</h2><p>{ui.inspirationNote[locale]}</p></div><ol className="sx-country-list">{countries.filter(c=>c.slug!=='turkiye').map((c,i)=><li key={c.slug} data-directory-country={c.slug}><Link href={href(locale,`destinations/${c.slug}`)}><span className="sx-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3>{c.name[locale]}</h3><p>{c.note[locale]}</p><ArrowUpRight size={22}/></Link></li>)}</ol></div></section>
  </div>;
}

export function CountryExperience({locale,country:c}:{locale:Locale;country:Country}) {
  const related=services.filter(s=>(c.slug==='saudi-arabia'?['hajj-umrah','flights-hotels','visa-assistance']:['tours','tailor-made','flights-hotels']).includes(s.slug));
  return <div className="recovery-secondary secondary-country" data-country={c.slug}>
    <section className="sx-country-intro"><div className="sx-wrap"><Link className="sx-back" href={href(locale,'destinations')}>{copy.beyond[locale]}<ArrowUpRight size={17}/></Link><div className="sx-country-heading"><div><span className="sx-kicker">{ui.destinations[locale]}</span><h1>{c.name[locale]}</h1></div><div><p data-country-note>{c.note[locale]}</p><bdi className="sx-coordinate" dir="ltr">{c.coordinate}</bdi><CountryPlan locale={locale} country={c.slug}/></div></div><div className="sx-country-photo"><Photo file={`${c.slug}.jpg`} alt={c.name[locale]} priority/></div></div></section>
    <section className="sx-interests"><div className="sx-wrap sx-editorial"><div><span className="sx-kicker">{c.name[locale]}</span><h2>{copy.interests[locale]}</h2><p>{ui.inspirationNote[locale]}</p></div><ol>{c.interests.map((interest,i)=><li key={i}><span className="sx-number" aria-hidden="true">0{i+1}</span><h3 data-country-interest>{interest[locale]}</h3></li>)}</ol></div></section>
    <section className="sx-plan" data-journey-planner><div className="sx-wrap sx-editorial"><div><span className="sx-kicker">{ui.planning[locale]}</span><h2>{copy.context[locale]}</h2><p>{copy.retained[locale]}</p><CountryPlan locale={locale} country={c.slug}/><small>{ui.formBody[locale]}</small></div><div className="sx-related-services"><h3>{ui.services[locale]}</h3>{related.map(s=><Link key={s.slug} href={href(locale,`services/${s.slug}`)}><span>{s.title[locale]}</span><ArrowUpRight size={18}/></Link>)}<p>{ui.nextStepsBody[locale]}</p></div></div></section>
    <nav className="sx-continue sx-wrap" aria-label={ui.destinations[locale]}><Link href={href(locale,'destinations/turkiye')}>{copy.discover[locale]}<ArrowUpRight size={20}/></Link><Link href={href(locale,'destinations')}>{copy.beyond[locale]}<ArrowUpRight size={20}/></Link></nav>
  </div>;
}
