"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="system-page"><p className="eyebrow">A MOMENTARY DETOUR</p><h1>Let’s try<br/>that again.</h1><p>We couldn’t load this page. Your journey can continue in a moment.</p><button onClick={reset} className="button button-gold">Try again</button></main>; }
