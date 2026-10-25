'use client';
import type { CSSProperties } from 'react';
import { t, type Locale } from '@/lib/i18n';
import { turkishPlaces } from '@/lib/turkiye';
import boundary from '@/lib/turkey-map.json';
import '@/styles/recovery-turkiye.css';
// Geographic anchors use the source map's Natural Earth projection.
const anchor = (id: string) => { const place = turkishPlaces.find(item => item.slug === id)!; return [(place.lon - 25) * 40, (43 - place.lat) * 52]; };
const controls: Record<string, [number, number]> = { istanbul: [55, -20], sapanca: [285, 0], bursa: [170, 240], yalova: [40, 145], trabzon: [525, -20], 'rize-ayder': [755, 10], uzungol: [645, 185], bodrum: [75, 315], marmaris: [190, 425], fethiye: [330, 365], antalya: [485, 300], cappadocia: [395, 120] };
export function TurkeyMap({ locale, active, onSelect, selectedIds = [], locator = false, previous, stage = false }: { locale: Locale; active?: string; onSelect?: (id: string) => void; selectedIds?: string[]; locator?: boolean; previous?: string; stage?: boolean }) {
  const points = selectedIds.filter(id => turkishPlaces.some(place => place.slug === id)).map(anchor);
  const route = points.map(([x, y], index) => index ? `Q ${(points[index - 1][0] + x) / 2} ${Math.min(points[index - 1][1], y) - 35} ${x} ${y}` : `M ${x} ${y}`).join(' ');
  const start = anchor(previous || 'istanbul');
  const end = anchor(active || 'istanbul');
  const activeRoute = `M ${start[0]} ${start[1]} Q ${(start[0] + end[0]) / 2} ${Math.min(start[1], end[1]) - 80} ${end[0]} ${end[1]}`;
  const place=turkishPlaces.find(item=>item.slug===active)||turkishPlaces[0];
  const camera={
    '--map-camera-x':`${Math.max(stage?-18:-6,Math.min(stage?18:6,(35-place.lon)*(stage?1.6:.65)))}px`,
    '--map-camera-y':`${Math.max(stage?-8:-3,Math.min(stage?8:3,(place.lat-39.5)*(stage?1.5:.8)))}px`,
    '--map-camera-scale':active==='istanbul'?1:stage?1.045:1.02,
  } as CSSProperties;
  return <div className={`rt-map ${locator ? 'rt-map-locator' : ''} ${stage?'rt-map-stage':''}`} style={camera} dir="ltr"><div className="rt-map-canvas"><svg viewBox={stage?"0 0 825 430":"0 -80 825 550"} aria-hidden="true"><g className="rt-boundary">{boundary.map((path, index) => <path key={index} d={path}/>)}</g>{active && (stage?active!==previous:active!=='istanbul') && <path key={`${previous}-${active}`} className="v6-active-route" pathLength="1" d={activeRoute}/>} {points.length > 1 && <path className="rt-itinerary" d={route}/>} {turkishPlaces.map(place => { const [x, y] = anchor(place.slug); const [cx, cy] = controls[place.slug]; return <g key={place.slug}><line className="rt-leader" x1={x} y1={y} x2={cx} y2={cy}/><circle className="rt-anchor" cx={x} cy={y} r={active === place.slug ? 5 : 3}/></g>; })}</svg>
    {turkishPlaces.map((place, index) => { const [x, y] = stage ? anchor(place.slug) : controls[place.slug]; return <button type="button" className="rt-map-pin" key={place.slug} style={{ left: `${x / 825 * 100}%`, top: `${(stage ? y / 430 : (y + 80) / 550) * 100}%` }} aria-label={place.name[locale]} aria-pressed={active === place.slug} data-in-journey={selectedIds.includes(place.slug)} onClick={() => onSelect?.(place.slug)} disabled={!onSelect}><span aria-hidden={stage || undefined}>{stage?'':String(index + 1).padStart(2, '0')}</span></button>; })}
  </div><p className="rt-map-caption">{t('Türkiye · geographic overview', 'تركيا · نظرة جغرافية', 'Türkiye · coğrafi görünüm')[locale]}</p>{points.length > 1 && <p className="rt-map-caption">{t('Your journey line is conceptual, not travel directions.', 'مسار رحلتك تصوّر مبدئي، وليس إرشادات تنقل.', 'Yolculuk çizgin taslak bir rotadır, yol tarifi değildir.')[locale]}</p>}</div>;
}
