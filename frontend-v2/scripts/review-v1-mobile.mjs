import {chromium,expect} from '@playwright/test';import fs from 'node:fs';import path from 'node:path';import{pathToFileURL}from'node:url';
const base=process.env.QA_URL||'http://localhost:3011',out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v1-mobile/review');fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch();const report={status:'running',base,recordings:[],errors:[],viewports:[]};
try{
 for(const locale of['en','tr','ar']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}}),page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(String(e)));await page.goto(base+'/'+locale,{waitUntil:'networkidle'});await page.waitForTimeout(1500);const touch=await ctx.newCDPSession(page);let previous=-1,stalled=0,shot=0;
  await page.screenshot({path:path.join(out,`${locale}-viewport-${String(shot++).padStart(2,'0')}.png`)});
  await page.evaluate(()=>{window.__v1Tasks=[];new PerformanceObserver(list=>window.__v1Tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:false});});
  for(let swipe=0;swipe<160;swipe++){
   await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:700}]});for(let n=1;n<=12;n++){await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:700-n*38}]});await page.waitForTimeout(18);}await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(140);
   const pos=await page.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));report.viewports.push({locale,...pos});if(pos.y>=pos.max-2)break;stalled=pos.y===previous?stalled+1:0;expect(stalled).toBeLessThan(8);previous=pos.y;
   await page.waitForTimeout(500);await page.screenshot({path:path.join(out,`${locale}-viewport-${String(shot++).padStart(2,'0')}.png`)});
  }
  const end=await page.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));const longTasks=await page.evaluate(()=>window.__v1Tasks);expect(end.y).toBeGreaterThanOrEqual(end.max-5);await page.screenshot({path:path.join(out,`${locale}-viewport-${String(shot).padStart(2,'0')}.png`)});await ctx.close();const video=path.join(out,`${locale}-complete-touch.webm`);fs.renameSync(await page.video().path(),video);report.recordings.push({locale,video,end,longTasks,scope:'Chromium touch input with video and screenshots; not physical-device or field performance certification'});console.log('Complete native touch',locale,end);
 }
 for(const recording of report.recordings){
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(pathToFileURL(recording.video).href);const video=page.locator('video');await video.waitFor();await video.evaluate(async v=>{if(v.readyState<1)await new Promise(r=>v.addEventListener('loadedmetadata',r,{once:true}));v.pause();v.controls=false;v.style.cssText='position:fixed;inset:0;width:100%;height:100%;object-fit:contain;background:black';if(!Number.isFinite(v.duration))await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=1e8;});});recording.duration=await video.evaluate(v=>v.duration);recording.samples=[];
  for(const fraction of[.05,.2,.35,.5,.65,.8,.95]){const time=recording.duration*fraction;await video.evaluate((v,t)=>new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=t;}),time);const file=`${recording.locale}-recording-${Math.round(fraction*100)}.png`;await page.screenshot({path:path.join(out,file)});recording.samples.push({time,file});}await page.close();
 }
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}finally{for(const ctx of browser.contexts())await ctx.close();await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));}
