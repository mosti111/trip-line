import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces } from '@/lib/turkiye';
import { journeyCopy as copy } from '@/lib/journey';
import { Hero, Numbers, Partners, Photo, Action, WhatsApp } from '../travel/Sections';
import { HeroVideo } from '../travel/HeroVideo';
import { TurkeyDiscovery } from '../travel/TurkeyDiscovery';
import { JourneyChapter } from '../experience/JourneyChapter';
import { ScrollScene } from '../experience/ScrollScene';
import { DestinationPortal } from '../experience/DestinationPortal';
import { JourneyBuilder } from './JourneyBuilder';
import { ServiceWorldsV3 } from './ServiceWorlds';

export function SignaturePlaces({locale,exclude}:{locale:Locale;exclude?:string}) {
  const places=['cappadocia','rize-ayder','antalya'].map(id=>turkishPlaces.find(p=>p.slug===id)!).filter(p=>p.slug!==exclude);
  if(exclude&&places.length<3)places.push(turkishPlaces[0]);
  return <section className="signature-places sand"><div className="wrap"><div className="section-head"><h2>{copy.signature[locale]}</h2><Action locale={locale} path="destinations/turkiye#places" secondary>{ui.allCountries[locale]}</Action></div><div className="signature-layout">{places.map((p,i)=><Link key={p.slug} href={href(locale,`destinations/turkiye/${p.slug}`)} className="destination-portal" data-cursor-label={ui.more[locale]}><DestinationPortal slug={p.slug}><Photo file={p.image} alt={p.name[locale]}/></DestinationPortal><div><span className="index">0{i+1} / <bdi>{p.lat}° N</bdi></span><h3>{p.name[locale]}<ArrowUpRight/></h3><p>{p.note[locale]}</p></div></Link>)}</div></div></section>;
}
export function HomeJourney({locale}:{locale:Locale}) {
  return <ScrollScene>
    <div className="opening"><Hero locale={locale} title={turkeyCopy.hero[locale]} body={turkeyCopy.homeBody[locale]} home label={copy.follow[locale]}/><a className="scroll-cue" href="#service-worlds">{copy.scroll[locale]}<ArrowDown size={17}/></a><div className="departure-copy"><span>02 / {copy.follow[locale]}</span><p>{copy.departure[locale]}</p><div className="departure-context">{ui.storyBody[locale]}</div><bdi>İSTANBUL · 41.01° N / 28.98° E</bdi></div></div>
    <ServiceWorldsV3 locale={locale}/>
    <section className="turkey-entrance" aria-labelledby="turkey-entrance-title"><Photo file={turkishPlaces.find(p=>p.slug==='rize-ayder')!.image}/><div className="wrap"><span className="eyebrow">04 / {turkeyCopy.domestic[locale]}</span><h2 id="turkey-entrance-title">{locale==='ar'?'تركيا':'Türkiye'}</h2><div className="entrance-context"><span className="entrance-count" aria-hidden="true">12</span><div><h3>{turkeyCopy.directory[locale]}</h3><p>{turkeyCopy.intro[locale]}</p><a className="text-link" href="#turkiye">{turkeyCopy.choose[locale]}<ArrowDown size={18}/></a></div></div><div className="entrance-places" aria-hidden="true">{['istanbul','rize-ayder','cappadocia'].map(id=><span key={id}>{turkishPlaces.find(p=>p.slug===id)!.name[locale]}</span>)}</div></div><svg className="entrance-route" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M-30 60 C500 50 1300 50 1170 430 S200 530 350 920"/></svg></section>
    <JourneyChapter number="05" title={ui.destinations[locale]}><TurkeyDiscovery locale={locale} guided/></JourneyChapter>
    <JourneyChapter number="06" title={turkeyCopy.domestic[locale]} className="chapter-sand"><SignaturePlaces locale={locale}/></JourneyChapter>
    <JourneyChapter number="07" title={copy.film[locale]}><section className="travel-film"><div className="film-frame"><Photo file="turkiye.jpg"/><HeroVideo/><div className="film-statement"><h2>{copy.film[locale]}</h2><span>İSTANBUL / TÜRKİYE</span></div></div></section></JourneyChapter>
    <JourneyChapter number="08" title={ui.about[locale]} className="chapter-sand"><section className="editorial-story sand"><div className="wrap"><div className="story-portrait"><Photo file="turkiye.jpg"/><span>{ui.since[locale]}</span></div><div className="story-words"><span className="eyebrow">Trip Line</span><h2>{ui.storyTitle[locale]}</h2></div><div className="story-aside"><p>{ui.storyBody[locale]}</p><Action locale={locale} path="about" secondary>{ui.storyLink[locale]}</Action></div><svg className="story-route" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true"><path d="M0 150 C-70 750 400 850 680 760 S1150 600 1200 920"/></svg></div></section><div className="chapter-proof"><Numbers locale={locale}/></div><Partners locale={locale}/></JourneyChapter>
    <JourneyChapter number="09" title={ui.plan[locale]} className="chapter-sand"><JourneyBuilder locale={locale}/></JourneyChapter>
    <section className="final-arrival"><Photo file="coast.png"/><svg className="arrival-route" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M1440 0 C800 0 1300 520 700 500 S-120 600 260 780 H600"/><circle cx="600" cy="780" r="8"/></svg><div className="wrap"><span className="eyebrow">Trip Line / {copy.follow[locale]}</span><h2>{copy.arrival[locale]}</h2><p>{ui.ctaBody[locale]}</p><div className="actions"><Action locale={locale} path="contact">{ui.plan[locale]}</Action><WhatsApp locale={locale}/></div></div></section>
  </ScrollScene>;
}
