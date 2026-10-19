import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { companyProfile, profileDifferentiators, profileFigures } from '@/lib/company-profile';
import { countries, questions, services } from '@/lib/travel-content';
import { journeyCopy } from '@/lib/journey';
import { Photo, WhatsApp } from '../travel/Sections';
import { PlanJourney } from '../experience/JourneyActions';

export function HomeStory({ locale }: { locale: Locale }) {
  return <section className="rh-story" data-chapter="07" aria-labelledby="story-title"><div className="rh-wrap rh-story-layout"><div className="rh-story-image"><Photo file="turkiye.jpg" alt={ui.since[locale]}/><span>{ui.since[locale]}</span></div><div className="rh-story-copy"><span className="rh-kicker">07 / TRIP LINE</span><h2 id="story-title">{ui.storyTitle[locale]}</h2><p>{ui.storyBody[locale]}</p><Link className="journey-text-link" href={href(locale, 'about')}>{t('Explore our story', 'اكتشف قصتنا', 'Hikâyemizi keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></div></section>;
}
export function HomeProof({ locale }: { locale: Locale }) {
  const differentiators = ['customized-experiences', 'professional-team', 'attention-to-detail'].map(id => profileDifferentiators.find(item => item.id === id)!);
  return <section className="rh-proof" data-chapter="08" aria-labelledby="proof-title"><div className="rh-wrap rh-proof-layout"><div><span className="rh-kicker">08 / {companyProfile.sourceLabel[locale]}</span><h2 id="proof-title">{t('Care behind every journey.', 'عناية وراء كل رحلة.', 'Her yolculuğun ardında özen.')[locale]}</h2><div className="rh-credentials"><p>{companyProfile.licensed[locale]}</p><p>{companyProfile.accreditation[locale]}</p><p>{companyProfile.established[locale]}</p></div></div><ol className="rh-differentiators">{differentiators.map((item, i) => <li key={item.id}><span className="rh-kicker">0{i + 1}</span><div><h3>{item.title[locale]}</h3><p>{item.body[locale]}</p></div></li>)}</ol></div></section>;
}
export function HomeNumbers({ locale }: { locale: Locale }) {
  const figures = ['clients', 'tours', 'hotels', 'pilgrims'].map(id => profileFigures.find(item => item.id === id)!);
  return <section className="rh-numbers" data-chapter="09" aria-labelledby="numbers-title"><div className="rh-wrap"><span className="rh-kicker">09 / {companyProfile.sourceLabel[locale]}</span><h2 id="numbers-title">{t('Journeys, in perspective.', 'رحلات بالأرقام.', 'Yolculuklara bir bakış.')[locale]}</h2><div className="rh-figure-route"><svg viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 160 C350 480 600 20 840 290 S1130 480 1250 140"/></svg>{figures.map((figure, i) => <div className={`rh-figure rh-figure-${i}`} key={figure.id}><strong><bdi>{figure.value.toLocaleString(locale)}{figure.suffix}</bdi></strong><span>{figure.label[locale]}</span></div>)}</div><p className="rh-source">{companyProfile.sourceLabel[locale]}</p></div></section>;
}
export function HomeProcess({ locale }: { locale: Locale }) {
  const steps = [
    { title: t('Tell us', 'أخبرنا', 'Bize anlat'), body: ui.step1Body },
    { title: t('We coordinate', 'ننسّق', 'Birlikte planlayalım'), body: ui.step2Body },
    { title: t('You confirm', 'أنت تؤكد', 'Sen onayla'), body: ui.step3Body },
  ];
  return <section className="rh-process" data-chapter="10" aria-labelledby="process-title"><div className="rh-wrap"><div className="rh-section-heading"><span className="rh-kicker">10 / {ui.process[locale]}</span><h2 id="process-title">{ui.processTitle[locale]}</h2></div><ol className="rh-process-line">{steps.map((step, i) => <li key={i}><span className="rh-process-node">0{i + 1}</span><h3>{step.title[locale]}</h3><p>{step.body[locale]}</p></li>)}</ol></div></section>;
}
export function HomeServices({ locale }: { locale: Locale }) {
  const groups = [
    { title: t('Travel', 'السفر', 'Seyahat'), image: 'coast.png', ids: ['tours', 'tailor-made', 'flights-hotels', 'visa-assistance'] },
    { title: ui.business, image: 'business.jpg', ids: ['corporate', 'events', 'training', 'camps'] },
    { title: ui.pilgrimage, image: 'saudi-arabia.jpg', ids: ['hajj-umrah'] },
  ];
  return <section className="rh-services" data-chapter="11" aria-labelledby="services-title"><div className="rh-wrap"><div className="rh-section-heading"><span className="rh-kicker">11 / {ui.services[locale]}</span><h2 id="services-title">{journeyCopy.services[locale]}</h2></div><div className="rh-service-line">{groups.map((group, i) => <div className={`rh-service-group rh-service-group-${i}`} key={i}><span className="rh-kicker">0{i + 1}</span><Photo file={group.image} alt={group.title[locale]}/><h3>{group.title[locale]}</h3><ul>{group.ids.map(id => { const service = services.find(item => item.slug === id)!; return <li key={id}><Link href={href(locale, `services/${id}`)}><span>{service.title[locale]}</span><ArrowUpRight size={17}/></Link></li>; })}</ul></div>)}</div></div></section>;
}
export function HomeBeyond({ locale }: { locale: Locale }) {
  const international = countries.filter(country => country.slug !== 'turkiye');
  return <section className="rh-beyond" data-chapter="13" aria-labelledby="beyond-title"><div className="rh-wrap rh-beyond-layout"><div><span className="rh-kicker">13 / {t('Beyond Türkiye', 'خارج تركيا', 'Türkiye’nin ötesi')[locale]}</span><h2 id="beyond-title">{t('The line continues.', 'المسار مستمر.', 'Rota devam ediyor.')[locale]}</h2><p>{t('Explore our international destinations and tell us where you would like your journey to continue.', 'اكتشف وجهاتنا الدولية وأخبرنا إلى أين ترغب أن تستمر رحلتك.', 'Uluslararası destinasyonlarımızı keşfet ve yolculuğunu nerede sürdürmek istediğini bizimle paylaş.')[locale]}</p><Link className="journey-text-link" href={href(locale, 'destinations')}>{t('Explore beyond Türkiye', 'اكتشف ما وراء تركيا', 'Türkiye’nin ötesini keşfet')[locale]}<ArrowUpRight size={18}/></Link></div><div className="rh-beyond-directory"><div className="rh-beyond-photos"><Photo file="georgia.jpg" alt={international.find(c => c.slug === 'georgia')!.name[locale]}/><Photo file="maldives.jpg" alt={international.find(c => c.slug === 'maldives')!.name[locale]}/></div><div className="rh-beyond-links">{international.map(country => <Link key={country.slug} href={href(locale, `destinations/${country.slug}`)}>{country.name[locale]}<ArrowUpRight size={14}/></Link>)}</div></div></div></section>;
}
export function HomeFAQ({ locale }: { locale: Locale }) {
  return <section className="rh-faq" data-chapter="14" aria-labelledby="faq-title"><div className="rh-wrap rh-faq-layout"><div><span className="rh-kicker">14 / {ui.faq[locale]}</span><h2 id="faq-title">{t('A little clarity before you go.', 'وضوح قبل أن تبدأ.', 'Yola çıkmadan önce netlik.')[locale]}</h2><Link className="journey-text-link" href={href(locale, 'faq')}>{ui.faq[locale]}<ArrowUpRight size={18}/></Link></div><div>{[questions[0], questions[1], questions[2], questions[4]].map((question, i) => <details key={i}><summary>{question.q[locale]}<Plus size={18}/></summary><p>{question.a[locale]}</p></details>)}</div></div></section>;
}
export function HomeFinal({ locale }: { locale: Locale }) {
  return <section className="rh-final" data-chapter="15" aria-labelledby="final-title"><Photo file="antalya.jpg" sizes="100vw" alt={t('The coast of Türkiye', 'ساحل تركيا', 'Türkiye kıyıları')[locale]}/><div className="rh-final-shade"/><svg className="rh-final-route" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M1450 0 C500 10 1400 530 770 560 S40 520 240 760 H570"/><circle cx="570" cy="760" r="9"/></svg><div className="rh-wrap"><span className="rh-kicker">15 / {journeyCopy.follow[locale]}</span><h2 id="final-title">{t('Your next journey starts with a conversation.', 'رحلتك القادمة تبدأ بحوار.', 'Sıradaki yolculuğun bir sohbetle başlar.')[locale]}</h2><p>{ui.ctaBody[locale]}</p><div className="rh-actions"><PlanJourney locale={locale}/><WhatsApp locale={locale}/></div><p className="rh-source">{t('Share your idea on WhatsApp. We’ll discuss the arrangements together.', 'شارك فكرتك على واتساب. سنناقش الترتيبات معاً.', 'Fikrini WhatsApp’tan paylaş. Düzenlemeleri birlikte konuşalım.')[locale]}</p></div></section>;
}
