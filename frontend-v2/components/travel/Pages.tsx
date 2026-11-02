import { InternationalExperience, CountryExperience } from '../secondary/InternationalExperience';
import { FAQExperience } from '../secondary/FAQExperience';
import { LegalExperience } from '../secondary/LegalExperience';
import { AboutExperience } from '../company/AboutExperience';
import { BusinessExperience } from '../services/BusinessExperience';
import { PilgrimageExperience } from '../services/PilgrimageExperience';
import { TravelServicesHub } from '../services/TravelServicesHub';
import { ServiceExperience } from '../services/ServiceExperience';
import { HomeJourney } from '../home-v3/HomeJourney';
import { TurkeyHub } from '../turkiye/TurkeyHub';
import { DestinationJourney } from '../home-v3/DestinationJourney';
import { ContactExperience } from '../contact/ContactExperience';
import type { InquiryProps } from './Inquiry';
import { ui, type Locale } from '@/lib/i18n';
import { type Country, type Service } from '@/lib/travel-content';
import { Action } from './Sections';
import { Ribbon } from './Ribbon';
import { type TurkishPlace } from '@/lib/turkiye';

export function HomePage({locale}:{locale:Locale}) {return <HomeJourney locale={locale}/>;}
export function ServicesPage({locale,audience}:{locale:Locale;audience?:string}) {return <TravelServicesHub locale={locale} audience={audience}/>;}
export function ServicePage({locale,service}:{locale:Locale;service:Service}) {return service.slug==='hajj-umrah'?<PilgrimageExperience locale={locale} service={service}/>:<ServiceExperience locale={locale} service={service}/>;}
export function DestinationsPage({locale}:{locale:Locale}) {return <InternationalExperience locale={locale}/>;}
export function CountryPage({locale,country}:{locale:Locale;country:Country}) {return country.slug==='turkiye'?<TurkeyHub locale={locale}/>:<CountryExperience locale={locale} country={country}/>;}
export function BusinessPage({locale}:{locale:Locale}) {return <BusinessExperience locale={locale}/>;}
export function AboutPage({locale}:{locale:Locale}) {return <AboutExperience locale={locale}/>;}
export function ContactPage(props:InquiryProps) {return <ContactExperience {...props}/>;}
export function FAQPage({locale}:{locale:Locale}) {return <FAQExperience locale={locale}/>;}
export function LegalPage({locale,kind}:{locale:Locale;kind:'privacy'|'terms'}) {return <LegalExperience locale={locale} kind={kind}/>;}
export function NotFoundPage({locale}:{locale:Locale}) {return <section className="not-found teal"><div className="wrap"><span className="not-found-number">404</span><h1>{ui.notFound[locale]}</h1><p>{ui.notFoundBody[locale]}</p><div className="actions"><Action locale={locale} path="">{ui.returnHome[locale]}</Action><Action locale={locale} path="destinations" secondary>{ui.allCountries[locale]}</Action></div></div><Ribbon/></section>;}

export function TurkishPlacePage({locale,place}:{locale:Locale;place:TurkishPlace}) {return <DestinationJourney locale={locale} place={place}/>;}
