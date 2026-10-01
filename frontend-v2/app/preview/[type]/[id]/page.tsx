import { notFound } from "next/navigation";
import { demoEnabled } from "@/lib/demo";
import { previewDocument, getServices } from "@/lib/server";
import { Hero, Sections } from "@/components/public/Editorial";
export const dynamic = "force-dynamic";
export const metadata = { title: "Draft preview", robots: { index: false, follow: false } };
export default async function Preview({ params }: { params: Promise<{ type: string; id: string }> }) {
  if (demoEnabled) notFound();
  const { type, id } = await params; if (type !== "pages" && type !== "services") notFound();
  const doc = await previewDocument(type, id); const services = await getServices();
  return <main id="main"><div className="preview-banner">DRAFT PREVIEW — Only visible to authorized editors. Saved changes have not been published.</div><Hero content={doc.content} home={doc.slug === "home"}/><Sections sections={doc.content.sections} services={services}/></main>;
}
