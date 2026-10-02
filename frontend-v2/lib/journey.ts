import { t, type Locale } from './i18n';
import { turkishPlaces } from './turkiye';

export const journeyCopy = {
  follow: t('Follow the line','اتبع المسار','Rotayı takip et'),
  scroll: t('Scroll to explore','مرّر للاكتشاف','Keşfetmek için kaydır'),
  departure: t('A journey before the journey.','رحلة قبل الرحلة.','Yolculuktan önce bir yolculuk.'),
  signature: t('Some places stay with you.','أماكن تبقى معك.','Bazı yerler seninle kalır.'),
  film: t('A moment on the Bosphorus.','لحظة على البوسفور.','Boğaz’da bir an.'),
  services: t('Every step. Thoughtfully connected.','كل خطوة، بعناية وترابط.','Her adım. Özenle birbirine bağlı.'),
  builder: t('Make the line your own.','اجعل المسار لك.','Rotanı kendin çiz.'),
  builderBody: t('Choose places in the order you would like to visit. We’ll discuss the route and arrangements together.','اختر الأماكن بالترتيب الذي ترغب في زيارتها به. سنناقش المسار والترتيبات معاً.','Yerleri ziyaret etmek istediğin sırayla seç. Rotayı ve düzenlemeleri birlikte konuşalım.'),
  selected: t('Your journey','رحلتك','Yolculuğun'),
  empty: t('Your first stop starts here.','هنا تبدأ محطتك الأولى.','İlk durağın burada başlıyor.'),
  plan: t('Plan this journey','خطط لهذه الرحلة','Bu yolculuğu planla'),
  remove: t('Remove','احذف','Kaldır'),
  earlier: t('Move earlier','قدّم المحطة','Öne taşı'),
  later: t('Move later','أخّر المحطة','Sona taşı'),
  arrival: t('Where next?','إلى أين بعد؟','Sırada neresi var?'),
  route: t('Places I would like to visit','الأماكن التي أرغب في زيارتها','Ziyaret etmek istediğim yerler'),
  previous: t('Previous place','الوجهة السابقة','Önceki yer'),
  next: t('Next place','الوجهة التالية','Sonraki yer'),
};

/** Only source destination IDs cross the public URL boundary. Order is intentional. */
export function parseJourney(value = '') {
  return [...new Set(value.slice(0,300).split(','))].filter(id => turkishPlaces.some(p => p.slug === id)).slice(0,12);
}
export function journeyMessage(ids: string[], locale: Locale) {
  return ids.length ? `${journeyCopy.route[locale]}: ${ids.map(id => turkishPlaces.find(p => p.slug === id)?.name[locale]).filter(Boolean).join(' → ')}` : '';
}
