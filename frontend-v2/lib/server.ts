import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Document, Site } from "./types";
import { demoEnabled, demoPages, demoServices, demoSite } from "./demo";
const origin = process.env.INTERNAL_API_URL || "http://localhost:8080";
export async function publicApi<T>(path: string): Promise<T> {
  if (demoEnabled) {
    if (path === "/site") return demoSite as T;
    if (path === "/services") return demoServices as T;
    if (path.startsWith("/pages/")) { const page = demoPages[path.slice(7)]; if (!page) notFound(); return page as T; }
    if (path.startsWith("/services/")) { const service = demoServices.find(s => s.slug === path.slice(10)); if (!service) notFound(); return service as T; }
    notFound();
  }
  const res = await fetch(`${origin}/api/v1/public${path}`, { next: { revalidate: 30 }, signal: AbortSignal.timeout(8000) });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Content is temporarily unavailable.");
  return res.json() as Promise<T>;
}
export const getSite = cache(() => publicApi<Site>("/site"));
export const getPage = cache((slug: string) => publicApi<Document>(`/pages/${encodeURIComponent(slug)}`));
export const getServices = cache(() => publicApi<Document[]>("/services"));
export async function previewDocument(type: "pages" | "services", id: string): Promise<Document> {
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const res = await fetch(`${origin}/api/v1/admin/${type}/${id}/preview`, { headers: { Cookie: (await cookies()).toString() }, cache: "no-store" });
  if (!res.ok) notFound(); return res.json();
}
