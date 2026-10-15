const { chromium, expect } = require('../../../frontend-v2/node_modules/@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve('docs/qa/2026-10-04-orchestration');
fs.mkdirSync(out, {recursive:true});
(async()=>{
 const browser = await chromium.launch({headless:true});
 const report = {purpose:'Orchestration evidence workflow only; no frontend aesthetic approval', base:process.env.QA_URL || 'http://localhost:3033', revision:'13b5afecde31cb0078c7980da2055a3b3edbaba8',cases:[],errors:[]};
 try {
  for (const [name,width,height,locale,touch,reduced] of [
   ['desktop',1440,1000,'en',false,false],['laptop',1280,800,'tr',false,false],
   ['tablet',768,1024,'en',true,false],['mobile-rtl',390,844,'ar',true,false],
   ['reduced',1440,1000,'en',false,true]]) {
   const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,reducedMotion:reduced?'reduce':'no-preference'});
   page.on('pageerror',e=>report.errors.push(e.message));
   await page.goto(report.base+'/'+locale,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('h1')).toBeVisible();
   await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
   if(name==='desktop')await expect(page.locator('.opening-pinned')).toHaveCount(1);
   const states=name==='desktop'?[0,.25,.5,.75,1]:[0];
   const start=await page.locator('.opening').evaluate(el=>el.getBoundingClientRect().top+scrollY);
   for(const progress of states){
    await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+height*1.3*progress);
    await page.waitForTimeout(1100);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const file=`${name}-${Math.round(progress*100)}.png`;
    await page.screenshot({path:path.join(out,file)});
    report.cases.push({file,width,height,locale,touch,reduced,openingProgress:progress,actualScrollY:await page.evaluate(()=>scrollY)});
   }
   if(reduced){await expect(page.locator('.pin-spacer')).toHaveCount(0);await expect(page.locator('.ribbon canvas')).toHaveCount(0);}
   await page.close();
  }
  expect(report.errors).toEqual([]); report.status='passed';
 }catch(error){report.status='failed';report.failure=String(error);throw error;}
 finally{fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify(report,null,2));await browser.close();}
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
