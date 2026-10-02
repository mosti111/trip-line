import type { MetadataRoute } from "next";
import { publicPaths } from '@/lib/travel-content';
import { href, locales } from '@/lib/i18n';
import { siteUrl } from "@/lib/site-url";
export default function sitemap():MetadataRoute.Sitemap {return locales.flatMap(locale=>publicPaths.map(path=>({url:siteUrl+href(locale,path),alternates:{languages:Object.fromEntries(locales.map(l=>[l,siteUrl+href(l,path)]))}})));}
