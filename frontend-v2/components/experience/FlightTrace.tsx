/** Four authored route scenes. Their physical boundary anchors are never mirrored. */
const scenes = {
  "arrival": "M 1440 0 C 1380 150 1110 130 1140 330 C 1170 500 1410 620 1220 900",
  "service-worlds": "M 1220 0 C 1030 280 1380 410 1130 730 C 970 960 1420 1050 1440 1200",
  "threshold": "M 1440 0 C 1290 190 1050 170 1120 410 C 1190 640 1390 700 1220 900",
  "process": "M 22 60 C 150 5 280 115 436 60 S 700 5 852 60",
  "final": "M 1440 0 C 1170 100 1230 380 1110 520 C 1040 620 830 570 780 730"
} as const;
export function FlightTrace({ scene, className = '' }: { scene: keyof typeof scenes; className?: string }) {
  return <svg className={`flight-trace flight-trace-${scene} ${className}`} viewBox={scene === 'process' ? '0 0 1200 200' : `0 0 1440 ${scene === 'service-worlds' ? 1200 : 900}`} preserveAspectRatio="none" aria-hidden="true" focusable="false"><path data-flight-path pathLength="1" d={scenes[scene]} />{(scene === 'arrival' || scene === 'final' || scene === 'process') && <g data-flight-plane className="flight-plane"><path d="M 7 -14 L 11 -10 L 5 -1 L 9 12 L 6 15 L -1 4 L -8 8 L -7 13 L -10 15 L -13 6 L -4 0 L -13 -7 L -10 -10 L 1 -5 Z"/></g>}</svg>;
}
