'use client';
import { useTravel } from '@/components/travel/SiteShell';
import { t } from '@/lib/i18n';
export default function ErrorPage({reset}:{reset:()=>void}){const {locale}=useTravel();return <section className="compact-intro teal"><div className="wrap"><h1>{t('A momentary detour.','تعثر مؤقت.','Kısa bir aksaklık.')[locale]}</h1><p>{t('We couldn’t load this page. Please try again.','تعذر تحميل الصفحة. يرجى المحاولة مجدداً.','Bu sayfa yüklenemedi. Lütfen tekrar dene.')[locale]}</p><button className="button" onClick={reset}>{t('Try again','حاول مجدداً','Tekrar dene')[locale]}</button></div></section>;}
