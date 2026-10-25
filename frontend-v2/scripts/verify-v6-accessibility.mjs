import { chromium, expect } from '@playwright/test';import fs from 'node:fs';import path from 'node:path';import { fileURLToPath } from 'node:url';
const out=process.env.QA_OUT?path.resolve(process.env.QA_OUT):fileURLToPath(new URL('../../docs/qa/2026-10-24-v6/P4/',import.meta.url));fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch();const report=[];
try{for(const [url,width] of [['/en',1440],['/ar',390],['/ar/about',390],['/en/contact',1440],['/ar/services/hajj-umrah',390],['/en/services/tours',1440],['/ar/business',390],['/ar/destinations/turkiye/rize-ayder',390],['/en/motion-lab',1440]]){
 const page=await browser.newPage({viewport:{width,height:900}});await page.goto((process.env.QA_URL||'http://localhost:3006')+url,{waitUntil:'networkidle'});await page.waitForTimeout(1450);
 const source=fs.readFileSync(process.env.AXE_PATH||fileURLToPath(new URL('../../tmp/v5/tools/node_modules/axe-core/axe.min.js',import.meta.url)),'utf8');
 await page.evaluate(source=>{const script=document.createElement('script');script.nonce=document.querySelector('script[nonce]')?.nonce||'';script.textContent=source;document.head.appendChild(script);},source);
 const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
 report.push({url,width,engine:result.testEngine,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});await page.close();
}expect(report.flatMap(r=>r.violations)).toEqual([]);}finally{fs.writeFileSync(path.join(out,'accessibility.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report.filter(r=>r.violations.length),null,2));}
