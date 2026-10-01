import { getPage, getServices } from "@/lib/server";
import { Hero, Sections } from "@/components/public/Editorial";
import { documentMetadata } from "@/lib/metadata";
export async function generateMetadata() { return documentMetadata(await getPage("home"), "/"); }
export default async function Home() { const [page, services] = await Promise.all([getPage("home"), getServices()]); return <><Hero content={page.content} home/><Sections sections={page.content.sections} services={services}/></>; }
