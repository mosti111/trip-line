import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkishPlaces } from '@/lib/turkiye';
import { AddToJourney } from '../experience/JourneyActions';
import { BusinessBrief } from './BusinessBrief';
import '@/styles/recovery-business.css';

export function BusinessExperience({ locale }: { locale: Locale }) {
  return <div className="recovery-business">
    <section className="rb-arrival" data-business-chapter="hero"><div className="rb-wrap">
      <Link className="rb-back" href={href(locale, 'services')}>{ui.services[locale]}<ArrowUpRight size={17}/></Link>
      <span className="rb-kicker">{ui.business[locale]} / TRIP LINE</span>
      <div className="rb-arrival-copy"><h1>{t('Bring people. Begin with purpose.','اجمعوا الناس حول هدف.','İnsanları bir amaçla buluşturun.')[locale]}</h1><div><p>{t('Corporate travel, events, camps, conferences and training — coordinated around what you came to do.','سفر الشركات والفعاليات والمخيمات والمؤتمرات والتدريب، بتنسيق يناسب ما جئتم لتحقيقه.','Kurumsal seyahat, etkinlik, kamp, konferans ve eğitim — geliş amacınıza göre koordine edilir.')[locale]}</p><a className="journey-action journey-action-primary" href="#business-objectives">{journeyPlan(locale)}<ArrowUpRight size={18}/></a></div></div>
      <div className="rb-hero-photo photo"><Image src="/media/corporate-v5.jpg" alt={ui.business[locale]} fill sizes="100vw" preload quality={85}/></div>
      <div className="rb-hero-caption"><span>{t('PEOPLE / PLACE / PURPOSE','الأشخاص / المكان / الهدف','İNSANLAR / MEKÂN / AMAÇ')[locale]}</span><span>TÜRKİYE</span></div>
    </div></section>
    <BusinessBrief locale={locale}>
      <section className="rb-process" data-business-chapter="process"><div className="rb-wrap"><span className="rb-kicker">03 / {ui.process[locale]}</span><div className="rb-process-layout"><h2>{ui.processTitle[locale]}</h2><ol>{[[ui.step1, ui.step1Body], [ui.step2, ui.step2Body], [ui.step3, ui.step3Body]].map(([title, body], i) => <li key={i}><span>0{i + 1}</span><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></li>)}</ol></div></div></section>
      <section className="rb-inspiration" data-business-chapter="inspiration"><div className="rb-wrap"><span className="rb-kicker">04 / TÜRKİYE</span><div className="rb-inspiration-heading"><h2>{t('A place in your plans.','مكان في خططكم.','Planlarınızda bir yer.')[locale]}</h2><p>{t('Explore these places as inspiration. Your program, venue and practical arrangements are discussed separately.','اكتشفوا هذه الوجهات للإلهام. يُناقش البرنامج والمكان والترتيبات العملية بشكل منفصل.','Bu yerlerden ilham alın. Program, mekân ve pratik düzenlemeler ayrıca görüşülür.')[locale]}</p></div><div className="rb-places">{['istanbul', 'sapanca'].map(id => { const p = turkishPlaces.find(p => p.slug === id)!; return <article key={id} data-business-place={id}><div className="photo"><Image src={`/media/${p.image}`} alt={p.name[locale]} fill sizes="(max-width: 760px) 100vw, 50vw" quality={85}/></div><h3>{p.name[locale]}</h3><p>{p.note[locale]}</p><div className="rb-place-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${id}`)}>{ui.more[locale]}<ArrowUpRight size={17}/></Link><AddToJourney id={id} locale={locale}/></div></article>; })}</div><Link className="journey-text-link" href={href(locale, 'destinations/turkiye')}>{t('Explore Türkiye','اكتشف تركيا','Türkiye’yi keşfet')[locale]}<ArrowUpRight size={17}/></Link></div></section>
    </BusinessBrief>
  </div>;
}

function journeyPlan(locale: Locale) { return t('Plan around your objective','خططوا وفق هدفكم','Amacınıza göre planlayın')[locale]; }
