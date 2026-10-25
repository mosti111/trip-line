import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve(process.env.QA_OUT||'../tmp/frontend-qa/v1-mobile/before');
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report=[];
for(const locale of ['en','tr','ar'])for(const width of [320,390,768]){
 const page=await browser.newPage({viewport:{width,height:width===768?1024:844},hasTouch:true,isMobile:true});
 await page.goto((process.env.QA_URL||'http://localhost:3010')+'/'+locale,{waitUntil:'networkidle'});
 await page.waitForTimeout(1500);
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,65));}scrollTo(0,0)});
 await page.waitForTimeout(300);
 await page.screenshot({path:path.join(out,`${locale}-${width}-full.png`),fullPage:true});
 const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.body.scrollHeight,headings:[...document.querySelectorAll('main h1,main h2,main h3')].filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.textContent,box:{x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height},font:getComputedStyle(e).fontSize})),overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left< -2)&&getComputedStyle(e).position!=='absolute'&&!e.closest('.v61-billboard-track,.flight-trace,.v6-country-stage,svg');}).slice(0,30).map(e=>({class:e.className,text:e.textContent?.slice(0,70),x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width}))}));
 report.push({locale,width,...geometry}); console.log(locale,width,geometry.scrollWidth,geometry.height);await page.close();
}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();
