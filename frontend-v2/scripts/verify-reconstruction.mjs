import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.QA_URL||'http://localhost:3003';
const out=path.resolve('../tmp/v3-reconstruction/qa');fs.mkdirSync(out,{recursive:true});
const report={status:'running',base,cases:[],checks:[],errors:[]};
const browser=await chromium.launch();
async function align(page,selector){
 for(let i=0;i<2;i++){await page.locator(selector).first().evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top,behavior:'instant'}));await page.waitForTimeout(900);}
}
try{
 for(const locale of ['ar','tr','en'])for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1280,900],[1440,1000]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<768,isMobile:width<768});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(base+'/'+locale,{waitUntil:'networkidle'});await page.waitForTimeout(700);
  await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  const stages={hero:'.home-hero',services:'#service-worlds',entrance:'.turkey-entrance',explorer:'.turkey-atlas',story:'.editorial-story',planner:'.journey-builder',arrival:'.final-arrival'};
  for(const [name,selector] of Object.entries(stages)){
   await align(page,selector);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${locale}/${width}/${name} overflow`).toBe(true);
   if([390,768,1440].includes(width))await page.screenshot({path:path.join(out,`${locale}-${width}-${name}.png`)});
  }
  const worlds=page.locator('.world-choices button');await worlds.nth(2).click();await expect(worlds.nth(2)).toHaveAttribute('aria-pressed','true');
  const places=page.locator('.turkey-atlas .country-index button');await expect(places).toHaveCount(12);
  await places.last().click();await expect(places.last()).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.explorer-image[data-active=true] img')).toHaveAttribute('alt',locale==='ar'?'كابادوكيا':locale==='tr'?'Kapadokya':'Cappadocia');
  const builder=page.locator('.journey-builder');await builder.locator('input[value=istanbul]').check();await builder.locator('input[value=antalya]').check();
  await expect(builder.locator('input[name=journey]')).toHaveValue('istanbul,antalya');await expect(builder.locator('.builder-preview>span')).toHaveText('02');
  if([390,1440].includes(width)){await align(page,'.builder-route');await page.screenshot({path:path.join(out,`${locale}-${width}-planner-selected.png`)});}
  await page.locator('.menu-button').click();await expect(page.locator('.nav-dialog')).toBeVisible();
  await page.locator('.dialog-footer>a').last().focus();await page.keyboard.press('Tab');
  if(!await page.evaluate(()=>!!document.activeElement?.closest('dialog')))report.errors.push(`${locale}/${width}: Tab escaped the modal`);
  await page.keyboard.press('Escape');await expect(page.locator('.menu-button')).toBeFocused();
  expect(await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src))).toEqual([]);
  report.cases.push({locale,width,height,input:width<768?'touch':'fine',motion:'normal'});console.log(`${locale} ${width}×${height}: chapter checks complete`);await page.close();
 }
 for(const locale of ['ar','tr','en']){
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
  await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('.ribbon canvas')).toHaveCount(0);
  await expect(page.locator('.departure-copy')).toHaveCSS('opacity','1');
  await page.locator('.world-choices button').last().click();await expect(page.locator('.world-choices button').last()).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:path.join(out,`${locale}-reduced-services.png`)});
  report.cases.push({locale,width:1440,height:1000,motion:'reduced'});await page.close();
 }
 report.checks.push('All seven major chapters at six exact required viewports in EN/TR/AR; touch selection, planner state, modal focus trap/restoration, image integrity and reduced-motion departure');
 expect(report.errors).toEqual([]);report.status='passed';
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));}
