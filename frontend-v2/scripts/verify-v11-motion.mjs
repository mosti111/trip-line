import {chromium,webkit,expect} from '@playwright/test';
import fs from 'node:fs';import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3019',out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v11/motion');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch(),report={status:'running',engine:browser.version(),nativeSafari:'NOT TESTED: no physical iPhone or native Safari available on this Windows host.',modes:[],effects:[],errors:[]};
try{
 for(const system of ['reduce','no-preference'])for(const choice of ['system','full','reduced']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:system});
  await ctx.addInitScript(({choice})=>{localStorage.setItem('tripline-motion',choice);Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}});},{choice});
  const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(String(e)));await page.goto(base+'/en',{waitUntil:'networkidle'});await page.waitForTimeout(1500);
  const effective=choice==='system'?(system==='reduce'?'reduced':'full'):choice;
  await expect(page.locator('html')).toHaveAttribute('data-motion-effective',effective);
  await expect(page.locator('.v6-home')).toHaveAttribute('data-home-motion',effective==='full'?'native':'static');
  await page.locator('.v61-network').scrollIntoViewIfNeeded();await page.waitForTimeout(350);
  const state=await page.locator('.v61-network').evaluate(el=>({running:el.dataset.running,display:getComputedStyle(el.querySelector('.v61-billboard-group')).display,duplicate:getComputedStyle(el.querySelectorAll('.v61-billboard-group')[1]).display}));
  expect(state.running).toBe(effective==='full'?'true':'false');expect(state.display).toBe(effective==='full'?'flex':'grid');
  if(effective==='reduced')expect(state.duplicate).toBe('none');
  report.modes.push({system,choice,effective,saveData:true,...state});await ctx.close();
 }
 // The actual accessible controls change, persist and override a reduced system.
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',recordVideo:{dir:out,size:{width:390,height:844}}});const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
 await page.goto(base+'/en',{waitUntil:'networkidle'});await page.locator('.menu-button').tap();await page.locator('.nav-dialog .motion-choice select').selectOption('full');await expect(page.locator('html')).toHaveAttribute('data-motion-effective','full');await page.locator('.nav-dialog .dialog-header button').tap();await page.reload({waitUntil:'networkidle'});await expect(page.locator('html')).toHaveAttribute('data-motion-choice','full');await expect(page.locator('.v6-home')).toHaveAttribute('data-home-motion','native');
 const touch=await ctx.newCDPSession(page);
 const swipe=async()=>{await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:700}]});for(let i=1;i<=14;i++){await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y:700-i*30}]});await page.waitForTimeout(18);}await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250);};
 for(const [name,trigger,target] of [['hero','.rh-arrival','.rh-arrival-photo'],['services','.rh-world-0','.rh-world-0 .rh-world-photo'],['explorer','.atlas-stage','.rt-preview-media'],['cappadocia','.rh-signature-0','.rh-signature-0 .v61-landscape-frame'],['rize','.rh-signature-1','.rh-signature-1 .v61-landscape-frame'],['antalya','.rh-signature-2','.rh-signature-2 .v61-landscape-frame'],['final','.rh-final','.rh-final>.photo']]){
  await page.locator(trigger).evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-innerHeight*.8,behavior:'instant'}));await page.waitForTimeout(300);
  const sample=()=>page.locator(target).evaluate(e=>({clip:getComputedStyle(e).clipPath,transform:getComputedStyle(e).transform}));const before=await sample();await page.screenshot({path:path.join(out,name+'-before.png')});const y=await page.evaluate(()=>scrollY);await swipe();const after=await sample();expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(y+100);expect(JSON.stringify(after),name+' must visibly transform').not.toBe(JSON.stringify(before));await page.screenshot({path:path.join(out,name+'-after.png')});report.effects.push({name,before,after,input:'native Chromium touch dispatch',effective:'full with system reduced'});
 }
 await page.setViewportSize({width:390,height:740});await page.waitForTimeout(500);await page.setViewportSize({width:844,height:390});await page.waitForTimeout(500);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);report.viewportResize={errors:[],method:'emulated viewport resize and orientation; physical Safari toolbar not certified'};
 await ctx.close();fs.renameSync(await page.video().path(),path.join(out,'full-override-touch.webm'));
 // Ordinary touch must not seek the opening timeline to its end.
 const cold=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await cold.goto(base+'/en',{waitUntil:'domcontentloaded'});await cold.waitForFunction(()=>document.querySelector('.rh-arrival')?.dataset.entry==='play');await cold.evaluate(()=>window.dispatchEvent(new Event('touchmove')));expect(await cold.locator('.rh-arrival').getAttribute('data-entry')).toBe('play');report.openingTouch='pass: ordinary touchmove does not complete opening';await cold.close();
 try{const safari=await webkit.launch();report.webkit={status:'engine available; NOT native Safari certification'};await safari.close();}catch(e){report.webkit={status:'unavailable',reason:String(e).slice(0,1800)};}
 expect(report.errors).toEqual([]);report.status='passed';
}catch(e){report.status='failed';report.failure=String(e);throw e;}finally{await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,modes:report.modes.length,effects:report.effects.length,failure:report.failure}));}
