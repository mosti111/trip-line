import {chromium} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'../..');
const matrix=path.join(root,'docs/qa/2026-10-25-v61/C5/matrix');
const out=path.join(root,'docs/qa/2026-10-25-v61/C5/review');
fs.mkdirSync(out,{recursive:true});
const report={method:'Native Chromium decoding of the original continuous recordings; stills sampled by video time for rendered review. No animation timeline seeking or retiming in the original recordings.',recordings:[]};
const browser=await chromium.launch();
try{
 for(const recording of JSON.parse(fs.readFileSync(path.join(matrix,'report.json'),'utf8')).recordings){
  const mobile=recording.kind.includes('Arabic'),name=mobile?'arabic-touch':'desktop-wheel';
  const stable=path.join(matrix,name+'.webm');fs.copyFileSync(recording.path,stable);
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900}});
  await page.goto(pathToFileURL(stable).href);const video=page.locator('video');await video.waitFor();
  await video.evaluate(async v=>{if(v.readyState<1)await new Promise(resolve=>v.addEventListener('loadedmetadata',resolve,{once:true}));v.controls=false;v.pause();v.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;object-fit:contain;background:black';if(!Number.isFinite(v.duration)){await new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=1e8;});}});
  const duration=await video.evaluate(v=>v.duration);if(!Number.isFinite(duration))throw Error('No finite video duration');const samples=[];
  for(const fraction of[.02,.12,.24,.36,.48,.6,.72,.84,.97]){const time=duration*fraction;await video.evaluate(async(v,time)=>{await new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=time;});},time);const file=name+'-'+Math.round(fraction*100)+'.png';await page.screenshot({path:path.join(out,file)});samples.push({time,file});}
  report.recordings.push({kind:recording.kind,path:path.relative(root,stable),duration,samples,end:recording.end});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await page.goto((process.env.QA_URL||'http://localhost:3008')+'/en',{waitUntil:'networkidle'});await page.locator('.atlas-stage').evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-90,behavior:'instant'}));await page.waitForTimeout(1000);await page.screenshot({path:path.join(out,'atlas-after-istanbul.png')});report.comparison={locale:'en',width:1440,height:900,place:'istanbul',photo:await page.locator('.rt-preview-image[data-active=true] img').getAttribute('src'),effective:await page.evaluate(()=>({reduce:matchMedia('(prefers-reduced-motion:reduce)').matches,manual:localStorage.getItem('tripline-motion')||'system',saveData:!!navigator.connection?.saveData,owner:document.querySelector('.v61-home').dataset.homeMotion}))};await page.locator('.v61-billboard-window').scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(500);await page.screenshot({path:path.join(out,'billboard-after.png')});await page.close();
 report.status='passed';
}finally{await browser.close();fs.writeFileSync(path.join(out,'review-samples.json'),JSON.stringify(report,null,2));}
