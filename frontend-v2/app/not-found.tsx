import { headers } from 'next/headers';
import { isLocale } from '@/lib/i18n';
import { NotFoundPage } from '@/components/travel/Pages';
export default async function NotFound() {const lang=(await headers()).get('x-tripline-locale')||'en';return <NotFoundPage locale={isLocale(lang)?lang:'en'}/>;}
