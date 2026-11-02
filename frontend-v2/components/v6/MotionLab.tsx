import type { Locale } from '@/lib/i18n';
import { HomeArrival } from '../home-v3/HomeArrival';
import { ServiceWorldsV3 } from '../home-v3/ServiceWorlds';
import { TurkeyDiscovery } from '../travel/TurkeyDiscovery';
import { V6Motion } from './V6Motion';
import { TravelNetwork } from './TravelNetwork';
import '@/styles/recovery-home.css';
import '@/styles/v6-motion.css';

export function MotionLab({ locale }: { locale: Locale }) {
  return <div className="recovery-home v6-home v6-lab">
    <HomeArrival locale={locale}/><ServiceWorldsV3 locale={locale}/>
    <TurkeyDiscovery locale={locale}/><TravelNetwork locale={locale}/>
    <V6Motion/><aside className="v6-lab-note">V6 / MOTION LAB · INTERNAL CREATIVE REVIEW</aside>
  </div>;
}
