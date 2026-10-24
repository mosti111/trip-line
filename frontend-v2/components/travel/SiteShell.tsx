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
  return <Link href={href(locale)} className="brand" aria-label={`Trip Line — ${ui.home[locale]}`}><svg viewBox="7 7 272 208" role="img" aria-label="Trip Line"><path fill="currentColor" fillRule="evenodd" d="M 131.286 9.692 C 130.069 9.933, 127.706 11.406, 126.036 12.966 C 121.788 16.934, 121.740 22.894, 125.923 27.077 C 131.239 32.393, 142.331 31.128, 145.585 24.835 C 150.041 16.219, 141.897 7.595, 131.286 9.692 M 10 29 L 10 37 21.485 37 L 32.969 37 33.235 65.750 L 33.500 94.500 43 94.615 C 49.003 94.688, 52.770 94.320, 53.235 93.615 C 53.639 93.002, 53.976 80.013, 53.985 64.750 L 54 37 65 37 L 76 37 76 29 L 76 21 43 21 L 10 21 10 29 M 262.157 28 C 258.428 31.564, 258.149 31.583, 248.513 28.940 C 238.107 26.085, 235.502 27.866, 243.353 32.467 C 245.747 33.870, 248.528 35.926, 249.533 37.036 C 251.318 39.009, 251.282 39.120, 247.930 41.987 C 245.737 43.862, 243.349 44.933, 241.309 44.959 C 238.297 44.998, 235.569 47.004, 237.573 47.707 C 241.682 49.149, 241.431 49.905, 234.418 57.196 C 230.554 61.213, 225.842 66.692, 223.947 69.372 L 220.500 74.244 219.871 65.372 C 219.162 55.358, 217.258 50.021, 212.659 45.161 C 204.266 36.289, 189.401 33.645, 179.742 39.305 L 175 42.084 175 39.542 L 175 37 165.500 37 L 156 37 156 76 L 156 115 166 115 L 176 115 176 104 C 176 97.105, 176.385 93, 177.032 93 C 177.600 93, 179.651 93.663, 181.590 94.473 C 191.363 98.557, 202.838 96.846, 210.196 90.210 C 212.458 88.170, 216.823 82.675, 219.896 78 C 226.437 68.050, 227.570 66.610, 235.409 58.279 C 241.891 51.390, 243.482 50.769, 245.168 54.469 C 246.685 57.798, 248 56.711, 248 52.128 C 248 49.279, 248.709 47.695, 250.940 45.557 C 254.642 42.010, 256.137 42.568, 260.073 48.964 C 265.430 57.671, 267.175 54.992, 263.945 43.019 L 261.743 34.860 264.872 31.632 C 270.553 25.771, 268.027 22.391, 262.157 28 M 111.500 36.917 C 107.848 37.828, 102.354 40.618, 101.504 41.993 C 100.282 43.970, 99 42.950, 99 40 L 99 37 89.500 37 L 80 37 80 66.036 L 80 95.072 89.750 94.786 L 99.500 94.500 100 78.451 C 100.643 57.825, 102.056 55.269, 113.500 54.038 L 118.500 53.500 118.500 45 C 118.500 35.613, 118.186 35.250, 111.500 36.917 M 125.235 65.750 L 125.500 94.500 135 94.500 L 144.500 94.500 144.765 65.750 L 145.031 37 135 37 L 124.969 37 125.235 65.750 M 182.190 53.353 C 174.176 57.800, 173.856 73.910, 181.697 78.105 C 185.420 80.097, 192.540 79.726, 195.103 77.406 C 202.068 71.104, 201.506 58.093, 194.080 53.706 C 190.686 51.702, 185.446 51.546, 182.190 53.353 M 92.314 127.950 C 80.865 134.931, 89.733 150.045, 103.283 146.644 C 112.422 144.350, 113.766 131.439, 105.316 127.117 C 101.963 125.402, 95.850 125.794, 92.314 127.950 M 17 174 L 17 211 45 211 L 73 211 73 203 L 73 195 55.500 195 L 38 195 38 166 L 38 137 27.500 137 L 17 137 17 174 M 156.391 155.987 C 153.151 157.630, 150.387 158.980, 150.250 158.987 C 150.113 158.994, 150 157.875, 150 156.500 C 150 154.009, 149.967 154, 140.500 154 L 131 154 131 182.500 L 131 211 141 211 L 151 211 151 195.468 C 151 174.795, 153.097 170, 162.141 170 C 171.116 170, 172 172.147, 172 193.950 L 172 211 182.071 211 L 192.142 211 191.821 189.750 C 191.523 169.991, 191.343 168.206, 189.259 164.308 C 183.403 153.353, 168.851 149.669, 156.391 155.987 M 230.216 154.891 C 218.731 158.858, 211.989 168.139, 211.218 181.044 C 210.650 190.544, 213.147 197.037, 219.688 203.066 C 226.311 209.171, 231.884 211.303, 242.500 211.791 C 252.746 212.263, 261.535 209.919, 265.904 205.551 L 268.340 203.114 263.697 197.679 L 259.054 192.245 254.358 194.622 C 248.614 197.530, 242.289 197.698, 237.157 195.080 C 233.760 193.347, 230.415 188.918, 231.605 187.728 C 231.864 187.469, 240.103 187.487, 249.913 187.768 C 259.723 188.049, 268.990 187.968, 270.506 187.588 C 273.240 186.902, 273.258 186.843, 272.775 180.099 C 271.606 163.755, 259.404 152.949, 242.212 153.033 C 238.395 153.051, 233.221 153.853, 230.216 154.891 M 89 182.500 L 89 211 99 211 L 109 211 109 182.500 L 109 154 99 154 L 89 154 89 182.500 M 234.525 170.275 C 228.479 176.321, 229.285 177, 242.500 177 C 255.434 177, 256.182 176.474, 251.191 170.887 C 248.910 168.335, 247.409 167.650, 243.215 167.247 C 238.350 166.779, 237.845 166.955, 234.525 170.275" /></svg></Link>;
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
    if (!menuOpen && !megaOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen, megaOpen]);
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
      {/* hidden remains the existing scroll-controller signal; display retains the visual exit. */}<MotionConfig reducedMotion="never"><motion.div hidden={!megaOpen} style={{ display: 'block' }} id={megaId} className="turkiye-mega" data-native-scroll data-open={megaOpen} inert={!megaOpen} aria-hidden={!megaOpen} initial={false} animate={{ transform: megaOpen || navigationCalm ? 'translateY(0px)' : 'translateY(-12px)', opacity: megaOpen ? 1 : .96 }} transition={{ duration: navigationCalm ? 0 : megaOpen ? .3 : .22, ease: navigationEase }}><div className="turkiye-mega-inner"><div className="mega-directory"><span className="journey-eyebrow">TÜRKİYE / 12</span><h2>{shellCopy.places[locale]}</h2><div className="mega-featured"><span>{shellCopy.featured[locale]}</span>{['istanbul', 'cappadocia', 'rize-ayder'].map(id => { const place = turkishPlaces.find(place => place.slug === id)!; return <Link key={id} href={href(locale, `destinations/turkiye/${id}`)} data-active={previewId === id} onMouseEnter={() => setPreviewId(id)} onFocus={() => setPreviewId(id)} onClick={() => setMegaOpen(false)}>{place.name[locale]}<ArrowUpRight size={14} /></Link>; })}</div><div className="mega-groups">{groups.map(([group, label]) => <div key={group}><button type="button" onClick={() => setPreviewId(turkishPlaces.find(place => place.group === group)!.slug)}>{label[locale]}</button>{turkishPlaces.filter(place => place.group === group).map(place => <Link key={place.slug} href={href(locale, `destinations/turkiye/${place.slug}`)} data-active={previewId === place.slug} onMouseEnter={() => setPreviewId(place.slug)} onFocus={() => setPreviewId(place.slug)} onClick={() => setMegaOpen(false)}>{place.name[locale]}</Link>)}</div>)}</div><Link className="mega-beyond" href={href(locale, 'destinations')} onClick={() => setMegaOpen(false)}>{turkeyCopy.international[locale]}<ArrowUpRight size={14} /></Link></div><div className="mega-preview"><MegaPhotography place={preview} locale={locale} reduced={navigationCalm} /><div className="mega-preview-copy"><motion.h3 key={preview.slug} initial={{ transform: navigationCalm ? 'translateY(0px)' : 'translateY(7px)' }} animate={{ transform: 'translateY(0px)' }} transition={{ duration: navigationCalm ? 0 : .22, ease: navigationEase }}>{preview.name[locale]}</motion.h3><p>{preview.interests[0][locale]}</p><div className="mega-preview-actions"><Link className="journey-text-link" href={href(locale, `destinations/turkiye/${preview.slug}`)} onClick={() => setMegaOpen(false)}>{ui.more[locale]}<ArrowUpRight size={17} /></Link><AddToJourney id={preview.slug} locale={locale} /></div></div></div></div></motion.div></MotionConfig>
    </div> : <Link key={route} href={href(locale, route)} aria-current={path === href(locale, route) || path.startsWith(href(locale, route) + '/') ? 'page' : undefined}>{label[locale]}</Link>)}</nav><div className="header-tools">{languageLinks}{journey.destinations.length > 0 && <button type="button" className="header-journey" onClick={() => { setMegaOpen(false); journey.openJourney(); }}>{journeyUi.journey[locale]} · {journey.destinations.length}</button>}<PlanJourney locale={locale} className="header-plan" /><button ref={trigger} className="menu-button" type="button" aria-label={ui.menu[locale]} aria-expanded={menuOpen} aria-controls={menuId} onClick={openMenu}><Menu size={24} /></button></div></div>{home && <span className="header-progress" ref={progress} aria-hidden="true" />}</header>
    <main id="main">{children}</main>
    <footer className="footer"><div className="footer-grid"><div className="footer-brand"><Logo locale={locale} /><p>{ui.tagline[locale]}</p><a className="text-link" href={whatsapp(ui.plan[locale])}><WhatsAppIcon /> WhatsApp</a></div><div><h2>{ui.services[locale]}</h2>{services.map(service => <Link key={service.slug} href={href(locale, `services/${service.slug}`)}>{service.title[locale]}</Link>)}</div><div><h2>{turkeyCopy.domestic[locale]}</h2><div className="footer-countries">{turkishPlaces.map(place => <Link key={place.slug} href={href(locale, `destinations/turkiye/${place.slug}`)}>{place.name[locale]}</Link>)}</div><Link href={href(locale, 'destinations')}>{turkeyCopy.international[locale]} ↗</Link></div><div><h2>{ui.company[locale]}</h2>{[['about', ui.about], ['business', ui.business], ['faq', ui.faq], ['contact', ui.contact]].map(([route, label]) => <Link key={route as string} href={href(locale, route as string)}>{typeof label === 'string' ? label : label[locale]}</Link>)}<h2 className="footer-contact-title">{ui.contact[locale]}</h2><a href={`mailto:${email}`}><Mail size={15} /><bdi>{email}</bdi></a><a href={`tel:${phone}`}><Phone size={15} /><bdi>+90 554 107 22 02</bdi></a></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Trip Line. {ui.rights[locale]}</small><div><Link href={href(locale, 'privacy')}>{ui.privacy[locale]}</Link><Link href={href(locale, 'terms')}>{ui.terms[locale]}</Link></div><label className="motion-choice">{ui.motion[locale]}<select value={choice} onChange={event => { try { localStorage.setItem('tripline-motion', event.target.value); } catch {} window.dispatchEvent(new Event('tripline-preference')); }}><option value="system">{ui.system[locale]}</option><option value="reduced">{ui.reduce[locale]}</option></select></label></div></footer>
    <dialog ref={menu} id={menuId} className="nav-dialog recovery-menu" aria-labelledby={`${menuId}-title`} onKeyDown={trapDialogFocus} onCancel={event => { event.preventDefault(); closeMenu(); }} onClose={() => { setMenuOpen(false); trigger.current?.focus(); }} data-native-scroll><div className="dialog-header"><span id={`${menuId}-title`}>Trip Line</span><button type="button" className="icon-button" aria-label={ui.close[locale]} onClick={closeMenu}><X /></button></div><nav aria-label={ui.nav[locale]}>{mobileNav.map(([route, label], index) => route === 'plan' ? <span className="mobile-menu-plan-row" style={{ animationDelay: `${Math.min(index, 4) * 40}ms`, animationDuration: `${300 - Math.min(index, 4) * 40}ms` }} key={route} onClick={closeMenu}><PlanJourney locale={locale} className="mobile-menu-plan"><span className="index">{String(index + 1).padStart(2, '0')}</span>{label[locale]}</PlanJourney></span> : <Link key={route} style={{ animationDelay: `${Math.min(index, 4) * 40}ms`, animationDuration: `${300 - Math.min(index, 4) * 40}ms` }} href={href(locale, route)} onClick={closeMenu}><span className="index">{String(index + 1).padStart(2, '0')}</span>{label[locale]}<ArrowUpRight size={22} /></Link>)}</nav><div className="dialog-footer">{journey.destinations.length > 0 && <button type="button" className="journey-action journey-action-outline" onClick={() => { closeMenu(); journey.openJourney(); }}>{journeyUi.view[locale]} · {journey.destinations.length}</button>}{languageLinks}<a href={`mailto:${email}`}>{email}</a></div></dialog>
    <JourneyDrawer locale={locale} />
    <div ref={sticky} className="mobile-plan"><div>{journey.destinations.length > 0 ? <button type="button" className="journey-action journey-action-primary" onClick={journey.openJourney}>{journeyUi.view[locale]} · {journey.destinations.length}<ArrowUpRight size={18} /></button> : <PlanJourney locale={locale} />}</div></div>
  </div></MotionConfig></Context.Provider>;
}
