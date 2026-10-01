import { getPage } from "@/lib/server";
import { Hero, Sections } from "@/components/public/Editorial";
import { documentMetadata } from "@/lib/metadata";
export async function generateMetadata() { return documentMetadata(await getPage("about"), "/about"); }
export default async function About() { const page = await getPage("about"); return <><Hero content={page.content}/><Sections sections={page.content.sections}/></>; }
