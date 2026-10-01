import type { MetadataRoute } from "next";
import { getServices } from "@/lib/server";
import { siteUrl } from "@/lib/site-url";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const services = await getServices(); return [...["", "/about", "/services", "/contact"].map(path => ({ url: `${siteUrl}${path}` })), ...services.map(s => ({ url: `${siteUrl}/services/${s.slug}`, lastModified: s.publishedAt || s.updatedAt }))]; }
