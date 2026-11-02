'use client';
import {useJourney} from '../experience/JourneyStore';
import {turkishPlaces} from '@/lib/turkiye';
import {t,type Locale} from '@/lib/i18n';
export function JourneyEcho({locale}:{locale:Locale}){
 const {destinations}=useJourney();
 if(!destinations.length)return <p className="v61-journey-echo">{t('A place to begin. A journey to make your own.','مكان تبدأ منه. ورحلة ترسمها بطريقتك.','Başlayacağın bir yer. Kendine göre bir yolculuk.')[locale]}</p>;
 const names=destinations.map(id=>turkishPlaces.find(place=>place.slug===id)!.name[locale]);
 return <div className="v61-journey-echo" aria-label={names.join(' / ')}><span>{t('Your line','مسارك','Rotan')[locale]} / <bdi>{destinations.length}</bdi></span><p>{names.slice(0,3).join(' / ')}{names.length>3&&<bdi> +{names.length-3}</bdi>}</p></div>;
}
