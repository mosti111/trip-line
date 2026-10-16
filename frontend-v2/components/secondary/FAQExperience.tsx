import Link from 'next/link';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { questions, services } from '@/lib/travel-content';
import { turkeyCopy } from '@/lib/turkiye';
import '@/styles/recovery-secondary.css';

const groups=[
  {id:'planning',title:t('Planning a journey','التخطيط لرحلة','Yolculuk planlama'),items:[questions[0],questions[2],questions[3],...services.filter(s=>s.audience==='travel').map(s=>({q:s.question,a:s.answer}))]},
  {id:'turkiye',title:t('Türkiye','تركيا','Türkiye'),items:[{q:t('How can I build my Türkiye journey?','كيف أبني رحلتي في تركيا؟','Türkiye yolculuğumu nasıl oluşturabilirim?'),a:t('Explore the twelve Türkiye destinations and add the places you like to your journey. You can change their order or remove them, then continue to Contact. Your choices stay in this browser session.','اكتشف وجهات تركيا الاثنتي عشرة وأضف الأماكن التي تعجبك إلى رحلتك. يمكنك تغيير ترتيبها أو حذفها، ثم المتابعة إلى صفحة التواصل. تبقى اختياراتك في جلسة التصفح هذه.','Türkiye’deki on iki destinasyonu keşfet ve beğendiğin yerleri yolculuğuna ekle. Sıralarını değiştirebilir veya kaldırabilir, ardından İletişim’e devam edebilirsin. Seçimlerin bu tarayıcı oturumunda kalır.')} ]},
  {id:'hajj',title:ui.pilgrimage,items:services.filter(s=>s.audience==='pilgrimage').map(s=>({q:s.question,a:s.answer}))},
  {id:'business',title:ui.business,items:[questions[4],...services.filter(s=>s.audience==='business').map(s=>({q:s.question,a:s.answer}))]},
  {id:'inquiry',title:t('Inquiry / arrangements','الاستفسار / الترتيبات','Talep / düzenlemeler'),items:[questions[1],questions[5]]},
];

export function FAQExperience({locale}:{locale:Locale}) {
  return <div className="recovery-secondary secondary-faq"><header className="sx-page-intro"><div className="sx-wrap"><span className="sx-kicker">{ui.faq[locale]}</span><h1>{ui.questions[locale]}</h1><p>{ui.questionsBody[locale]}</p></div></header><div className="sx-wrap sx-faq-layout"><nav className="sx-contents" aria-label={ui.contents[locale]}><h2>{ui.contents[locale]}</h2>{groups.map(g=><a key={g.id} href={`#faq-${g.id}`}>{g.title[locale]}</a>)}</nav><div>{groups.map(g=><section className="sx-faq-group" id={`faq-${g.id}`} key={g.id} data-faq-group={g.id}><h2>{g.title[locale]}</h2>{g.items.map((item,i)=><details key={i}><summary>{item.q[locale]}</summary><p>{item.a[locale]}</p></details>)}{g.id==='turkiye'&&<Link className="journey-text-link" href={href(locale,'destinations/turkiye')}>{turkeyCopy.domestic[locale]} ↗</Link>}</section>)}</div></div><section className="sx-help" data-journey-planner><div className="sx-wrap"><span className="sx-kicker">{ui.contact[locale]}</span><h2>{ui.planning[locale]}</h2><p>{ui.formBody[locale]}</p><Link className="journey-action journey-action-primary" href={href(locale,'contact')}>{ui.plan[locale]} ↗</Link></div></section></div>;
}
