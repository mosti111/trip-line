import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces } from '@/lib/turkiye';
import { journeyCopy } from '@/lib/journey';
import { Photo } from '../travel/Sections';
import { HeroVideo } from '../travel/HeroVideo';
import { TurkeyDiscovery } from '../travel/TurkeyDiscovery';
import { DestinationPortal } from '../experience/DestinationPortal';
import { AddToJourney } from '../experience/JourneyActions';
import { FlightTrace } from '../experience/FlightTrace';
import { HomeArrival } from './HomeArrival';
import { HomeStory, HomeProof, HomeNumbers, HomeProcess, HomeServices, HomeBeyond, HomeFAQ, HomeFinal } from './HomeEditorial';
import { JourneyBuilder } from './JourneyBuilder';
import { ServiceWorldsV3 } from './ServiceWorlds';
import { HomeMotion } from './HomeMotion';
import '@/styles/recovery-home.css';
import '@/styles/recovery-motion.css';

export function SignaturePlaces({ locale, exclude }: { locale: Locale; exclude?: string }) {
  const places = ['cappadocia', 'rize-ayder', 'antalya'].map(id => turkishPlaces.find(p => p.slug === id)!).filter(p => p.slug !== exclude);
  if (exclude && places.length < 3) places.push(turkishPlaces[0]);
  return <section className="rh-signatures" data-chapter="05" aria-labelledby="signature-title"><div className="rh-wrap">
    <div className="rh-section-heading"><span className="rh-kicker">05 / {turkeyCopy.domestic[locale]}</span><h2 id="signature-title">{journeyCopy.signature[locale]}</h2></div>
    <div className="rh-signature-line">
      {places.map((place, i) => <article className={`rh-signature rh-signature-${i}`} key={place.slug}><Link className="rh-signature-image" href={href(locale, `destinations/turkiye/${place.slug}`)}><DestinationPortal slug={place.slug}><Photo file={place.slug === 'antalya' ? 'antalya-coast-v5.jpg' : place.image} alt={place.name[locale]} sizes={place.slug==='antalya'?'(max-width: 767px) 108vw, (max-width: 1454px) 95vw, 1220px':undefined}/></DestinationPortal></Link><div className="rh-signature-copy"><span className="rh-kicker"><bdi>0{i + 1} / {place.lat.toFixed(2)}° N · {place.lon.toFixed(2)}° E</bdi></span><h3>{place.name[locale]}</h3><p>{place.note[locale]}</p><div className="rh-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${place.slug}`)}>{t('Explore', 'اكتشف', 'Keşfet')[locale]}<ArrowUpRight size={18}/></Link><AddToJourney id={place.slug} locale={locale}/></div></div></article>)}
    </div>
  </div></section>;
}
export function HomeJourney({ locale }: { locale: Locale }) {
  return <div className="bronze-home recovery-home"><HomeArrival locale={locale}/><ServiceWorldsV3 locale={locale}/>
    <section className="rh-threshold" data-chapter="03" aria-labelledby="threshold-title"><Photo file="rize-ayder.jpg" alt={turkishPlaces.find(p => p.slug === 'rize-ayder')!.name[locale]}/><div className="rh-threshold-shade"/><div className="rh-wrap"><span className="rh-kicker">03 / TÜRKİYE</span><h2 id="threshold-title">{t('Find your Türkiye.', 'اكتشف تركيا التي تشبهك.', 'Kendi Türkiye’ni bul.')[locale]}</h2><div className="rh-threshold-note"><strong aria-hidden="true">12</strong><div><p>{turkeyCopy.intro[locale]}</p><a className="journey-text-link" href="#turkiye">{turkeyCopy.choose[locale]}<ArrowDown size={18}/></a></div></div></div><FlightTrace scene="threshold"/></section>
    <section className="rh-explorer-chapter" data-chapter="04" aria-labelledby="explorer-chapter-title"><div className="rh-wrap rh-section-heading"><span className="rh-kicker">04 / {turkeyCopy.domestic[locale]}</span><h2 id="explorer-chapter-title">{turkeyCopy.title[locale]}</h2><p>{turkeyCopy.intro[locale]}</p></div><TurkeyDiscovery locale={locale}/></section>
    <SignaturePlaces locale={locale}/>
    <section className="rh-film" data-chapter="06" aria-labelledby="film-title"><div className="rh-wrap"><span className="rh-kicker">06 / İSTANBUL</span><h2 id="film-title">{journeyCopy.film[locale]}</h2><div className="rh-film-frame"><Photo file="turkiye.jpg" alt={t('The Istanbul waterfront', 'واجهة إسطنبول البحرية', 'İstanbul kıyıları')[locale]}/><HeroVideo/><span className="rh-film-caption" dir="ltr">BOSPHORUS / 41.01° N · 28.98° E</span></div></div></section>
    <HomeStory locale={locale}/><HomeProof locale={locale}/><HomeNumbers locale={locale}/><HomeProcess locale={locale}/><HomeServices locale={locale}/><JourneyBuilder locale={locale}/><HomeBeyond locale={locale}/><HomeFAQ locale={locale}/><HomeFinal locale={locale}/><HomeMotion/>
  </div>;
}
