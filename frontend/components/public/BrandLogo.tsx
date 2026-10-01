import Link from "next/link";
export function BrandLogo() {
  return <Link href="/" aria-label="Trip Line home" className="brand-logo"><span>Trip<br/>Line</span><svg className="brand-flight" viewBox="0 0 80 80" aria-hidden="true"><path className="brand-trail" d="M3 69C34 81 73 64 66 41"/><path className="brand-aircraft" d="m61 10 4 8 10-1 3 3-11 3-3 10-3-1 1-9-6-2-4 2-1-2 4-4 5 1-2-7z"/></svg></Link>;
}
