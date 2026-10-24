import Link from 'next/link';
import { href, type Locale } from '@/lib/i18n';
import { turkishPlaces } from '@/lib/turkiye';
import { Photo } from '../travel/Sections';
export function MemoryStack({ locale }: { locale: Locale }) {
  return <div className="v6-memories">{['bursa','istanbul','rize-ayder'].map((id,index) => {
    const place=turkishPlaces.find(item=>item.slug===id)!;
    return <figure className={`v6-memory v6-memory-${index}`} key={id}><Link className="v6-memory-surface" href={href(locale,`destinations/turkiye/${id}`)}><Photo file={id==='istanbul'?'istanbul-v5.jpg':place.image} alt={place.name[locale]}/><span><bdi>0{index+1} / </bdi>{place.name[locale]}</span></Link></figure>;
  })}</div>;
}
