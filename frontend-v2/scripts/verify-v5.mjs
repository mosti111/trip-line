import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { assertRecoveryHome, watchRuntime } from './verify-recovery-motion.mjs';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v5');
fs.mkdirSync(out,{recursive:true});
const report={status:'running',base,startedAt:new Date().toISOString(),cases:[],errors:[],recordings:[],performance:{}};
const browser=await chromium.launch();report.browser=browser.version();
try {
 if (!process.env.QA_RECORD_ONLY) {
 for(const locale of ['en','tr','ar'])for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1024});watchRuntime(page,report,`${locale}-${width}x${height}`);
  await page.goto(base+'/'+locale,{waitUntil:'networkidle'});await assertRecoveryHome(page,locale);await page.waitForTimeout(1150);
  await expect(page.locator('canvas,.pin-spacer')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.dataset.lenisCount)).toBeUndefined();
  if(width>=1024){const box=await page.locator('.rh-arrival .rh-actions').boundingBox();expect(box.y+box.height,`${locale} laptop CTA`).toBeLessThanOrEqual(height);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:path.join(out,`home-${locale}-${width}x${height}.png`)});
  // Load lazy imagery across the complete document before checking broken media.
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,60));}});
  await page.waitForTimeout(300);
  expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  if([1440,390].includes(width)&&locale!=='tr'){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);await page.screenshot({path:path.join(out,`home-full-${locale}-${width}.png`),fullPage:true});}
  report.cases.push({locale,width,height,overflow:false,brokenImages:0});await page.close();console.log('V5 matrix PASS',locale,width,height);
 }
 // Cold load records actual entrance ownership, independent of conservative SSR motion snapshots.
 const cold=await browser.newPage({viewport:{width:1440,height:900}});
 await cold.addInitScript(()=>{window.__v5Entry=[];new MutationObserver(records=>{for(const r of records)if(r.attributeName==='data-entry'){const node=r.target;window.__v5Entry.push({state:node.getAttribute('data-entry'),time:performance.now()});}}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-entry']});});
 await cold.goto(base+'/en',{waitUntil:'networkidle'});await cold.waitForTimeout(1250);const entrance=await cold.evaluate(()=>window.__v5Entry);expect(entrance.some(e=>e.state==='play')).toBe(true);expect(entrance.at(-1).state).toBe('done');expect(entrance.at(-1).time-entrance.find(e=>e.state==='play').time).toBeLessThan(1250);report.entrance=entrance;await cold.mouse.wheel(0,500);await cold.waitForTimeout(250);await cold.mouse.wheel(0,-500);await cold.waitForTimeout(350);expect((await cold.evaluate(()=>window.__v5Entry)).filter(e=>e.state==='play').length).toBe(1);await cold.close();
 }
 // Desktop continuous recording and Chrome trace use actual wheel input, without jump scrolling.
 const ctx=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});const page=await ctx.newPage();watchRuntime(page,report,'desktop-recording');await page.goto(base+'/en',{waitUntil:'networkidle'});await page.waitForTimeout(1200);
 const cdp=await ctx.newCDPSession(page);await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReturnAsStream'});
 await page.evaluate(()=>{window.__v5Timing={frames:[],longTasks:[],active:true,last:performance.now()};const data=window.__v5Timing;new PerformanceObserver(list=>data.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:false});function tick(t){if(!data.active)return;data.frames.push(t-data.last);data.last=t;requestAnimationFrame(tick);}requestAnimationFrame(tick);});
 await page.mouse.move(720,550);let last=-1,stalled=0;for(let i=0;i<450;i++){await page.mouse.wheel(0,120);await page.waitForTimeout(80);const pos=await page.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));if(pos.y>=pos.max-2)break;if(pos.y===last)stalled++;else stalled=0;expect(stalled,'native wheel must continue').toBeLessThan(15);last=pos.y;}
 const end=await page.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));expect(end.y).toBeGreaterThanOrEqual(end.max-5);
 const timing=await page.evaluate(()=>{window.__v5Timing.active=false;return window.__v5Timing;});const values=timing.frames.slice(1).sort((a,b)=>a-b);const quantile=q=>values[Math.floor((values.length-1)*q)];report.performance={scope:'headless Chromium1440x900, real continuous wheel, video+trace enabled; interval data is not FPS or field-device certification',samples:values.length,frameIntervalsMs:{median:quantile(.5),p95:quantile(.95),p99:quantile(.99),max:values.at(-1)},longTasks:timing.longTasks};
 const completed=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const trace=await completed;let data='';while(true){const chunk=await cdp.send('IO.read',{handle:trace.stream});data+=chunk.data;if(chunk.eof)break;}await cdp.send('IO.close',{handle:trace.stream});fs.writeFileSync(path.join(out,'desktop-trace.json'),data);
 await page.screenshot({path:path.join(out,'final-invitation.png')});await ctx.close();const desktopVideo=await page.video().path();report.recordings.push({kind:'complete-desktop-wheel',path:desktopVideo,end});
 // Mobile uses real Chromium touch-scroll gestures and interactive controls.
 const mobileCtx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});const mobile=await mobileCtx.newPage();watchRuntime(mobile,report,'mobile-recording');await mobile.goto(base+'/ar',{waitUntil:'networkidle'});await mobile.waitForTimeout(1200);await mobile.locator('.menu-button').tap();await expect(mobile.locator('.nav-dialog')).toBeVisible();await mobile.screenshot({path:path.join(out,'menu-ar-mobile.png')});await mobile.locator('.nav-dialog .dialog-header button').tap();const touch=await mobileCtx.newCDPSession(mobile);
 await expect(mobile.locator('.nav-dialog')).not.toBeVisible();await expect.poll(()=>mobile.evaluate(()=>getComputedStyle(document.body).overflow)).not.toBe('hidden');
 for(let i=0;i<14;i++){await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:700}]});for(let step=1;step<=12;step++){await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y:700-step*35}]});await mobile.waitForTimeout(20);}await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(90);}
 expect(await mobile.evaluate(()=>scrollY)).toBeGreaterThan(1000);await mobile.screenshot({path:path.join(out,'mobile-interaction.png')});await mobileCtx.close();report.recordings.push({kind:'mobile-Arabic-menu-and-touch-scroll',path:await mobile.video().path()});
 expect(report.errors).toEqual([]);report.status='passed';
} catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{for(const context of browser.contexts())await context.close();report.finishedAt=new Date().toISOString();for(const name of fs.readdirSync(out)){const file=path.join(out,name);if(fs.statSync(file).isFile()){const content=fs.readFileSync(file);(report.artifacts||=[]).push({path:file,bytes:content.length,sha256:crypto.createHash('sha256').update(content).digest('hex')});}}fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({status:report.status,cases:report.cases.length,performance:report.performance,errors:report.errors},null,2));}
