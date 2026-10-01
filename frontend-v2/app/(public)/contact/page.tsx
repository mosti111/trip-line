import {PageIntro} from '@/components/journal/Experience';import {ContactPostcard} from '@/components/journal/ContactPostcard';
export const metadata={title:'Your next chapter'};
export default async function Contact({searchParams}:{searchParams:Promise<{service?:string}>}){const query=await searchParams;return <><PageIntro label="A PERSONAL INVITATION" title="A PLACE. A FEELING." italic="A little possibility." body="Tell us what you have in mind. Every memorable journey begins with a conversation."/><ContactPostcard service={query.service}/></>;}
