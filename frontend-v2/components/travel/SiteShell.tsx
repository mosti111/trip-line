'use client';

import { createContext, useContext, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, ChevronDown, Menu, X, Mail, Phone } from 'lucide-react';
import { JourneyProvider, useJourney } from '../experience/JourneyStore';
import { JourneyDrawer, trapDialogFocus } from '../experience/JourneyDrawer';
import { AddToJourney, PlanJourney } from '../experience/JourneyActions';
import { href, locales, t, ui, type Locale } from '@/lib/i18n';
import { journeyUi } from '@/lib/journey';
import { turkeyCopy, turkishPlaces } from '@/lib/turkiye';
import { email, phone, services, whatsapp } from '@/lib/travel-content';

const Context = createContext<{ locale: Locale; calm: boolean }>({ locale: 'en', calm: false });
export const useTravel = () => useContext(Context);
const shellCopy = {
  discover: t('Discover Türkiye', 'اكتشف تركيا', 'Türkiye’yi keşfet'),
  services: t('Travel Services', 'خدمات السفر', 'Seyahat hizmetleri'),
  about: t('About', 'عن الشركة', 'Hakkımızda'),
  planMenu: t('Plan a Journey', 'خطط لرحلة', 'Yolculuk planla'),
  featured: t('Featured places', 'وجهات مميزة', 'Öne çıkan yerler'),
  places: t('Twelve places to begin.', 'اثنتا عشرة وجهة للبداية.', 'Başlamak için on iki yer.'),
  openTurkey: t('Open Türkiye discovery menu', 'افتح قائمة اكتشاف تركيا', 'Türkiye keşif menüsünü aç'),
};
const groups = [
  ['city', turkeyCopy.city], ['black-sea', turkeyCopy.blackSea], ['coast', turkeyCopy.coast], ['nature', turkeyCopy.nature],
] as const;
function subscribe(fn: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', fn); window.addEventListener('tripline-preference', fn); window.addEventListener('storage', fn);
  const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
  connection?.addEventListener?.('change', fn);
  return () => { connection?.removeEventListener?.('change', fn); media.removeEventListener('change', fn); window.removeEventListener('tripline-preference', fn); window.removeEventListener('storage', fn); };
}
function preference() { try { return localStorage.getItem('tripline-motion') === 'reduced' ? 'reduced' : 'system'; } catch { return 'system'; } }
function snapshot() { return preference() === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
function navigationSnapshot() { return snapshot() || !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData; }
const navigationEase = [0.22, 1, 0.36, 1] as const;

// Last decoded photograph remains below the latest request: two layers, no queue.
function MegaPhotography({ place, locale, reduced }: { place: typeof turkishPlaces[number]; locale: Locale; reduced: boolean }) {
  const [settled, setSettled] = useState(turkishPlaces[0]);
  const [ready, setReady] = useState('');
  const latest = useRef(place.slug);
  useEffect(() => { latest.current = place.slug; }, [place.slug]);
  return <div className="mega-preview-photo" data-preview-request={place.slug} data-preview-settled={settled.slug}>
    <Image src={`/media/${settled.image}`} alt="" fill sizes="40vw" />
    <motion.div key={place.slug} className="mega-preview-layer" initial={{ opacity: 0, transform: reduced ? 'scale(1)' : 'scale(1.035)' }} animate={{ opacity: ready === place.slug ? 1 : 0, transform: ready === place.slug || reduced ? 'scale(1)' : 'scale(1.035)' }} transition={{ duration: reduced ? 0 : .42, ease: navigationEase }} onAnimationComplete={() => { if (ready === place.slug && latest.current === place.slug) setSettled(place); }}>
      <Image src={`/media/${place.image}`} alt={place.name[locale]} fill sizes="40vw" onLoad={event => { const image = event.currentTarget; void image.decode().catch(() => {}).then(() => { if (latest.current === place.slug && image.naturalWidth) setReady(place.slug); }); }} onError={() => { if (latest.current === place.slug) setReady(''); }} />
    </motion.div>
  </div>;
}
function persistLanguage(locale: Locale) { document.cookie = `tripline-language=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; }
export function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20.4 3.7A10.2 10.2 0 0 0 4.2 15.9L2.7 21.5l5.7-1.4A10.2 10.2 0 0 0 20.4 3.7Z" /><path d="M8 6.8c.4-.2.7 0 .9.6l1 2c.2.4-.5 1-.9 1.4.6 1.7 2 3 3.8 3.6.4-.5.8-1.4 1.2-1.3l2.4 1.1c.5.2.6.5.4 1.1-.4 1.2-1.5 1.8-2.7 1.5-4.6-1.1-7.5-4.2-7.8-7.6-.1-1 .6-2.1 1.7-2.4Z" /></svg>;
}
export function Logo({ locale }: { locale: Locale }) {
  const id = useId();
  return <Link href={href(locale)} className="brand" aria-label={`Trip Line — ${ui.home[locale]}`}><svg viewBox="0 0 135 102" role="img" aria-label="Trip Line"><defs><filter id={id} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2 2 2 0 -5" /></filter></defs><image href="/media/logo-source.png" width="135" height="102" filter={`url(#${id})`} /></svg></Link>;
}
export function SiteShell({ locale, children, nonce }: { locale: Locale; children: ReactNode; nonce?: string }) {
  return <JourneyProvider><ShellContent locale={locale} nonce={nonce}>{children}</ShellContent></JourneyProvider>;
}
function ShellContent({ locale, children, nonce }: { locale: Locale; children: ReactNode; nonce?: string }) {
  const path = usePathname();
  const home = /^\/(en|ar|tr)\/?$/.test(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [previewId, setPreviewId] = useState('istanbul');
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const megaTrigger = useRef<HTMLButtonElement>(null);
  const megaHost = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const calm = useSyncExternalStore(subscribe, snapshot, () => true);
  const navigationCalm = useSyncExternalStore(subscribe, navigationSnapshot, () => true);
  const choice = useSyncExternalStore(subscribe, preference, () => 'system');
  const journey = useJourney();
  const menuId = useId(), megaId = useId();
  const preview = turkishPlaces.find(place => place.slug === previewId) || turkishPlaces[0];
  const nav = [['destinations/turkiye', shellCopy.discover], ['services', shellCopy.services], ['services/hajj-umrah', ui.pilgrimage], ['business', ui.business], ['about', shellCopy.about]] as const;
  const mobileNav = [['destinations/turkiye', turkeyCopy.domestic], ['plan', shellCopy.planMenu], ['services/hajj-umrah', ui.pilgrimage], ['business', ui.business], ['services', shellCopy.services], ['about', shellCopy.about], ['destinations', turkeyCopy.international], ['faq', ui.faq], ['contact', ui.contact]] as const;
  const langPath = path.replace(/^\/(en|ar|tr)(?=\/|$)/, '');
  const languageLinks = <div className="languages" aria-label={ui.language[locale]}>{locales.map(language => <a key={language} lang={language} href={href(language, langPath)} aria-current={language === locale ? 'true' : undefined} onClick={event => {
    persistLanguage(language);
    const context = window.location.search + window.location.hash;
    if (context) { event.preventDefault(); window.location.assign(href(language, langPath) + context); }
  }}>{language === 'ar' ? 'عربي' : language.toUpperCase()}</a>)}</div>;

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);
  useEffect(() => {
    if (!megaOpen) return;
    function outside(event: PointerEvent) { if (!megaHost.current?.contains(event.target as Node)) setMegaOpen(false); }
    function escape(event: globalThis.KeyboardEvent) { if (event.key === 'Escape') { setMegaOpen(false); megaTrigger.current?.focus(); } }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [megaOpen]);
  // Scroll writes CSS/DOM only: no React state on animation frames.
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      header.current?.classList.toggle('is-scrolled', window.scrollY > 40);
      const length = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${length > 0 ? Math.min(1, window.scrollY / length) : 0})`;
      const hero = document.querySelector<HTMLElement>('#main .opening, #main .hero, #main [data-arrival]');
      const afterHero = hero ? hero.getBoundingClientRect().bottom <= 90 : window.scrollY > 200;
      const blocked = [...document.querySelectorAll<HTMLElement>('#journey-builder, [data-journey-planner], #inquiry, .brief-fields, .footer')].some(node => { const rect = node.getBoundingClientRect(); return rect.top < window.innerHeight && rect.bottom > 0; });
      const viewport = window.visualViewport;
      const keyboard = !!viewport && window.innerHeight - viewport.height > 140;
      sticky.current?.toggleAttribute('data-visible', afterHero && !blocked && !keyboard && !menuOpen && !journey.drawerOpen);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule); window.visualViewport?.addEventListener('scroll', schedule);
    update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('scroll', schedule); };
  }, [path, home, menuOpen, journey.drawerOpen]);
  function closeMenu() { menu.current?.close(); }
  function openMenu() { setMegaOpen(false); menu.current?.showModal(); setMenuOpen(true); }

  return <Context.Provider value={{ locale, calm }}><MotionConfig reducedMotion={calm ? 'always' : 'user'} nonce={nonce}><div className={`travel-site recovery-shell ${home ? 'shell-home' : 'shell-secondary'} ${calm ? 'reduce-motion' : ''} ${navigationCalm ? 'navigation-reduced' : ''}`}>
    <a className="skip-link" href="#main">{ui.skip[locale]}</a>
    <header ref={header} className="header recovery-header"><div className="recovery-header-inner"><Logo locale={locale} /><nav className="desktop-nav" aria-label={ui.nav[locale]}>{nav.map(([route, label], index) => index === 0 ? <div ref={megaHost} className="nav-turkiye" key={route} onMouseLeave={() => { if (!megaHost.current?.contains(document.activeElement)) setMegaOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMegaOpen(false); }}>
      <div className="nav-turkiye-link"><Link href={href(locale, route)} aria-current={path.startsWith(href(locale, route)) ? 'page' : undefined} onMouseEnter={() => setMegaOpen(true)} onClick={() => setMegaOpen(false)}>{label[locale]}</Link><button ref={megaTrigger} type="button" aria-label={shellCopy.openTurkey[locale]} aria-expanded={megaOpen} aria-controls={megaId} onClick={() => setMegaOpen(open => !open)}><ChevronDown size={14} /></button></div>
      {/* hidden remains the existing scroll-controller signal; display retains the visual exit. */}<MotionConfig reducedMotion="never"><motion.div hidden={!megaOpen} style={{ display: 'block' }} id={megaId} className="turkiye-mega" data-native-scroll data-open={megaOpen} inert={!megaOpen} aria-hidden={!megaOpen} initial={false} animate={{ transform: megaOpen || navigationCalm ? 'translateY(0px)' : 'translateY(-12px)', opacity: megaOpen ? 1 : .96 }} transition={{ duration: navigationCalm ? 0 : megaOpen ? .32 : .22, ease: navigationEase }}><div className="turkiye-mega-inner"><div className="mega-directory"><span className="journey-eyebrow">TÜRKİYE / 12</span><h2>{shellCopy.places[locale]}</h2><div className="mega-featured"><span>{shellCopy.featured[locale]}</span>{['istanbul', 'cappadocia', 'rize-ayder'].map(id => { const place = turkishPlaces.find(place => place.slug === id)!; return <Link key={id} href={href(locale, `destinations/turkiye/${id}`)} data-active={previewId === id} onMouseEnter={() => setPreviewId(id)} onFocus={() => setPreviewId(id)} onClick={() => setMegaOpen(false)}>{place.name[locale]}<ArrowUpRight size={14} /></Link>; })}</div><div className="mega-groups">{groups.map(([group, label]) => <div key={group}><button type="button" onClick={() => setPreviewId(turkishPlaces.find(place => place.group === group)!.slug)}>{label[locale]}</button>{turkishPlaces.filter(place => place.group === group).map(place => <Link key={place.slug} href={href(locale, `destinations/turkiye/${place.slug}`)} data-active={previewId === place.slug} onMouseEnter={() => setPreviewId(place.slug)} onFocus={() => setPreviewId(place.slug)} onClick={() => setMegaOpen(false)}>{place.name[locale]}</Link>)}</div>)}</div><Link className="mega-beyond" href={href(locale, 'destinations')} onClick={() => setMegaOpen(false)}>{turkeyCopy.international[locale]}<ArrowUpRight size={14} /></Link></div><div className="mega-preview"><MegaPhotography place={preview} locale={locale} reduced={navigationCalm} /><div className="mega-preview-copy"><motion.h3 key={preview.slug} initial={{ transform: navigationCalm ? 'translateY(0px)' : 'translateY(7px)' }} animate={{ transform: 'translateY(0px)' }} transition={{ duration: navigationCalm ? 0 : .22, ease: navigationEase }}>{preview.name[locale]}</motion.h3><p>{preview.interests[0][locale]}</p><div className="mega-preview-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${preview.slug}`)} onClick={() => setMegaOpen(false)}>{ui.more[locale]}<ArrowUpRight size={17} /></Link><AddToJourney id={preview.slug} locale={locale} /></div></div></div></div></motion.div></MotionConfig>
    </div> : <Link key={route} href={href(locale, route)} aria-current={path === href(locale, route) || path.startsWith(href(locale, route) + '/') ? 'page' : undefined}>{label[locale]}</Link>)}</nav><div className="header-tools">{languageLinks}{journey.destinations.length > 0 && <button type="button" className="header-journey" onClick={() => { setMegaOpen(false); journey.openJourney(); }}>{journeyUi.journey[locale]} · {journey.destinations.length}</button>}<PlanJourney locale={locale} className="header-plan" /><button ref={trigger} className="menu-button" type="button" aria-label={ui.menu[locale]} aria-expanded={menuOpen} aria-controls={menuId} onClick={openMenu}><Menu size={24} /></button></div></div>{home && <span className="header-progress" ref={progress} aria-hidden="true" />}</header>
    <main id="main">{children}</main>
    <footer className="footer"><div className="footer-grid"><div className="footer-brand"><Logo locale={locale} /><p>{ui.tagline[locale]}</p><a className="text-link" href={whatsapp(ui.plan[locale])}><WhatsAppIcon /> WhatsApp</a></div><div><h2>{ui.services[locale]}</h2>{services.map(service => <Link key={service.slug} href={href(locale, `services/${service.slug}`)}>{service.title[locale]}</Link>)}</div><div><h2>{turkeyCopy.domestic[locale]}</h2><div className="footer-countries">{turkishPlaces.map(place => <Link key={place.slug} href={href(locale, `destinations/turkiye/${place.slug}`)}>{place.name[locale]}</Link>)}</div><Link href={href(locale, 'destinations')}>{turkeyCopy.international[locale]} ↗</Link></div><div><h2>{ui.company[locale]}</h2>{[['about', ui.about], ['business', ui.business], ['faq', ui.faq], ['contact', ui.contact]].map(([route, label]) => <Link key={route as string} href={href(locale, route as string)}>{typeof label === 'string' ? label : label[locale]}</Link>)}<h2 className="footer-contact-title">{ui.contact[locale]}</h2><a href={`mailto:${email}`}><Mail size={15} /><bdi>{email}</bdi></a><a href={`tel:${phone}`}><Phone size={15} /><bdi>+90 554 107 22 02</bdi></a></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Trip Line. {ui.rights[locale]}</small><div><Link href={href(locale, 'privacy')}>{ui.privacy[locale]}</Link><Link href={href(locale, 'terms')}>{ui.terms[locale]}</Link></div><label className="motion-choice">{ui.motion[locale]}<select value={choice} onChange={event => { try { localStorage.setItem('tripline-motion', event.target.value); } catch {} window.dispatchEvent(new Event('tripline-preference')); }}><option value="system">{ui.system[locale]}</option><option value="reduced">{ui.reduce[locale]}</option></select></label></div></footer>
    <dialog ref={menu} id={menuId} className="nav-dialog recovery-menu" aria-labelledby={`${menuId}-title`} onKeyDown={trapDialogFocus} onCancel={event => { event.preventDefault(); closeMenu(); }} onClose={() => { setMenuOpen(false); trigger.current?.focus(); }} data-native-scroll><div className="dialog-header"><span id={`${menuId}-title`}>Trip Line</span><button type="button" className="icon-button" aria-label={ui.close[locale]} onClick={closeMenu}><X /></button></div><nav aria-label={ui.nav[locale]}>{mobileNav.map(([route, label], index) => route === 'plan' ? <span className="mobile-menu-plan-row" style={{ animationDelay: `${Math.min(index, 4) * 40}ms`, animationDuration: `${300 - Math.min(index, 4) * 40}ms` }} key={route} onClick={closeMenu}><PlanJourney locale={locale} className="mobile-menu-plan"><span className="index">{String(index + 1).padStart(2, '0')}</span>{label[locale]}</PlanJourney></span> : <Link key={route} style={{ animationDelay: `${Math.min(index, 4) * 40}ms`, animationDuration: `${300 - Math.min(index, 4) * 40}ms` }} href={href(locale, route)} onClick={closeMenu}><span className="index">{String(index + 1).padStart(2, '0')}</span>{label[locale]}<ArrowUpRight size={22} /></Link>)}</nav><div className="dialog-footer">{journey.destinations.length > 0 && <button type="button" className="journey-action journey-action-outline" onClick={() => { closeMenu(); journey.openJourney(); }}>{journeyUi.view[locale]} · {journey.destinations.length}</button>}{languageLinks}<a href={`mailto:${email}`}>{email}</a></div></dialog>
    <JourneyDrawer locale={locale} />
    <div ref={sticky} className="mobile-plan"><div>{journey.destinations.length > 0 ? <button type="button" className="journey-action journey-action-primary" onClick={journey.openJourney}>{journeyUi.view[locale]} · {journey.destinations.length}<ArrowUpRight size={18} /></button> : <PlanJourney locale={locale} />}</div></div>
  </div></MotionConfig></Context.Provider>;
}
