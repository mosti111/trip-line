export function JourneyChapter({ number, title, children, className = '' }: {
  number: string; title: string; children: React.ReactNode; className?: string;
}) {
  return <div className={`journey-chapter ${className}`} data-chapter={number}>
    <div className="chapter-label wrap"><span>{number}</span><span>{title}</span><i aria-hidden="true" /></div>
    {children}
  </div>;
}
