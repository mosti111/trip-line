'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces } from '@/lib/turkiye';
import { companyProfile, profileDifferentiators } from '@/lib/company-profile';
import { countries } from '@/lib/travel-content';
import { journeyUi } from '@/lib/journey';
import { Photo } from '../travel/Sections';
import { useTravel } from '../travel/SiteShell';
import { TurkeyDiscovery, TurkeyDirectory } from '../travel/TurkeyDiscovery';
import { JourneyBuilder } from '../home-v3/JourneyBuilder';
import { AddToJourney, PlanJourney } from '../experience/JourneyActions';
import { useJourney } from '../experience/JourneyStore';
// Fresh direct navigation owns every reused style, independently of the homepage.
import '@/styles/recovery-home.css';
import '@/styles/recovery-turkiye.css';
import '@/styles/recovery-hub.css';

const groups = [
  { id: 'city', label: turkeyCopy.city, place: 'istanbul' },
  { id: 'black-sea', label: turkeyCopy.blackSea, place: 'rize-ayder' },
  { id: 'coast', label: turkeyCopy.coast, place: 'fethiye' },
  { id: 'nature', label: turkeyCopy.nature, place: 'cappadocia' },
] as const;
const hubCopy = {
  find: t('Find your Türkiye.', 'اكتشف تركيا التي تشبهك.', 'Kendi Türkiye’ni bul.'),
  sides: t('Different sides of Türkiye.', 'وجوه مختلفة لتركيا.', 'Türkiye’nin farklı yüzleri.'),
  yours: t('Your Türkiye.', 'تركيا بطريقتك.', 'Senin Türkiye’n.'),
  add: t('Add places as you explore.', 'أضف وجهات وأنت تستكشف.', 'Keşfederken yerler ekle.'),
  addBody: t('Use Add to journey beside a place you like. Keep exploring, then bring your choices together below.', 'استخدم «أضف إلى رحلتي» بجانب الوجهة التي تعجبك. واصل الاستكشاف، ثم اجمع اختياراتك أدناه.', 'Beğendiğin yerin yanındaki Yolculuğa ekle seçeneğini kullan. Keşfetmeye devam et, sonra seçimlerini aşağıda bir araya getir.'),
  explore: t('Explore destination', 'اكتشف الوجهة', 'Destinasyonu keşfet'),
  selected: t('Places in your journey', 'وجهات في رحلتك', 'Yolculuğundaki yerler'),
  empty: t('Your line is open. Choose the places that speak to you.', 'مسارك مفتوح. اختر الوجهات التي تلهمك.', 'Rotan henüz açık. Sana ilham veren yerleri seç.'),
  continue: t('Bring your Türkiye together.', 'اجمع رحلتك في تركيا.', 'Türkiye yolculuğunu bir araya getir.'),
  why: t('Care behind your Türkiye.', 'عناية وراء رحلتك في تركيا.', 'Türkiye yolculuğunun ardında özen.'),
  beyond: t('The line continues.', 'المسار مستمر.', 'Rota devam ediyor.'),
  beyondBody: t('Türkiye is the beginning. Explore the international destinations in our collection when you are ready to go further.', 'تركيا هي البداية. اكتشف الوجهات الدولية في مجموعتنا عندما ترغب في مواصلة الرحلة.', 'Türkiye bir başlangıç. Daha uzağa gitmek istediğinde koleksiyonumuzdaki uluslararası yerleri keşfet.'),
};

export function TurkeyHub({ locale }: { locale: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const seen = useRef(new WeakSet<Element>());
  const { calm } = useTravel();
  const { destinations, openJourney } = useJourney();
  const selected = destinations.map(id => turkishPlaces.find(place => place.slug === id)!);
  const proof = ['customized-experiences', 'professional-team', 'attention-to-detail'].map(id => profileDifferentiators.find(item => item.id === id)!);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const targets = [...root.querySelectorAll<HTMLElement>('[data-hub-reveal]')];
    let observer: IntersectionObserver | undefined;
    const reset = () => {
      observer?.disconnect(); observer = undefined;
      delete root.dataset.hubMotion;
      targets.forEach(node => { node.dataset.hubReveal = ''; });
    };
    const sync = () => {
      reset();
      if (calm || typeof IntersectionObserver !== 'function') return;
      root.dataset.hubMotion = 'enhanced';
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          node.dataset.hubReveal = seen.current.has(node) ? 'settled' : 'visible';
          seen.current.add(node);
          observer?.unobserve(node);
        });
      }, { threshold: .12 });
      targets.forEach(node => {
        if (seen.current.has(node)) node.dataset.hubReveal = 'settled';
        else { node.dataset.hubReveal = 'pending'; observer?.observe(node); }
      });
    };
    sync();
    if (typeof connection?.addEventListener === 'function') connection.addEventListener('change', sync);
    return () => { reset(); if (typeof connection?.removeEventListener === 'function') connection.removeEventListener('change', sync); };
  }, [calm]);
  return <div ref={host} className="recovery-hub" data-turkiye-hub>
    <section className="rhub-arrival" data-arrival data-hub-chapter="01" aria-labelledby="hub-title">
      <div className="rhub-arrival-media"><Photo file="turkiye.jpg" alt={countries.find(country => country.slug === 'turkiye')!.name[locale]} priority /><div className="rhub-arrival-shade" /></div>
      <svg className="rhub-arrival-route" data-hub-reveal="" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1470 110 C880 100 1430 750 850 710 S300 450 470 960" /></svg>
      <div className="rhub-wrap rhub-arrival-copy"><span className="rhub-kicker">01 / TÜRKİYE</span><h1 id="hub-title">{hubCopy.find[locale]}</h1><p>{turkeyCopy.intro[locale]}</p><div className="rhub-actions"><a className="journey-action journey-action-primary" href="#turkiye">{turkeyCopy.domestic[locale]}<ArrowDown size={18}/></a><PlanJourney locale={locale} className="rhub-plan-outline" /></div></div>
      <div className="rhub-wrap rhub-arrival-foot"><bdi dir="ltr">TÜRKİYE / TRIP LINE</bdi><span>{t('12 places to begin', '١٢ وجهة للبداية', 'Başlamak için 12 yer')[locale]}</span></div>
    </section>

    <section className="rhub-categories" data-hub-chapter="02" aria-labelledby="hub-categories-title"><div className="rhub-wrap"><div className="rhub-category-heading"><span className="rhub-kicker">02 / TÜRKİYE</span><h2 id="hub-categories-title">{t('What kind of Türkiye?', 'أيّ تركيا تلهمك؟', 'Nasıl bir Türkiye?')[locale]}</h2><p>{t('Follow a side of Türkiye below, or browse all twelve places in the directory.', 'انتقل إلى أحد وجوه تركيا أدناه، أو تصفّح الوجهات الاثنتي عشرة في الدليل.', 'Aşağıda bu dört deneyimden birine git veya dizindeki on iki yerin tümüne göz at.')[locale]}</p></div><nav aria-label={hubCopy.sides[locale]} className="rhub-category-line">{groups.map((group, index) => <a href={`#hub-side-${group.id}`} key={group.id}><span className="rhub-category-number" aria-hidden="true">0{index + 1}</span><strong>{group.label[locale]}</strong><span>{turkishPlaces.filter(place => place.group === group.id).map(place => place.name[locale]).join(' · ')}</span><ArrowDown size={18}/></a>)}</nav></div></section>

    <section className="rhub-explorer" data-hub-chapter="03" aria-labelledby="hub-explorer-title"><div className="rhub-wrap rhub-heading"><span className="rhub-kicker">03 / {turkeyCopy.domestic[locale]}</span><h2 id="hub-explorer-title">{turkeyCopy.choose[locale]}</h2><p>{turkeyCopy.homeBody[locale]}</p></div><TurkeyDiscovery locale={locale} full /></section>

    <section className="rhub-add" data-hub-chapter="04" aria-labelledby="hub-add-title"><div className="rhub-wrap rhub-add-layout"><div><span className="rhub-kicker">04 / {journeyUi.journey[locale]}</span><h2 id="hub-add-title">{hubCopy.add[locale]}</h2><p>{hubCopy.addBody[locale]}</p><a className="journey-text-link" href="#places">{turkeyCopy.directory[locale]}<ArrowDown size={18}/></a></div><div className="rhub-current"><span className="rhub-current-number" data-hub-journey-count>{String(destinations.length).padStart(2, '0')}</span><p role="status">{hubCopy.selected[locale]}: {destinations.length}</p><button className="journey-action journey-action-outline" type="button" onClick={openJourney}>{journeyUi.view[locale]}<ArrowUpRight size={18}/></button></div></div></section>

    <div data-hub-chapter="05"><TurkeyDirectory locale={locale}/></div>

    <section className="rhub-sides" data-hub-chapter="06" aria-labelledby="hub-sides-title"><div className="rhub-wrap"><div className="rhub-heading"><span className="rhub-kicker">06 / TÜRKİYE</span><h2 id="hub-sides-title">{hubCopy.sides[locale]}</h2><p>{turkeyCopy.homeBody[locale]}</p></div><div className="rhub-side-line">{groups.map((group, index) => { const place = turkishPlaces.find(item => item.slug === group.place)!; return <article className={`rhub-side rhub-side-${index}`} id={`hub-side-${group.id}`} key={group.id}><Link className="rhub-side-media" data-hub-reveal="" href={href(locale, `destinations/turkiye/${place.slug}`)}><Photo file={place.image} alt={place.name[locale]}/></Link><div className="rhub-side-copy"><span className="rhub-kicker">0{index + 1} / {group.label[locale]}</span><h3>{place.name[locale]}</h3><p>{place.note[locale]}</p><ul>{place.interests.map(interest => <li key={interest.en}>{interest[locale]}</li>)}</ul><div className="rhub-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${place.slug}`)}>{hubCopy.explore[locale]}<ArrowUpRight size={18}/></Link><AddToJourney locale={locale} id={place.slug}/></div></div></article>; })}</div></div></section>

    <div data-hub-chapter="07"><JourneyBuilder locale={locale} chapter="07" title={hubCopy.yours[locale]}/></div>

    <section className="rhub-proof" data-hub-chapter="08" aria-labelledby="hub-proof-title"><div className="rhub-wrap rhub-proof-layout"><div><span className="rhub-kicker">08 / {companyProfile.sourceLabel[locale]}</span><h2 id="hub-proof-title">{hubCopy.why[locale]}</h2><div className="rhub-credentials"><p>{companyProfile.licensed[locale]}</p><p>{companyProfile.accreditation[locale]}</p><p>{companyProfile.established[locale]}</p></div><Link className="journey-text-link" href={href(locale, 'about')}>{t('Explore Trip Line', 'اكتشف تريب لاين', 'Trip Line’ı keşfet')[locale]}<ArrowUpRight size={18}/></Link></div><ol className="rhub-proof-list">{proof.map((item, index) => <li key={item.id}><span aria-hidden="true">0{index + 1}</span><div><h3>{item.title[locale]}</h3><p>{item.body[locale]}</p></div></li>)}</ol></div></section>

    <section className="rhub-beyond" data-hub-chapter="09" aria-labelledby="hub-beyond-title"><div className="rhub-wrap rhub-beyond-layout"><div><span className="rhub-kicker">09 / {turkeyCopy.international[locale]}</span><h2 id="hub-beyond-title">{hubCopy.beyond[locale]}</h2><p>{hubCopy.beyondBody[locale]}</p></div><div className="rhub-country-links">{countries.filter(country => country.slug !== 'turkiye').map(country => <Link key={country.slug} href={href(locale, `destinations/${country.slug}`)}>{country.name[locale]}<ArrowUpRight size={15}/></Link>)}</div></div></section>

    <section className="rhub-final" data-journey-planner data-hub-chapter="10" aria-labelledby="hub-final-title"><Photo file="antalya.jpg" alt={turkishPlaces.find(place => place.slug === 'antalya')!.name[locale]}/><div className="rhub-final-shade"/><svg className="rhub-final-route" data-hub-reveal="" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1460 10 C980 280 1500 590 900 590 S240 380 280 720 H520"/><circle cx="520" cy="720" r="8"/></svg><div className="rhub-wrap"><span className="rhub-kicker">10 / {journeyUi.plan[locale]}</span><h2 id="hub-final-title">{hubCopy.continue[locale]}</h2><div className="rhub-final-journey" data-hub-journey-summary>{selected.length ? <ol>{selected.map((place, index) => <li key={place.slug}><span>{String(index + 1).padStart(2, '0')}</span><strong>{place.name[locale]}</strong></li>)}</ol> : <p>{hubCopy.empty[locale]}</p>}</div><p>{turkeyCopy.planning[locale]}</p><div className="rhub-actions"><PlanJourney locale={locale}/><a className="journey-text-link" href="#journey-builder">{t('Review your journey', 'راجع رحلتك', 'Yolculuğunu gözden geçir')[locale]}<ArrowUpRight size={18}/></a></div></div></section>
  </div>;
}
