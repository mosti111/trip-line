import type { MetadataRoute } from "next";
import { demoEnabled } from "@/lib/demo";
import { siteUrl } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots { return demoEnabled ? { rules: { userAgent: "*", disallow: "/" } } : { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/preview", "/api"] }, sitemap: `${siteUrl}/sitemap.xml` }; }
