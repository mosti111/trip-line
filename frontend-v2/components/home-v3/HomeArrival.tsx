import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy } from '@/lib/turkiye';
import { journeyCopy } from '@/lib/journey';
import { PlanJourney } from '../experience/JourneyActions';
import { FlightTrace } from '../experience/FlightTrace';
import { Photo } from '../travel/Sections';

export function HomeArrival({ locale }: { locale: Locale }) {
  return <section className="rh-arrival" data-arrival data-chapter="01" aria-labelledby="arrival-title">
    <div className="rh-arrival-photo"><div className="rh-photo-settle"><Photo file="turkiye.jpg" alt={t('Istanbul and the Bosphorus', 'إسطنبول والبوسفور', 'İstanbul ve Boğaz')[locale]} priority /></div></div>
    <div className="rh-arrival-shade" />
    <div className="rh-wrap rh-arrival-copy">
      <h2 className="rh-kicker">01 / {t('Your journey starts in Türkiye', 'رحلتك تبدأ من تركيا', 'Yolculuğun Türkiye’den başlar')[locale]}</h2>
      <h1 id="arrival-title">{locale === 'ar' ? <><span className="rh-title-block"><span className="rh-title-ink">هنا تبدأ رحلتك</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">إلى تركيا.</span></span></> : locale === 'tr' ? <><span className="rh-title-block"><span className="rh-title-ink">TÜRKİYE YOLCULUĞUN</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">BURADA BAŞLAR.</span></span></> : <><span className="rh-title-block"><span className="rh-title-ink">TÜRKİYE</span></span>{' '}<span className="rh-title-block"><span className="rh-title-ink">BEGINS HERE.</span></span></>}</h1>
      <p className="rh-support-reveal">{t('Personal journeys, pilgrimage and group travel. From our home in Türkiye, planned around you.', 'رحلات شخصية، وحج وعمرة، وسفر للمجموعات. من تركيا، نخطط لرحلة تناسبك.', 'Bireysel yolculuklar, hac ve umre, grup seyahatleri. Türkiye’den, sana göre planlanır.')[locale]}</p>
      <div className="rh-actions rh-actions-reveal"><Link className="journey-action journey-action-primary" href={href(locale, 'destinations/turkiye')}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18} /></Link><PlanJourney locale={locale} className="rh-plan-outline" /></div>
      <div className="rh-small-links rh-links-reveal"><Link href={href(locale, 'services/hajj-umrah')}>{ui.pilgrimage[locale]}<ArrowUpRight size={14} /></Link><Link href={href(locale, 'business')}>{ui.business[locale]}<ArrowUpRight size={14} /></Link></div>
    </div>
    <FlightTrace scene="arrival" />
    <div className="rh-wrap rh-arrival-foot"><bdi dir="ltr">İSTANBUL · 41.01° N / 28.98° E</bdi><a href="#service-worlds">{journeyCopy.scroll[locale]}<ArrowDown size={17} /></a></div>
  </section>;
}
