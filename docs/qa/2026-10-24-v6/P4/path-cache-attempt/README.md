First native-SVG lookup-table attempt: all 36 structural cases passed, but
performance closure FAILED (268ms LongTask; 255.477ms FunctionCall).
The separate CPU-attribution run found 241.609ms sampled self time in native
getPointAtLength, called by measureRoute during refreshWhenIdle/refreshInit,
inside a ScrollTrigger wheel-update stack. This was not accepted as final.
Final correction uses the existing MotionPathPlugin pure-JS path calculations,
reuses measurements for unchanged path data, measures only actual plane routes,
and schedules refresh outside the wheel stack. See release evidence for outcome.
