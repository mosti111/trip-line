import {HorizonHero,Postcards,ServiceAccordion,Atlas,StoryTeaser,JournalNudge} from '@/components/journal/Experience';
export const metadata={title:'The Living Travel Journal'};
export default function Home(){return <><HorizonHero/><div className="editorial-strip"><span>THOUGHTFULLY PLANNED</span><span>✳</span><span>BEAUTIFULLY EXPERIENCED</span><span>✳</span><span>PERSONALLY REMEMBERED</span></div><Postcards/><StoryTeaser/><ServiceAccordion/><Atlas/><JournalNudge/></>;}
