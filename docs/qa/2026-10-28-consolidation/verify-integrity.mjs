import fs from 'node:fs';
const base = 'http://localhost:3041';
const report = { status:'running', routes:[], assets:[], errors:[] };
try {
  const sitemap = await (await fetch(base+'/sitemap.xml')).text();
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  if (paths.length!==120 || new Set(paths).size!==120) throw Error('Sitemap must enumerate 120 unique content paths');
  const assets = new Set();
  for (const route of paths) {
    const response = await fetch(base+route); const html = await response.text();
    const locale = route.split('/')[1];
    if (response.status!==200 || !html.includes('lang="'+locale+'"') || !html.includes('dir="'+(locale==='ar'?'rtl':'ltr')+'"')) throw Error(route+' status/lang/dir');
    if (!/<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/.test(html)) throw Error(route+' noindex');
    const links = [...html.matchAll(/<link\b[^>]+>/g)].map(m=>m[0]);
    if (!links.some(l=>l.includes('rel="canonical"'))) throw Error(route+' canonical');
    for (const lang of ['en','ar','tr']) if (!links.some(l=>l.includes('hrefLang="'+lang+'"') || l.includes('hreflang="'+lang+'"'))) throw Error(route+' '+lang+' alternate');
    for(const match of html.matchAll(/<(?:img|source)\b[^>]*\bsrc="([^"]+)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;','&'),base);
      if(url.pathname==='/_next/image') {const source=url.searchParams.get('url');if(source?.startsWith('/'))assets.add(source);}
      else if(url.origin===base) assets.add(url.pathname);
    }
    report.routes.push(route);
  }
  for (const asset of assets) {const r=await fetch(base+asset,{method:'HEAD'});if(!r.ok)throw Error(asset+' status '+r.status);report.assets.push({path:asset,status:r.status});}
  const robots=await(await fetch(base+'/robots.txt')).text();
  if(!robots.includes('Disallow: /'))throw Error('robots disallow');
  report.status='pass';
} catch(e) {report.status='fail';report.errors.push(String(e));process.exitCode=1;}
fs.writeFileSync('../tmp/consolidation/integrity.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,routes:report.routes.length,assets:report.assets.length,errors:report.errors}));
