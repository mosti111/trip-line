'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, X, ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { journeyCopy as copy } from '@/lib/journey';
import { turkishPlaces } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { useJourney } from '../experience/JourneyStore';
import { Photo } from '../travel/Sections';
import '@/styles/recovery-home.css';

export function JourneyBuilder({ locale, initial = [] }: { locale: Locale; initial?: string[] }) {
  const { destinations: selected, journeyType: service, addDestination, removeDestination, moveDestination, setJourneyType } = useJourney();
  const [dates, setDates] = useState('');
  const [flexible, setFlexible] = useState(true);
  const [travelers, setTravelers] = useState('');
  const host = useRef<HTMLElement>(null);
  const seeded = useRef(false);
  const pendingFocus = useRef<{ id: string; offset: number } | null>(null);
  useEffect(() => { if (seeded.current) return; seeded.current = true; initial.forEach(addDestination); }, [initial, addDestination]);
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const row = host.current?.querySelector(`[data-stop="${target.id}"]`);
    const preferred = row?.querySelector<HTMLButtonElement>(`[data-move="${target.offset}"]:not(:disabled)`);
    (preferred || row?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
  }, [selected]);
  function move(id: string, offset: number) { pendingFocus.current = { id, offset }; moveDestination(id, offset); }
  function remove(id: string) { removeDestination(id); host.current?.querySelector<HTMLInputElement>(`input[value="${id}"]`)?.focus(); }
  const labels = [t('Where', 'أين', 'Nereye'), t('Journey type', 'نوع الرحلة', 'Yolculuk türü'), t('When', 'متى', 'Ne zaman'), t('Who', 'من يرافقك', 'Kimlerle')];
  const flexibleLabel = t('My dates are flexible', 'مواعيدي مرنة', 'Tarihlerim esnek')[locale];
  return <section ref={host} className="rh-builder" id="journey-builder" data-chapter="12" aria-labelledby="builder-title"><div className="rh-wrap">
    <div className="rh-section-heading"><span className="rh-kicker">12 / {t('Build your line', 'ارسم مسارك', 'Rotanı oluştur')[locale]}</span><h2 id="builder-title">{copy.builder[locale]}</h2><p>{copy.builderBody[locale]}</p></div>
    <form action={href(locale, 'contact')} method="get" className="rh-builder-layout">
      <div className="rh-builder-inputs">
        <fieldset className="rh-builder-places"><legend><span>01</span>{labels[0][locale]}</legend><div>{turkishPlaces.map(place => <label key={place.slug}><input type="checkbox" value={place.slug} checked={selected.includes(place.slug)} onChange={event => event.currentTarget.checked ? addDestination(place.slug) : removeDestination(place.slug)} /><span>{place.name[locale]}</span></label>)}</div></fieldset>
        <fieldset className="rh-builder-type"><legend><span>02</span>{labels[1][locale]}</legend><label className="sr-only" htmlFor="builder-service">{labels[1][locale]}</label><select id="builder-service" name="service" value={service} onChange={event => setJourneyType(event.target.value)}>{services.map(item => <option key={item.slug} value={item.slug}>{item.title[locale]}</option>)}</select></fieldset>
        <div className="rh-builder-time-who"><fieldset><legend><span>03</span>{labels[2][locale]}</legend><label className="rh-flexible"><input type="checkbox" checked={flexible} onChange={event => { setFlexible(event.target.checked); if (event.target.checked) setDates(''); }}/>{flexibleLabel}</label><label htmlFor="builder-dates">{ui.dates[locale]} ({ui.optional[locale]})</label><input id="builder-dates" maxLength={150} value={dates} placeholder={flexible ? flexibleLabel : undefined} onChange={event => { setDates(event.target.value); if (event.target.value) setFlexible(false); }}/></fieldset><fieldset><legend><span>04</span>{labels[3][locale]}</legend><label htmlFor="builder-travelers">{ui.travelers[locale]} ({ui.optional[locale]})</label><input id="builder-travelers" name="travelers" type="number" min="1" max="999" value={travelers} onChange={event => setTravelers(event.target.value)}/></fieldset></div>
      </div>
      <div className="rh-builder-route"><div className="rh-builder-preview" aria-hidden="true"><Photo file={selected.length ? turkishPlaces.find(place => place.slug === selected[selected.length - 1])!.image : 'turkiye.jpg'}/><span>{String(selected.length).padStart(2, '0')}</span></div><h3>{copy.selected[locale]}</h3>
        <p className="sr-only" role="status">{copy.selected[locale]}: {selected.length ? selected.map(id => turkishPlaces.find(place => place.slug === id)!.name[locale]).join(' → ') : copy.empty[locale]}</p>
        {selected.length ? <ol>{selected.map((id, index) => { const name = turkishPlaces.find(place => place.slug === id)!.name[locale]; return <li key={id} data-stop={id}><span className="rh-stop-number">{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><div><button type="button" data-move="-1" disabled={index === 0} aria-label={`${copy.earlier[locale]}: ${name}`} onClick={() => move(id, -1)}><ArrowUp size={16}/></button><button type="button" data-move="1" disabled={index === selected.length - 1} aria-label={`${copy.later[locale]}: ${name}`} onClick={() => move(id, 1)}><ArrowDown size={16}/></button><button type="button" aria-label={`${copy.remove[locale]}: ${name}`} onClick={() => remove(id)}><X size={16}/></button></div></li>; })}</ol> : <p className="rh-builder-empty">{copy.empty[locale]}</p>}
        <input type="hidden" name="dates" value={flexible ? flexibleLabel : dates}/><input type="hidden" name="journey" value={selected.join(',')}/><input type="hidden" name="destination" value={selected[0] || ''}/>
        <div className="rh-builder-summary" aria-live="polite"><span>{services.find(item => item.slug === service)!.title[locale]}</span><span>{dates || (flexible ? flexibleLabel : ui.dates[locale])}</span>{travelers && <span>{ui.travelers[locale]}: {travelers}</span>}</div>
        <button className="journey-action journey-action-primary" type="submit">{copy.plan[locale]}<ArrowUpRight size={18}/></button><p className="rh-source">{ui.formBody[locale]}</p>
      </div>
    </form>
  </div></section>;
}
