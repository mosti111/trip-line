/** Four authored route scenes. Their physical boundary anchors are never mirrored. */
const scenes = {
  "arrival": "M 1440 0 C 1380 150 1110 130 1140 330 C 1170 500 1410 620 1220 900",
  "service-worlds": "M 1220 0 C 1030 280 1380 410 1130 730 C 970 960 1420 1050 1440 1200",
  "threshold": "M 1440 0 C 1290 190 1050 170 1120 410 C 1190 640 1390 700 1220 900",
  "final": "M 1440 0 C 1170 100 1230 380 1110 520 C 1040 620 830 570 780 730"
} as const;
export function FlightTrace({ scene, className = '' }: { scene: keyof typeof scenes; className?: string }) {
  return <svg className={`flight-trace flight-trace-${scene} ${className}`} viewBox={`0 0 1440 ${scene === 'service-worlds' ? 1200 : 900}`} preserveAspectRatio="none" aria-hidden="true" focusable="false"><path data-flight-path pathLength="1" d={scenes[scene]} /></svg>;
}
