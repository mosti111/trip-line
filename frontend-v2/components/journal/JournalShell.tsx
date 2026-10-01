"use client";

import { createContext, useContext, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, ArrowRight, BookOpen, Check, Minus, Plus, X } from 'lucide-react';
import { BrandLogo } from '@/components/public/BrandLogo';
import { places } from '@/lib/journal-data';

const key = 'tripline-v2-journal';
function subscribeMotion(fn: () => void) { const media=window.matchMedia('(prefers-reduced-motion: reduce)'); media.addEventListener('change',fn); return () => media.removeEventListener('change',fn); }
function motionSnapshot() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
let memory = '[]';
function snapshot() { try { return localStorage.getItem(key) ?? memory; } catch { return memory; } }
function subscribe(fn: () => void) { window.addEventListener('storage', fn); window.addEventListener('tripline-journal', fn); return () => { window.removeEventListener('storage', fn); window.removeEventListener('tripline-journal', fn); }; }
function write(ids: string[]) { memory = JSON.stringify(ids); try { localStorage.setItem(key, memory); } catch {} window.dispatchEvent(new Event('tripline-journal')); }
const JournalContext = createContext({ saved: [] as string[], toggle: (_id: string) => { void _id; }, open: () => {}, calm: false });
export function useJournal() { return useContext(JournalContext); }
export function SaveButton({ id }: { id: string }) {
  const { saved, toggle } = useJournal(); const active = saved.includes(id);
  return <button className={`save-button ${active ? 'is-saved' : ''}`} aria-pressed={active} onClick={() => toggle(id)}>{active ? <Check size={15}/> : <Plus size={15}/>} {active ? 'Saved to journal' : 'Save to journal'}</button>;
}
const links = [{ name: 'Home', href: '/', image: places[2].image }, { name: 'Our story', href: '/about', image: places[0].image }, { name: 'Journeys', href: '/journeys', image: places[1].image }, { name: 'Services', href: '/services', image: '/images/transfers-placeholder.png' }, { name: 'Contact', href: '/contact', image: places[2].image }];

export function JournalShell({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const saved = useMemo<string[]>(() => { try { const value: unknown = JSON.parse(raw); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && places.some(p => p.id === id)))] : []; } catch { return []; } }, [raw]);
  const journal = useRef<HTMLDialogElement>(null); const menu = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState(0); const [motionPreference, setMotionPreference] = useState<'system'|'full'|'reduced'>('system'); const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
  const calm = motionPreference === 'reduced' || (motionPreference === 'system' && reduced);
  const [notice, setNotice] = useState(''); const pathname = usePathname();
  function toggle(id: string) { const removing = saved.includes(id); write(removing ? saved.filter(i => i !== id) : [...saved, id]); setNotice(`${places.find(p => p.id === id)?.name ?? 'Place'} ${removing ? 'removed from' : 'saved to'} your journal.`); }
  return <JournalContext.Provider value={{ saved, toggle, open: () => journal.current?.showModal(), calm }}><MotionConfig reducedMotion={calm ? 'always' : motionPreference === 'full' ? 'never' : 'user'}><div className={`journal-site ${calm ? 'calm-motion' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><BrandLogo/><nav aria-label="Main navigation">{links.slice(1,4).map(l => <Link key={l.href} className={pathname.startsWith(l.href) ? 'active' : ''} href={l.href}>{l.name}</Link>)}</nav><div className="header-actions"><button className="journal-trigger" onClick={() => journal.current?.showModal()} aria-label={`Open journal, ${saved.length} saved places`}><BookOpen size={17}/><span>Journal</span><b>{saved.length.toString().padStart(2,'0')}</b></button><Link href="/contact" className="header-cta">Let’s plan <ArrowUpRight size={16}/></Link><button className="menu-trigger" onClick={() => menu.current?.showModal()} aria-label="Open menu"><span/><span/></button></div></header>
    <main id="main">{children}</main>
    <footer className="site-footer"><div className="footer-top"><span className="eyebrow">THE NEXT CHAPTER IS YOURS</span><span className="handwritten">See you somewhere.</span></div><Link href="/contact" className="footer-invitation">Let’s make<br/><em>a little history.</em><ArrowUpRight/></Link><div className="footer-bottom"><BrandLogo/><p>People. Places. Possibilities.</p><div><Link href="/about">Our story</Link><Link href="/contact">Contact</Link><label className="motion-setting">Motion<select aria-label="Animation preference" value={motionPreference} onChange={e => setMotionPreference(e.target.value as 'system'|'full'|'reduced')}><option value="system">System</option><option value="full">Full</option><option value="reduced">Reduced</option></select></label></div><small>© {new Date().getFullYear()} Trip Line</small></div><div className="demo-note">VERSION 02 · DESIGN DEMO · SAMPLE COPY & AI-GENERATED IMAGERY</div></footer>
    <div className="sr-only" role="status" aria-live="polite">{notice}</div>
    <dialog ref={menu} className="menu-dialog" aria-labelledby="menu-title"><div className="dialog-top"><span id="menu-title" className="eyebrow">YOUR NEXT CHAPTER</span><button aria-label="Close menu" className="icon-button" onClick={() => menu.current?.close()}><X/></button></div><div className="menu-content"><nav aria-label="Expanded navigation">{links.map((l,i) => <Link key={l.href} href={l.href} onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)} onClick={() => menu.current?.close()}><small>0{i+1}</small>{l.name}<ArrowUpRight/></Link>)}</nav><div className="menu-photo"><Image src={links[preview].image} fill sizes="45vw" alt="Illustrative travel destination"/><span className="handwritten">A world worth exploring.</span></div></div></dialog>
    <dialog ref={journal} className="journal-dialog" aria-labelledby="journal-title"><div className="dialog-top"><span className="eyebrow">A LITTLE COLLECTION OF POSSIBILITIES</span><button aria-label="Close journal" className="icon-button" onClick={() => journal.current?.close()}><X/></button></div><h2 id="journal-title">Your <em>journal.</em></h2><p>Places that caught your eye. A starting point for a conversation.</p><div className="journal-items">{saved.length ? saved.map(id => { const p = places.find(p => p.id === id)!; return <article key={id}><Image src={p.image} width={100} height={110} alt={`Illustrative ${p.name}`}/><div><small>{p.theme}</small><h3>{p.name}</h3><Link href={`/journeys/${id}`} onClick={() => journal.current?.close()}>Explore <ArrowUpRight size={13}/></Link></div><button className="icon-button" aria-label={`Remove ${p.name}`} onClick={() => toggle(id)}><Minus size={18}/></button></article>; }) : <div className="journal-empty"><BookOpen size={42} strokeWidth={1}/><h3>The best pages are still blank.</h3><p>Save a place while you explore. You’ll find it here.</p><Link href="/journeys" className="button" onClick={() => journal.current?.close()}>Find your inspiration <ArrowRight size={17}/></Link></div>}</div>{saved.length > 0 && <><Link className="button full-button" href="/contact" onClick={() => journal.current?.close()}>Plan around these <ArrowUpRight size={17}/></Link><button className="text-button clear-journal" onClick={() => { write([]); setNotice('Journal cleared.'); }}>Clear journal</button></>}<small className="journal-note">Saved on this browser only. These are interests, not bookings.</small></dialog>
  </div></MotionConfig></JournalContext.Provider>;
}

