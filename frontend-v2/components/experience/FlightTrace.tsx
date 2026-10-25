/** Four authored route scenes. Their physical boundary anchors are never mirrored. */
const scenes = {
  "arrival": "M 1440 0 C 1380 150 1110 130 1140 330 C 1170 500 1410 620 1220 900",
  "service-worlds": "M 1220 0 C 1030 280 1380 410 1130 730 C 970 960 1420 1050 1440 1200",
  "threshold": "M 1440 0 C 1290 190 1050 170 1120 410 C 1190 640 1390 700 1220 900",
  "process": "M 22 60 C 150 5 280 115 436 60 S 700 5 852 60",
  "final": "M 1440 0 C 1170 100 1230 380 1110 520 C 1040 620 830 570 780 730",
  "signature-horizon": "M1440 100 C1060 100 1210 450 1030 600 S980 800 1050 900",
  "signature-mountain": "M1050 0 C910 220 1370 300 1220 570 S1100 750 1180 900",
  "signature-coast": "M1180 0 C1300 210 870 330 1070 540 S1300 800 1440 900"
} as const;
export function FlightTrace({ scene, className = '', rtl = false }: { scene: keyof typeof scenes; className?: string; rtl?: boolean }) {
  const route = scene === 'final' ? (rtl ? 'M0 0 C340 120 300 500 1030 600 S1200 780 1200 650' : 'M1440 0 C1100 120 1140 500 410 600 S240 780 240 650') : scene === 'process' && rtl ? 'M1178 60 C1050 5 920 115 764 60 S500 5 348 60' : scenes[scene];
  return <svg className={`flight-trace flight-trace-${scene} ${className}`} viewBox={scene === 'process' ? '0 0 1200 200' : `0 0 1440 ${scene === 'service-worlds' ? 1200 : 900}`} preserveAspectRatio="none" aria-hidden="true" focusable="false"><path data-flight-path pathLength="1" d={route} />{(scene === 'arrival' || scene === 'final' || scene === 'process') && <g data-flight-plane className="flight-plane"><path transform="translate(-14 -14) scale(.8)" d="M 28.157 6 C 24.428 9.564, 24.149 9.583, 14.513 6.940 C 7.375 4.982, 5 5.001, 5 7.017 C 5 7.511, 6.959 9.064, 9.353 10.467 C 11.747 11.870, 14.528 13.926, 15.533 15.036 C 17.318 17.009, 17.282 17.120, 13.930 19.987 C 11.737 21.862, 9.349 22.933, 7.309 22.959 C 4.297 22.998, 1.569 25.004, 3.573 25.707 C 7.485 27.080, 7.483 27.921, 3.558 31.941 C 1.398 34.153, -0.144 36.190, 0.133 36.467 C 0.410 36.744, 2.157 35.402, 4.015 33.485 C 8.012 29.360, 9.646 29.128, 11.168 32.469 C 12.685 35.798, 14 34.711, 14 30.128 C 14 27.279, 14.709 25.695, 16.940 23.557 C 20.642 20.010, 22.137 20.568, 26.073 26.964 C 31.430 35.671, 33.175 32.992, 29.945 21.019 L 27.743 12.860 30.872 9.632 C 36.553 3.771, 34.027 0.391, 28.157 6"/></g>}</svg>;
}
