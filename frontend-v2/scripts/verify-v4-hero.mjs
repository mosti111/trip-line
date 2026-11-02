import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base = process.env.QA_URL || 'http://localhost:3003';
const out = path.resolve(process.env.QA_OUT || '../tmp/frontend-qa/v4-hero/after');
fs.mkdirSync(out, {recursive:true});
const report = {status:'running',startedAt:new Date().toISOString(),base,browser:'Chromium headless',cases:[],errors:[],stimulus:[],artifacts:[]};
const browser = await chromium.launch({headless:true});
report.browserVersion=browser.version();
const sizes = [[1920,1080],[1440,900],[390,844],[844,390]];
const modes = ['normal','reduced','saveData','noJS','noWebGL'];
const selected = process.env.QA_V4_QUICK ? [['en',1440,900,'normal'],['ar',390,844,'normal'],['tr',390,844,'normal']] : [
 ...['en','ar','tr'].flatMap(locale=>sizes.map(([w,h])=>[locale,w,h,'normal'])),
 ...['en','ar','tr'].flatMap(locale=>modes.slice(1).map(mode=>[locale,mode==='noWebGL'?1440:390,mode==='noWebGL'?900:844,mode])),
 ['ar',1440,900,'reduced'],['en',844,390,'reduced']
];
async function capture(page,name){const file=path.join(out,name+'.png');await page.screenshot({path:file});return file;}
async function state(page){return page.evaluate(()=>{const a=document.querySelector('.rh-arrival'),h=document.querySelector('h1');return {entry:a.dataset.entry,mode:document.querySelector('.recovery-home').dataset.homeMotion,pinStart:Number(a.dataset.pinStart),pinEnd:Number(a.dataset.pinEnd),progress:a.dataset.motionProgress,stage:a.dataset.motionStage,route:document.querySelector('.rh-continuous-route')?.style.visibility,bronze:{...document.querySelector('.bronze-journey')?.dataset},title:getComputedStyle(h.querySelector('.rh-title-block')).transform,ink:getComputedStyle(h.querySelector('.rh-title-ink')).transform,photo:getComputedStyle(document.querySelector('.rh-arrival-photo')).transform,animations:a.getAnimations({subtree:true}).filter(x=>x.playState==='running').map(x=>x.animationName||'GSAP'),overflow:document.documentElement.scrollWidth-innerWidth,cls:window.__v4cls||0};});}
try{
 if(!process.env.QA_V4_QUICK){
  const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/en',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.rh-arrival')?.dataset.entry==='play');
  report.load={observedAt:await page.evaluate(()=>performance.now()),frames:[]};
  for(const [name,delay] of [['start',0],['early',180],['overlap',420],['settled',1100]]){await page.waitForTimeout(delay);report.load.frames.push({name,...await state(page),at:await page.evaluate(()=>performance.now())});await capture(page,'desktop-load-'+name);}
  report.load.errors=errors;expect(errors).toEqual([]);const video=page.video();await context.close();fs.renameSync(await video.path(),path.join(out,'desktop-load-1440x900.webm'));
  const focusContext=await browser.newContext({viewport:{width:1440,height:900}}),focusPage=await focusContext.newPage();
  await focusPage.goto(base+'/en',{waitUntil:'domcontentloaded'});await focusPage.waitForFunction(()=>document.querySelector('.rh-arrival')?.dataset.entry==='play');
  const action=focusPage.locator('.rh-arrival-copy a').first();await action.focus();await expect(action).toBeFocused();
  report.earlyFocus=await state(focusPage);expect(report.earlyFocus.entry).toBe('done');expect(await action.evaluate(n=>getComputedStyle(n.parentElement).clipPath)).toBe('none');
  await capture(focusPage,'desktop-early-keyboard-focus');await focusContext.close();
 }
 for(const [locale,width,height,mode] of selected){
  const name=`${locale}-${width}x${height}-${mode}`;const touch=width<1024;
  const record=mode==='normal'&&((locale==='en'&&(width===1440||width===390))||(locale==='ar'&&width===1440));
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,javaScriptEnabled:mode!=='noJS',reducedMotion:mode==='reduced'?'reduce':'no-preference',...(record?{recordVideo:{dir:out,size:{width,height}}}:{})});
  await context.addInitScript(({mode})=>{
   if(mode==='saveData')Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}});
   if(mode==='noWebGL'){const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};}
   window.__v4cls=0;window.__v4trace=[];
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__v4cls+=e.value;}).observe({type:'layout-shift',buffered:true});
   let first=0,previous=0;
   const frame=()=>{const a=document.querySelector('.rh-arrival'),photo=a?.querySelector('.rh-photo-settle'),ink=a?.querySelector('.rh-title-ink');if(a&&photo&&ink){if(!first)first=performance.now();if(performance.now()-previous>40){previous=performance.now();window.__v4trace.push({t:performance.now(),entry:a.dataset.entry,photo:getComputedStyle(photo).transform,ink:getComputedStyle(ink).transform,actions:getComputedStyle(a.querySelector('.rh-actions')).clipPath,animations:a.getAnimations({subtree:true}).filter(x=>x.playState==='running').map(x=>x.animationName).filter(Boolean)});}}if(!first||performance.now()-first<3500)requestAnimationFrame(frame);};requestAnimationFrame(frame);
  },{mode});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(base+'/'+locale,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  if(mode!=='noJS')await expect.poll(()=>page.locator('.rh-arrival').getAttribute('data-entry'),{timeout:15000}).toBe('done');
  await page.waitForTimeout(400);
  if(mode==='noWebGL'){await expect(page.locator('.recovery-home')).toHaveAttribute('data-home-motion','desktop');await page.waitForTimeout(1200);}
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  await expect.poll(()=>page.locator('.rh-arrival-photo img').evaluate(n=>n.complete&&n.naturalWidth>0),{timeout:15000}).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow').toBe(true);
  const lineBoxes=await page.locator('.rh-title-block').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),ink=n.firstElementChild.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(n.firstElementChild);return{width:r.width,height:r.height,inkWidth:ink.width,inkHeight:ink.height,textLines:range.getClientRects().length,left:r.left,right:r.right};}));
  expect(lineBoxes.length).toBe(2);for(const line of lineBoxes){expect(line.left).toBeGreaterThanOrEqual(-1);expect(line.right).toBeLessThanOrEqual(width+1);expect(line.inkHeight).toBeLessThan(line.height);expect(line.textLines,name+' one unbroken line per mask').toBe(1);}
  for(const link of await page.locator('.rh-arrival-copy a').all()){await expect(link).toBeVisible();expect(await link.getAttribute('href')).toMatch(new RegExp('^/'+locale+'/'));}
  const initial=await state(page);expect(initial.cls,name+' CLS').toBeLessThan(.1);
  await capture(page,name+'-opening');const result={name,locale,width,height,mode,input:touch?'touch/coarse':'mouse/fine',initial,lineBoxes,checks:['one H1, connected whole lines, bounds, native links, no overflow, CLS<0.1'],trace:mode==='noJS'?[]:await page.evaluate(()=>({frames:window.__v4trace,paint:performance.getEntriesByType('paint').map(x=>({name:x.name,startTime:x.startTime}))}))};
  if(mode==='normal'){
   expect(initial.entry).toBe('done');expect(initial.animations.filter(name=>name.startsWith('rh-'))).toEqual([]);
   const trace=result.trace.frames;expect(trace.some(f=>f.animations.includes('rh-photo-arrive')),name+' timed entrance observed').toBe(true);
   const playing=trace.filter(f=>f.entry==='play');expect(playing.some(f=>f.photo!=='none'&&f.ink!=='none')).toBe(true);
   if(!touch){
    expect(initial.mode).toBe('desktop');expect(initial.pinEnd-initial.pinStart).toBeCloseTo(height*(height>=900?1.05:height>=700?.95:.85),0);
    await expect(page.locator('.ribbon-ready canvas')).toBeVisible();
    const end=initial.pinEnd;
    const samples=[];for(const p of [.15,.35,.55,.75,.9,.97,1]){for(let i=1;i<=8;i++){const from=samples.length?samples.at(-1).p:0;await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),end*(from+(p-from)*i/8));await page.waitForTimeout(45);}await page.waitForTimeout(450);samples.push({p,...await state(page)});await capture(page,name+'-forward-'+Math.round(p*100));}
    await expect(page.locator('.rh-worlds')).toHaveAttribute('data-handoff-state','graphic');expect(samples.at(-1).route).toBe('visible');
    await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),end+height*.55);await page.waitForTimeout(500);await capture(page,name+'-service-handoff');
    for(let i=25;i>=0;i--){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),(end+height*.55)*i/25);await page.waitForTimeout(60);}await page.waitForTimeout(600);
    const reverse=await state(page);expect(Number(reverse.progress)).toBeLessThan(.001);expect(reverse.route).toBe('hidden');expect(reverse.title).toBe('matrix(1, 0, 0, 1, 0, 0)');await capture(page,name+'-reverse');result.samples=samples;result.reverse=reverse;result.checks.push('shortened measured pin, dimensional canvas, actual slow forward/reverse, matched graphic endpoint and restored copy');
   }else{expect(initial.mode).toBe('native');expect(await page.locator('.pin-spacer').count()).toBe(0);expect(await page.locator('canvas').count()).toBe(0);await page.evaluate(()=>scrollTo({top:600,behavior:'instant'}));await page.waitForTimeout(400);await capture(page,name+'-native-scroll');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));}
  }else if(mode!=='noWebGL'){
   expect(initial.mode).toBeUndefined();expect(await page.locator('.pin-spacer,canvas').count()).toBe(0);expect(initial.animations).toEqual([]);result.checks.push('static native complete fallback');
  }else{expect(await page.locator('.rh-sculpture').isVisible()).toBe(true);result.checks.push('deliberate WebGL failure retains SVG and useful content');}
  if(locale==='en'&&width===1440&&mode==='normal'){
   const action=page.locator('.rh-arrival-copy a').first();await action.focus();await expect(action).toBeFocused();expect(await action.evaluate(n=>getComputedStyle(n).outlineStyle)).not.toBe('none');await capture(page,name+'-focus');
   await page.evaluate(()=>{localStorage.setItem('tripline-motion','reduced');dispatchEvent(new Event('tripline-preference'));});await page.waitForTimeout(500);expect(await page.locator('.pin-spacer,canvas').count()).toBe(0);expect((await state(page)).entry).toBe('done');
   await page.evaluate(()=>{localStorage.removeItem('tripline-motion');dispatchEvent(new Event('tripline-preference'));});await page.waitForTimeout(800);expect((await state(page)).entry).toBe('done');expect((await state(page)).animations).toEqual([]);
   await action.click();await page.waitForURL('**/destinations/turkiye');expect(await page.locator('.pin-spacer,.rh-continuous-route').count()).toBe(0);expect(await page.evaluate(()=>document.documentElement.dataset.lenisCount)).toBeUndefined();result.checks.push('visible keyboard focus, reduction cleanup, no entrance replay, discover action/navigation cleanup');
  }
  const expected=mode==='noWebGL'?errors.filter(e=>/WebGL|THREE|Error creating|context/i.test(e)):[];report.stimulus.push(...expected.map(message=>({name,message})));const unexpected=errors.filter(e=>!expected.includes(e));report.errors.push(...unexpected.map(message=>({name,message})));expect(unexpected,name+' unexpected runtime errors').toEqual([]);
  report.cases.push(result);if(record){const video=page.video();await context.close();const source=await video.path();const target=path.join(out,name+'.webm');fs.renameSync(source,target);}else await context.close();
  console.log('PASS',name);
 }
 report.status='PASS';
}catch(error){report.status='FAIL';report.failure=String(error.stack||error);console.error(report.failure);process.exitCode=1;}
finally{
 await browser.close();report.finishedAt=new Date().toISOString();
 for(const name of fs.readdirSync(out)){if(!/\.(png|webm)$/.test(name))continue;const file=path.join(out,name),bytes=fs.readFileSync(file);report.artifacts.push({name,path:file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(report.status,report.cases.length,'cases',report.errors.length,'errors');
}
