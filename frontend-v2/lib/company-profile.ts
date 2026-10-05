import { t, type Text } from './i18n';

export type CompanyProfile = {
  sourceLabel: Text;
  established: Text;
  licensed: Text;
  accreditation: Text;
  mission: Text;
  vision: Text;
  partnersSource: Text;
};

// Client-supplied profile statements; these are not current independent checks.
export const companyProfile: CompanyProfile = {
  sourceLabel: t('Company Profile 2025', 'ملف الشركة لعام ٢٠٢٥', '2025 Şirket Profili'),
  established: t('Established in 2019.', 'تأسست عام ٢٠١٩.', '2019 yılında kuruldu.'),
  licensed: t(
    'Licensed Turkish tourism company, according to Company Profile 2025.',
    'شركة سياحة تركية مرخصة، وفقاً لملف الشركة لعام ٢٠٢٥.',
    '2025 Şirket Profili’ne göre lisanslı bir Türk turizm şirketi.',
  ),
  accreditation: t(
    'TÜRSAB accreditation, according to Company Profile 2025.',
    'اعتماد TÜRSAB، وفقاً لملف الشركة لعام ٢٠٢٥.',
    '2025 Şirket Profili’ne göre TÜRSAB akreditasyonu.',
  ),
  mission: t(
    'We aim to be a trusted travel companion through reliable, high-quality travel services.',
    'نسعى إلى أن نكون رفيق سفر موثوقاً من خلال خدمات سفر عالية الجودة يمكن الاعتماد عليها.',
    'Güvenilir ve kaliteli seyahat hizmetleriyle güven duyulan bir yol arkadaşı olmayı amaçlıyoruz.',
  ),
  vision: t(
    'We aim to offer innovative, comprehensive travel solutions and meaningful experiences for individuals and businesses.',
    'نسعى إلى تقديم حلول سفر مبتكرة وشاملة وتجارب ذات معنى للأفراد والشركات.',
    'Bireylere ve işletmelere yenilikçi, kapsamlı seyahat çözümleri ve anlamlı deneyimler sunmayı amaçlıyoruz.',
  ),
  partnersSource: t(
    'Organizations featured in Company Profile 2025.',
    'جهات واردة في ملف الشركة لعام ٢٠٢٥.',
    '2025 Şirket Profili’nde yer alan kuruluşlar.',
  ),
};

export type ProfileDifferentiator = { id: string; title: Text; body: Text };

export const profileDifferentiators: ProfileDifferentiator[] = [
  {
    id: 'experience-reliability',
    title: t('Experience & Reliability', 'الخبرة والموثوقية', 'Deneyim ve güvenilirlik'),
    body: t(
      'An approach to reliable service built on tourism experience, legal certifications and strategic partnerships.',
      'نهج لخدمة موثوقة يقوم على الخبرة السياحية والشهادات القانونية والشراكات الاستراتيجية.',
      'Turizm deneyimi, yasal belgeler ve stratejik ortaklıklar üzerine kurulu güvenilir bir hizmet anlayışı.',
    ),
  },
  {
    id: 'comprehensive-services',
    title: t('Comprehensive Services', 'خدمات شاملة', 'Kapsamlı hizmetler'),
    body: t(
      'Domestic and international tours, Hajj and Umrah, and services for business travelers.',
      'جولات محلية ودولية، وحج وعمرة، وخدمات للمسافرين للأعمال.',
      'Yurt içi ve yurt dışı turlar, hac ve umre, iş seyahatine yönelik hizmetler.',
    ),
  },
  {
    id: 'customized-experiences',
    title: t('Customized Experiences', 'تجارب مصممة حسب الطلب', 'Kişiye özel deneyimler'),
    body: t(
      'Travel shaped around each person’s interests, aspirations and expectations.',
      'رحلات تتشكل حول اهتمامات كل شخص وتطلعاته وتوقعاته.',
      'Her kişinin ilgi alanlarına, isteklerine ve beklentilerine göre şekillenen seyahatler.',
    ),
  },
  {
    id: 'professional-team',
    title: t('Professional Team', 'فريق محترف', 'Profesyonel ekip'),
    body: t(
      'A dedicated specialist team focused on professional care throughout the journey.',
      'فريق من المتخصصين يهتم بالعناية المهنية طوال الرحلة.',
      'Yolculuk boyunca profesyonel özene odaklanan uzman ve özverili bir ekip.',
    ),
  },
  {
    id: 'strategic-partnerships',
    title: t('Strategic Partnerships', 'شراكات استراتيجية', 'Stratejik ortaklıklar'),
    body: t(
      'Connections with booking systems and hotels across the Middle East.',
      'علاقات مع أنظمة الحجز والفنادق في أنحاء الشرق الأوسط.',
      'Orta Doğu genelindeki rezervasyon sistemleri ve otellerle ilişkiler.',
    ),
  },
  {
    id: 'attention-to-detail',
    title: t('Attention to Detail', 'الاهتمام بالتفاصيل', 'Ayrıntılara özen'),
    body: t(
      'Care for the details, from travel arrangements through the return journey, with support for questions and requests.',
      'عناية بالتفاصيل، من ترتيبات السفر حتى العودة، مع دعم للاستفسارات والطلبات.',
      'Seyahat düzenlemelerinden dönüşe kadar ayrıntılara özen, sorular ve talepler için destek.',
    ),
  },
  {
    id: 'quality-standards',
    title: t('Quality Standards', 'معايير الجودة', 'Kalite standartları'),
    body: t(
      'Service quality and attention to client expectations guide each stage.',
      'جودة الخدمة والاهتمام بتوقعات العملاء يوجهان كل مرحلة.',
      'Hizmet kalitesi ve müşteri beklentilerine verilen önem, her aşamaya yön verir.',
    ),
  },
];

export type ProfileFigure = {
  id: string;
  value: number;
  suffix: string;
  label: Text;
  requiresClarification?: boolean;
};

// Every rendered figure must accompany companyProfile.sourceLabel.
// Consumers can omit figures requiring clarification pending client confirmation.
export const profileFigures: ProfileFigure[] = [
  { id: 'pilgrims', value: 5000, suffix: '+', label: t('Pilgrims & Umrah travelers', 'حجاج ومعتمرون', 'Hac ve umre yolcusu') },
  { id: 'partnerships', value: 2000, suffix: '+', label: t('Strategic partnerships', 'شراكات استراتيجية', 'Stratejik ortaklık') },
  { id: 'tours', value: 15000, suffix: '+', label: t('Tours', 'جولات', 'Tur') },
  { id: 'clients', value: 25000, suffix: '+', label: t('Satisfied clients', 'عملاء راضون', 'Memnun müşteri') },
  {
    id: 'experience', value: 12, suffix: '+', requiresClarification: true,
    label: t(
      'Years of experience (profile figure; not company age)',
      'سنوات الخبرة (رقم من ملف الشركة؛ لا يعبر عن عمر الشركة)',
      'Deneyim yılı (profildeki rakam; şirketin yaşı değildir)',
    ),
  },
  { id: 'entertainment', value: 10000, suffix: '+', label: t('Entertainment programs', 'برامج ترفيهية', 'Eğlence programı') },
  { id: 'visas', value: 18000, suffix: '+', label: t('Visa applications', 'طلبات تأشيرة', 'Vize başvurusu') },
  { id: 'hotels', value: 10000, suffix: '+', label: t('Hotel bookings', 'حجوزات فندقية', 'Otel rezervasyonu') },
  { id: 'events', value: 200, suffix: '+', label: t('Events & conferences', 'فعاليات ومؤتمرات', 'Etkinlik ve konferans') },
];
