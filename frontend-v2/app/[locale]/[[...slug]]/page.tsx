import { turkishPlaces } from '@/lib/turkiye';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales, ui, href } from '@/lib/i18n';
import { countries, services, publicPaths } from '@/lib/travel-content';
import { TurkishPlacePage, AboutPage, BusinessPage, ContactPage, CountryPage, DestinationsPage, FAQPage, HomePage, LegalPage, ServicePage, ServicesPage } from '@/components/travel/Pages';
type Props={params:Promise<{locale:string;slug?:string[]}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale:lang,slug=[]}=await params;if(!isLocale(lang))return {};
 const path=slug.join('/');const service=services.find(s=>path===`services/${s.slug}`);const country=countries.find(c=>path===`destinations/${c.slug}`);
 const titles:Record<string,string>={'':ui.tagline[lang],services:ui.services[lang],destinations:ui.destinations[lang],about:ui.about[lang],business:ui.business[lang],contact:ui.contact[lang],faq:ui.faq[lang],privacy:ui.privacy[lang],terms:ui.terms[lang]};
 const place=turkishPlaces.find(p=>path===`destinations/turkiye/${p.slug}`);
 const title=place?.name[lang]||service?.title[lang]||country?.name[lang]||titles[path]||ui.notFound[lang];const description=place?.note[lang]||service?.summary[lang]||country?.note[lang]||ui.ctaBody[lang];
 return {title,description,alternates:{canonical:href(lang,path),languages:Object.fromEntries(locales.map(l=>[l,href(l,path)]))},openGraph:{title:`${title} · Trip Line`,description,type:'website',locale:lang==='ar'?'ar_AR':lang==='tr'?'tr_TR':'en_US',images:[{url:`/media/${place?.image||service?.image|| (country?country.slug+'.jpg':'istanbul.png')}`,width:1200,height:630,alt:title}]}};
}
export default async function Page({params,searchParams}:Props){
 const {locale,slug=[]}=await params;if(!isLocale(locale))notFound();const path=slug.join('/');if(!publicPaths.includes(path))notFound();
 const place=turkishPlaces.find(p=>path===`destinations/turkiye/${p.slug}`);if(place)return <TurkishPlacePage locale={locale} place={place}/>;
 const query=await searchParams;const value=(key:string)=>typeof query[key]==='string'?query[key]:undefined;
 const service=services.find(s=>path===`services/${s.slug}`);if(service)return <ServicePage locale={locale} service={service}/>;
 const country=countries.find(c=>path===`destinations/${c.slug}`);if(country)return <CountryPage locale={locale} country={country}/>;
 switch(path){case '':return <HomePage locale={locale}/>;case 'services':return <ServicesPage locale={locale} audience={value('audience')}/>;case 'destinations':return <DestinationsPage locale={locale}/>;case 'business':return <BusinessPage locale={locale}/>;case 'about':return <AboutPage locale={locale}/>;case 'contact':return <ContactPage key={`${locale}-${value('service')}-${value('destination')}`} locale={locale} service={value('service')} destination={value('destination')}/>;case 'faq':return <FAQPage locale={locale}/>;case 'privacy':case 'terms':return <LegalPage locale={locale} kind={path}/>;default:notFound();}
}
