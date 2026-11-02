import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { MotionLab } from '@/components/v6/MotionLab';
export const metadata = { title: 'V6 Motion Lab · Internal review', robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MotionLab locale={locale}/>;
}
