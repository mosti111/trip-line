import { t, type Locale } from './i18n';
import { turkishPlaces } from './turkiye';
import { services } from './travel-content';
import { href } from './i18n';

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

export const journeyStorageKey = 'tripline-journey';
export type JourneyState = { destinations: string[]; journeyType: string };
export const emptyJourney: JourneyState = { destinations: [], journeyType: 'tours' };
export function validJourneyType(value: unknown) {
  return typeof value === 'string' && services.some(service => service.slug === value) ? value : 'tours';
}
/** Storage is an untrusted boundary. Only the non-sensitive allowlisted fields survive. */
export function validateJourney(value: unknown): JourneyState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...emptyJourney };
  const candidate = value as Record<string, unknown>;
  return {
    destinations: Array.isArray(candidate.destinations)
      ? parseJourney(candidate.destinations.filter((id): id is string => typeof id === 'string' && turkishPlaces.some(place => place.slug === id)).join(',')) : [],
    journeyType: validJourneyType(candidate.journeyType),
  };
}
export function readJourney(value: string | null): JourneyState {
  try { return validateJourney(value ? JSON.parse(value) : null); } catch { return { ...emptyJourney }; }
}
export function moveJourneyDestination(ids: string[], id: string, offset: number) {
  const next = parseJourney(ids.join(','));
  const index = next.indexOf(id), target = index + offset;
  if (!Number.isInteger(offset) || index < 0 || target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export function journeyHref(locale: Locale, ids: string[] = [], journeyType: string = 'tours') {
  const destinations = parseJourney(ids.join(','));
  const query = new URLSearchParams({ service: validJourneyType(journeyType) });
  if (destinations.length) {
    query.set('journey', destinations.join(','));
    query.set('destination', destinations[0]);
  }
  return `${href(locale, 'contact')}?${query}`;
}

export const journeyUi = {
  add: t('Add to journey', 'أضف إلى الرحلة', 'Yolculuğa ekle'),
  plan: t('Plan my journey', 'خطط لرحلتي', 'Yolculuğumu planla'),
  continue: t('Continue planning', 'تابع التخطيط', 'Planlamaya devam et'),
  view: t('View journey', 'اعرض الرحلة', 'Yolculuğu görüntüle'),
  journey: t('Journey', 'الرحلة', 'Yolculuk'),
  close: t('Close journey', 'أغلق الرحلة', 'Yolculuğu kapat'),
  emptyBody: t('Explore Türkiye and add the places that speak to you. Your choices stay with you during this browser session.', 'اكتشف تركيا وأضف الوجهات التي تلهمك. تبقى اختياراتك معك خلال جلسة التصفح هذه.', 'Türkiye’yi keşfet ve sana hitap eden yerleri ekle. Seçimlerin bu tarayıcı oturumu boyunca seninle kalır.'),
  session: t('A starting point for our conversation. No arrangements have been confirmed.', 'نقطة بداية لحوارنا. لم تُؤكد أي ترتيبات بعد.', 'Görüşmemiz için bir başlangıç. Henüz hiçbir düzenleme onaylanmadı.'),
};
