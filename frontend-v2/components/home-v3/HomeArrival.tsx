import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy } from '@/lib/turkiye';
import { journeyCopy } from '@/lib/journey';
import { PlanJourney } from '../experience/JourneyActions';
import { Photo } from '../travel/Sections';

export function HomeArrival({ locale }: { locale: Locale }) {
  return <section className="rh-arrival" data-arrival data-chapter="01" aria-labelledby="arrival-title">
    <div className="rh-arrival-photo"><div className="rh-photo-settle"><Photo file="istanbul.png" alt={t('Istanbul and the Bosphorus', 'إسطنبول والبوسفور', 'İstanbul ve Boğaz')[locale]} priority /></div></div>
    <div className="rh-arrival-shade" />
    <div className="rh-wrap rh-arrival-copy">
      <h2 className="rh-kicker">01 / {t('Your journey starts in Türkiye', 'رحلتك تبدأ من تركيا', 'Yolculuğun Türkiye’den başlar')[locale]}</h2>
      <h1 id="arrival-title">{locale === 'ar' ? <><span className="rh-title-block"><span className="rh-title-ink">هنا تبدأ رحلتك</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">إلى تركيا.</span></span></> : locale === 'tr' ? <><span className="rh-title-block"><span className="rh-title-ink">TÜRKİYE YOLCULUĞUN</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">BURADA BAŞLAR.</span></span></> : <><span className="rh-title-block"><span className="rh-title-ink">TÜRKİYE</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">BEGINS HERE.</span></span></>}</h1>
      <p className="rh-support-reveal">{t('Personal journeys, pilgrimage and group travel. From our home in Türkiye, planned around you.', 'رحلات شخصية، وحج وعمرة، وسفر للمجموعات. من تركيا، نخطط لرحلة تناسبك.', 'Bireysel yolculuklar, hac ve umre, grup seyahatleri. Türkiye’den, sana göre planlanır.')[locale]}</p>
      <div className="rh-actions rh-actions-reveal"><Link className="journey-action journey-action-primary" href={href(locale, 'destinations/turkiye')}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18} /></Link><PlanJourney locale={locale} className="rh-plan-outline" /></div>
      <div className="rh-small-links rh-links-reveal"><Link href={href(locale, 'services/hajj-umrah')}>{ui.pilgrimage[locale]}<ArrowUpRight size={14} /></Link><Link href={href(locale, 'business')}>{ui.business[locale]}<ArrowUpRight size={14} /></Link></div>
    </div>
    <svg className="rh-sculpture" viewBox="0 0 1000 650" aria-hidden="true"><defs><linearGradient id="arrival-bronze" x1="0" x2="1"><stop stopColor="#80602d"/><stop offset=".42" stopColor="#e9c57a"/><stop offset=".65" stopColor="#c89039"/><stop offset="1" stopColor="#795a2f"/></linearGradient></defs><g className="rh-bronze-settle"><path className="rh-sculpture-shadow" d="M-50 610 C210 580 280 310 630 340 S1000 190 800 150 S420 500 780 610"/><path className="rh-sculpture-body" d="M-50 610 C210 580 280 310 630 340 S1000 190 800 150 S420 500 780 610"/><path className="rh-sculpture-edge" d="M-50 603 C210 573 280 303 630 333 S1000 183 800 143 S420 493 780 603"/></g></svg>
    <div className="rh-flight-slot" aria-hidden="true" />
    <div className="rh-flight-coordinates" aria-hidden="true" dir="ltr"><bdi>41.01° N</bdi><bdi>28.98° E</bdi><bdi>İSTANBUL / TÜRKİYE</bdi></div>
    <div className="rh-departure" aria-hidden="true"><span>{journeyCopy.follow[locale]}</span><ArrowDown size={32}/></div>
    <div className="rh-wrap rh-arrival-foot"><bdi dir="ltr">İSTANBUL · 41.01° N / 28.98° E</bdi><a href="#service-worlds">{journeyCopy.scroll[locale]}<ArrowDown size={17} /></a></div>
  </section>;
}
