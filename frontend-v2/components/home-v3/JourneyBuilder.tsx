'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, X, ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { journeyCopy as copy } from '@/lib/journey';
import { turkishPlaces } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { Photo } from '../travel/Sections';

export function JourneyBuilder({ locale, initial = [] }: { locale: Locale; initial?: string[] }) {
  const [selected, setSelected] = useState(initial);
  const [service,setService]=useState('tours');
  const [dates,setDates]=useState('');
  const [travelers,setTravelers]=useState('');
  const host = useRef<HTMLElement>(null);
  const pendingFocus = useRef<{id:string;offset:number}|null>(null);
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const row = host.current?.querySelector(`[data-stop="${target.id}"]`);
    const preferred = row?.querySelector<HTMLButtonElement>(`[data-move="${target.offset}"]:not(:disabled)`);
    (preferred || row?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
  }, [selected]);
  function move(index: number, offset: number) {
    pendingFocus.current = {id:selected[index],offset};
    setSelected(current => { const next = [...current]; [next[index], next[index + offset]] = [next[index + offset], next[index]]; return next; });
  }
  function remove(id:string) {
    host.current?.querySelector<HTMLInputElement>(`input[value="${id}"]`)?.focus();
    setSelected(current=>current.filter(place=>place!==id));
  }
  return <section ref={host} className="journey-builder sand" id="journey-builder"><div className="wrap">
    <div className="section-head"><h2>{copy.builder[locale]}</h2><p>{copy.builderBody[locale]}</p></div>
    <ol className="planner-progress" aria-label={copy.selected[locale]}>{[ui.destination,ui.service,ui.dates,copy.selected].map((label,i)=><li key={i} data-complete={i===0?selected.length>0:i===1?selected.length>0&&!!service:i===2?!!dates||!!travelers:selected.length>0}><span aria-hidden="true">0{i+1}</span>{label[locale]}</li>)}</ol>
    <form action={href(locale, 'contact')} method="get" className="builder-layout">
      <div className="builder-inputs">
      <fieldset className="builder-places"><legend>{ui.destination[locale]}</legend>{turkishPlaces.map(place =>
        <label key={place.slug}><input type="checkbox" value={place.slug} checked={selected.includes(place.slug)} onChange={e => setSelected(current => e.target.checked ? [...current, place.slug] : current.filter(id => id !== place.slug))} />
          <span>{place.name[locale]}</span><span aria-hidden="true">{selected.includes(place.slug) ? '−' : '+'}</span></label>)}</fieldset>        <div className="builder-fields"><label>{ui.service[locale]}<select name="service" value={service} onChange={e=>setService(e.target.value)}>{services.map(s=><option key={s.slug} value={s.slug}>{s.title[locale]}</option>)}</select></label>
          <label>{ui.dates[locale]} ({ui.optional[locale]})<input name="dates" maxLength={150} value={dates} onChange={e=>setDates(e.target.value)}/></label>
          <label>{ui.travelers[locale]} ({ui.optional[locale]})<input name="travelers" type="number" min="1" max="999" value={travelers} onChange={e=>setTravelers(e.target.value)}/></label></div>
</div>
      <div className="builder-route"><div className="builder-preview" aria-hidden="true"><Photo file={selected.length?turkishPlaces.find(p=>p.slug===selected[selected.length-1])!.image:'turkiye.jpg'}/><span>{String(selected.length).padStart(2,'0')}</span></div><h3>{copy.selected[locale]}</h3>
        <p className="sr-only" role="status">{copy.selected[locale]}: {selected.length ? selected.map(id=>turkishPlaces.find(p=>p.slug===id)!.name[locale]).join(' → ') : copy.empty[locale]}</p>
        {selected.length ? <ol>{selected.map((id, index) => <li key={id} data-stop={id}><span className="route-stop">{String(index + 1).padStart(2,'0')}</span><strong>{turkishPlaces.find(p => p.slug === id)!.name[locale]}</strong><div>
          <button type="button" data-move="-1" disabled={index === 0} aria-label={`${copy.earlier[locale]}: ${turkishPlaces.find(p=>p.slug===id)!.name[locale]}`} onClick={()=>move(index,-1)}><ArrowUp size={16}/></button>
          <button type="button" data-move="1" disabled={index === selected.length-1} aria-label={`${copy.later[locale]}: ${turkishPlaces.find(p=>p.slug===id)!.name[locale]}`} onClick={()=>move(index,1)}><ArrowDown size={16}/></button>
          <button type="button" aria-label={`${copy.remove[locale]}: ${turkishPlaces.find(p=>p.slug===id)!.name[locale]}`} onClick={()=>remove(id)}><X size={16}/></button>
        </div></li>)}</ol> : <p className="builder-empty">{copy.empty[locale]}</p>}
        <input type="hidden" name="journey" value={selected.join(',')}/><input type="hidden" name="destination" value={selected[0] || ''}/>
        <div className="builder-summary"><span>{services.find(s=>s.slug===service)!.title[locale]}</span>{dates&&<span>{dates}</span>}{travelers&&<span>{ui.travelers[locale]}: {travelers}</span>}</div>
        <button className="button dark-button" type="submit">{copy.plan[locale]}<ArrowUpRight size={18}/></button><p className="source-note">{ui.formBody[locale]}</p>
      </div>
    </form>
  </div></section>;
}
