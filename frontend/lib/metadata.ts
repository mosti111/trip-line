import type { Metadata } from "next";
import type { Document } from "./types";
export function documentMetadata(doc: Document, path: string): Metadata {
  const c = doc.content; const title = c.seoTitle || c.title.replaceAll("\n", " "); const description = c.seoDescription || c.description;
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, images: c.ogImage || c.image ? [{ url: c.ogImage || c.image }] : [] } };
}
