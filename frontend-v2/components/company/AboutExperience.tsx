import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { companyProfile, profileDifferentiators, profileFigures } from '@/lib/company-profile';
import { PlanJourney } from '../experience/JourneyActions';
import '@/styles/recovery-company.css';
import { AboutMotion } from './AboutMotion';

const copy = {
  title: t('Thoughtful travel. Human connections.','سفر بعناية. وروابط إنسانية.','Özenli seyahat. İnsani bağlar.'),
  story: t('A travel companion, from the beginning.','رفيق سفر، منذ البداية.','Başlangıçtan itibaren bir yol arkadaşı.'),
  mission: t('Our mission','رسالتنا','Misyonumuz'), vision: t('Our vision','رؤيتنا','Vizyonumuz'),
  approach: t('The care behind the journey.','العناية وراء الرحلة.','Yolculuğun ardındaki özen.'),
  why: t('Why Trip Line','لماذا تريب لاين','Neden Trip Line'),
  figures: t('A profile of our work.','أرقام من ملف أعمالنا.','Çalışmalarımızın profili.'),
  figuresNote: t('Figures reported in Company Profile 2025.','أرقام واردة في ملف الشركة لعام ٢٠٢٥.','2025 Şirket Profili’nde bildirilen rakamlar.'),
  partners: t('Connections in the company profile.','جهات في ملف الشركة.','Şirket profilindeki bağlantılar.'),
  continue: t('Your journey starts with a conversation.','تبدأ رحلتك بحوار.','Yolculuğunuz bir görüşmeyle başlar.'),
  turkey: t('Explore Türkiye','اكتشف تركيا','Türkiye’yi keşfet'),
};

/** Source-first server composition; only the existing global planning action needs client state. */
export function AboutExperience({ locale }: { locale: Locale }) {
  const figures = profileFigures.filter(figure => !figure.requiresClarification);
  return <div className="recovery-company">
    <section className="rc-arrival" data-about-chapter="hero"><div className="rc-wrap"><span className="rc-kicker">TRIP LINE / {ui.about[locale]}</span><div className="rc-arrival-layout"><div><h1>{copy.title[locale]}</h1><p className="rc-established" data-about-established>{companyProfile.established[locale]}</p></div><div className="rc-arrival-intro"><p>{companyProfile.mission[locale]}</p><a className="journey-text-link" href="#about-story">{ui.more[locale]}<ArrowUpRight size={18}/></a></div></div><div className="rc-hero-photo photo"><Image src="/media/turkiye.jpg" alt={t('Istanbul, Türkiye','إسطنبول، تركيا','İstanbul, Türkiye')[locale]} fill sizes="100vw" preload quality={85}/></div><div className="rc-photo-caption"><span>{t('Istanbul / Türkiye','إسطنبول / تركيا','İstanbul / Türkiye')[locale]}</span><span>{companyProfile.sourceLabel[locale]}</span></div></div></section>
    <section className="rc-story" id="about-story" data-about-chapter="story"><div className="rc-wrap"><span className="rc-kicker">01 / {companyProfile.sourceLabel[locale]}</span><div className="rc-story-layout"><h2>{copy.story[locale]}</h2><div className="rc-source-statements"><p data-about-license>{companyProfile.licensed[locale]}</p><p data-about-accreditation>{companyProfile.accreditation[locale]}</p><small data-about-source>{companyProfile.sourceLabel[locale]}</small></div></div><div className="rc-purpose"><article><h3>{copy.mission[locale]}</h3><p data-about-mission>{companyProfile.mission[locale]}</p></article><article><h3>{copy.vision[locale]}</h3><p data-about-vision>{companyProfile.vision[locale]}</p></article></div></div></section>
    <section className="rc-approach" data-about-chapter="differentiators"><div className="rc-wrap"><span className="rc-kicker">02 / {copy.why[locale]}</span><div className="rc-approach-heading"><h2>{copy.approach[locale]}</h2><small data-about-source>{companyProfile.sourceLabel[locale]}</small></div><div className="rc-approach-layout"><div className="rc-approach-media"><div className="photo"><Image src="/media/turkiye.jpg" alt={t('Water and wooded hills','المياه وتلال الأشجار','Su ve ağaçlarla kaplı tepeler')[locale]} fill sizes="(max-width: 760px) 100vw, 40vw" quality={85}/></div><p>{t('Water and wooded hills','المياه وتلال الأشجار','Su ve ağaçlarla kaplı tepeler')[locale]}</p><Link className="journey-text-link" href={href(locale, 'services')}>{ui.services[locale]}<ArrowUpRight size={18}/></Link></div><ol className="rc-differentiators">{profileDifferentiators.map((item, index) => <li key={item.id} data-about-differentiator={item.id}><span className="rc-index">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title[locale]}</h3><p>{item.body[locale]}</p></div></li>)}</ol></div></div></section>
    <section className="rc-figures" data-about-chapter="figures"><div className="rc-wrap"><span className="rc-kicker">03 / {companyProfile.sourceLabel[locale]}</span><div className="rc-figures-heading"><h2>{copy.figures[locale]}</h2><p data-about-figures-source>{copy.figuresNote[locale]}</p></div><div className="rc-figure-route" role="list">{figures.map(figure => <div className={`rc-figure rc-figure-${figure.id}`} key={figure.id} role="listitem" data-about-figure={figure.id} data-profile-value={figure.value}><strong>{figure.value.toLocaleString(locale)}<span>{figure.suffix}</span></strong><p>{figure.label[locale]}</p></div>)}</div><small data-about-source>{companyProfile.sourceLabel[locale]}</small></div></section>
    <section className="rc-partners" data-about-chapter="partners"><div className="rc-wrap"><span className="rc-kicker">04 / {companyProfile.sourceLabel[locale]}</span><h2>{copy.partners[locale]}</h2><p data-about-partners-source>{companyProfile.partnersSource[locale]}</p><div className="rc-partner-strips" tabIndex={0} role="region" aria-label={companyProfile.partnersSource[locale]} data-about-partners><Image src="/media/partners-1.png" width={2212} height={184} sizes="(max-width:760px) 100vw, 1280px" alt="Grand Aras, Wyndham Hotels & Resorts, NDC Portal, Yamaçoda Suite Otel, Buke Hotel, rezlive.com, Copthorne"/><Image src="/media/partners-2.png" width={2212} height={180} sizes="(max-width:760px) 100vw, 1280px" alt="Santo Ottoman, Megza Bungalow, RateHawk, Homey, Continent Worldwide, Days Inn by Wyndham, Millennium"/></div></div></section>
    <section className="rc-continue" data-about-chapter="plan"><div className="rc-wrap rc-continue-layout"><div><AboutMotion/><span className="rc-kicker">TRIP LINE / TÜRKİYE</span><h2>{copy.continue[locale]}</h2></div><div className="rc-continue-actions"><PlanJourney locale={locale}/><Link className="journey-text-link" data-about-turkiye href={href(locale, 'destinations/turkiye')}>{copy.turkey[locale]}<ArrowUpRight size={18}/></Link><Link className="journey-text-link" data-about-services href={href(locale, 'services')}>{ui.services[locale]}<ArrowUpRight size={18}/></Link></div></div></section>
  </div>;
}
