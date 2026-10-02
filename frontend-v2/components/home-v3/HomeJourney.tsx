import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { journeyCopy as copy } from '@/lib/journey';
import { Hero, Numbers, Story, Partners, Photo, Action, WhatsApp } from '../travel/Sections';
import { HeroVideo } from '../travel/HeroVideo';
import { TurkeyDiscovery } from '../travel/TurkeyDiscovery';
import { JourneyChapter } from '../experience/JourneyChapter';
import { ScrollScene } from '../experience/ScrollScene';
import { DestinationPortal } from '../experience/DestinationPortal';
import { JourneyBuilder } from './JourneyBuilder';

export function SignaturePlaces({locale,exclude}:{locale:Locale;exclude?:string}) {
  const places=['cappadocia','rize-ayder','antalya'].map(id=>turkishPlaces.find(p=>p.slug===id)!).filter(p=>p.slug!==exclude);
  if(exclude&&places.length<3)places.push(turkishPlaces[0]);
  return <section className="signature-places sand"><div className="wrap"><div className="section-head"><h2>{copy.signature[locale]}</h2><Action locale={locale} path="destinations/turkiye#places" secondary>{ui.allCountries[locale]}</Action></div><div className="signature-layout">{places.map((p,i)=><Link key={p.slug} href={href(locale,`destinations/turkiye/${p.slug}`)} className="destination-portal" data-cursor-label={ui.more[locale]}><DestinationPortal slug={p.slug}><Photo file={p.image} alt={p.name[locale]}/></DestinationPortal><div><span className="index">0{i+1} / <bdi>{p.lat}° N</bdi></span><h3>{p.name[locale]}<ArrowUpRight/></h3><p>{p.note[locale]}</p></div></Link>)}</div></div></section>;
}
export function ServiceWorldsV3({locale}:{locale:Locale}) {
  const worlds=[{title:turkeyCopy.domestic,body:ui.travelBody,image:'cappadocia.png',path:'destinations/turkiye'},{title:ui.pilgrimage,body:ui.pilgrimageBody,image:'saudi-arabia.jpg',path:'services/hajj-umrah'},{title:ui.business,body:ui.businessBody,image:'business.jpg',path:'business'}];
  return <section className="three-worlds" id="service-worlds"><div className="wrap"><div className="section-head"><h2>{ui.worldsTitle[locale]}</h2><p>{ui.worldsBody[locale]}</p></div><div className="world-planes">{worlds.map((world,i)=><article className="world-plane" key={world.path}><Photo file={world.image} alt={world.title[locale]}/><div><span className="index">0{i+1}</span><h3>{world.title[locale]}</h3><p>{world.body[locale]}</p><Action locale={locale} path={world.path} secondary>{ui.more[locale]}</Action></div></article>)}</div></div></section>;
}
function ServicesJourney({locale}:{locale:Locale}) {
  return <section className="services-journey teal"><div className="wrap"><span className="eyebrow">08 / {ui.services[locale]}</span><h2>{copy.services[locale]}</h2></div><div className="services-track">{services.map((s,i)=><article key={s.slug} className="service-milestone"><span className="milestone-number">{String(i+1).padStart(2,'0')}</span><Photo file={s.image}/><h3>{s.title[locale]}</h3><p>{s.summary[locale]}</p><Action locale={locale} path={`services/${s.slug}`} secondary>{ui.more[locale]}</Action></article>)}</div></section>;
}
export function HomeJourney({locale}:{locale:Locale}) {
  return <ScrollScene>
    <div className="opening"><Hero locale={locale} title={turkeyCopy.hero[locale]} body={turkeyCopy.homeBody[locale]} home label={copy.follow[locale]}/><a className="scroll-cue" href="#service-worlds">{copy.scroll[locale]}<ArrowDown size={17}/></a><div className="departure-copy"><span>02 / {copy.follow[locale]}</span><p>{copy.departure[locale]}</p><bdi>İSTANBUL · 41.01° N / 28.98° E</bdi></div></div>
    <JourneyChapter number="03" title={ui.worldsTitle[locale]}><ServiceWorldsV3 locale={locale}/></JourneyChapter>
    <JourneyChapter number="04" title={ui.numbers[locale]} className="chapter-proof"><Numbers locale={locale}/></JourneyChapter>
    <JourneyChapter number="05" title={ui.destinations[locale]}><TurkeyDiscovery locale={locale}/></JourneyChapter>
    <JourneyChapter number="06" title={turkeyCopy.domestic[locale]} className="chapter-sand"><SignaturePlaces locale={locale}/></JourneyChapter>
    <JourneyChapter number="07" title={copy.film[locale]}><section className="travel-film"><div className="film-frame"><Photo file="turkiye.jpg"/><HeroVideo/><div className="film-statement"><h2>{copy.film[locale]}</h2><span>İSTANBUL / TÜRKİYE</span></div></div></section></JourneyChapter>
    <ServicesJourney locale={locale}/>
    <JourneyChapter number="09" title={ui.about[locale]} className="chapter-sand"><Story locale={locale}/><Partners locale={locale}/></JourneyChapter>
    <JourneyChapter number="10" title={ui.plan[locale]} className="chapter-sand"><JourneyBuilder locale={locale}/></JourneyChapter>
    <section className="final-arrival"><div className="arrival-line" aria-hidden="true"/><div className="wrap"><span className="eyebrow">Trip Line / {copy.follow[locale]}</span><h2>{copy.arrival[locale]}</h2><p>{ui.ctaBody[locale]}</p><div className="actions"><Action locale={locale} path="contact">{ui.plan[locale]}</Action><WhatsApp locale={locale}/></div></div></section>
  </ScrollScene>;
}
