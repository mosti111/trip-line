import { getPage, getServices } from "@/lib/server";
import { Hero, Sections } from "@/components/public/Editorial";
import { ServiceIndex } from "@/components/public/ServiceIndex";
import { documentMetadata } from "@/lib/metadata";
export async function generateMetadata() { return documentMetadata(await getPage("services"), "/services"); }
export default async function Services() { const [page, services] = await Promise.all([getPage("services"), getServices()]); return <><Hero content={page.content}/><ServiceIndex services={services}/><Sections sections={page.content.sections}/></>; }
