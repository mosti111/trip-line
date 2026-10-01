import Link from "next/link";
import { publicApi } from "@/lib/server";
import { Hero, Sections } from "@/components/public/Editorial";
import { documentMetadata } from "@/lib/metadata";
import type { Document } from "@/lib/types";
type Props = { params: Promise<{ slug: string }> };
async function load(props: Props) { return publicApi<Document>(`/services/${encodeURIComponent((await props.params).slug)}`); }
export async function generateMetadata(props: Props) { return documentMetadata(await load(props), `/services/${(await props.params).slug}`); }
export default async function Detail(props: Props) { const service = await load(props); return <><Hero content={service.content}/><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/services">Services</Link><span>/</span><span>{service.content.title}</span></nav><Sections sections={service.content.sections}/></>; }
