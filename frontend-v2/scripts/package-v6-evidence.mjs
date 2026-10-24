import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const evidence=path.join(root,'docs/qa/2026-10-24-v6');
const release=path.join(evidence,'P4/release');
const sources={matrix:'v6-release-final',public:'v6-public-release-cache',v3:'v6-v3-release-cache'};
const input=key=>path.join(root,'tmp/frontend-qa',sources[key]);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const matrix=read(path.join(input('matrix'),'report.json'));
const publicReport=read(path.join(input('public'),'production-check.json'));
const v3=read(path.join(input('v3'),'verification.json'));
const axe=read(path.join(evidence,'P4/accessibility.json'));
if(matrix.status!=='passed'||matrix.cases.length!==36||matrix.recordings.length!==2||publicReport.status!=='passed'||publicReport.routes.length!==120||v3.status!=='passed'||axe.length!==9||axe.some(item=>item.violations.length))throw Error('Required release results are incomplete or failed');
fs.mkdirSync(release,{recursive:true});
for(const [key,reportName] of [['matrix','report.json'],['public','production-check.json'],['v3','verification.json']]){
  const target=path.join(release,key);fs.mkdirSync(target,{recursive:true});
  for(const entry of fs.readdirSync(input(key),{withFileTypes:true})){
    if(entry.isFile()&&(entry.name.endsWith('.png')||entry.name===reportName))fs.copyFileSync(path.join(input(key),entry.name),path.join(target,entry.name));
  }
}
for(const recording of matrix.recordings){
  const name=recording.kind==='complete-desktop-wheel'?'desktop-wheel.webm':'arabic-touch.webm';
  fs.copyFileSync(recording.path,path.join(release,name));
}
fs.copyFileSync(path.join(evidence,'P4/accessibility.json'),path.join(release,'accessibility.json'));
const freeze=read(path.join(evidence,'P4/frozen-app.json'));
for(const item of freeze.changedApplicationFiles)item.sha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.path))).digest('hex');
freeze.build=fs.readFileSync(path.join(root,'frontend-v2/.next/BUILD_ID'),'utf8').trim();
freeze.verificationStatus='Core checks and release production public/V3/matrix/accessibility checks passed';
fs.writeFileSync(path.join(evidence,'P4/frozen-app.json'),JSON.stringify(freeze,null,2)+'\n');
const inventoryPath='frontend-v2/public/brand/network/inventory.json';
const logos=read(path.join(root,inventoryPath));
if(logos.records.length!==19)throw Error('Unexpected profile logo inventory');
const logoAssets=logos.records.map(item=>{const file='frontend-v2/public'+item.localAsset;return{path:file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),approval:item.publicationApprovalStatus};});
const manifest={generatedAt:new Date().toISOString(),build:freeze.build,branch:'codex/trip-line-v6',creativeAcceptance:'pending user review',publication:'not authorized',coverage:{matrixCases:matrix.cases.length,publicRoutes:publicReport.routes.length,v3Checks:v3.checks.length,accessibilitySurfaces:axe.length},logoInventory:{path:inventoryPath,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,inventoryPath))).digest('hex'),sourcePdfSha256:logos.sourceSha256,assets:logoAssets},files:[]};
function inventory(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())inventory(file);else if(file!==path.join(evidence,'manifest.json')){const data=fs.readFileSync(file);manifest.files.push({path:path.relative(root,file).replaceAll('\\','/'),bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});}}}
inventory(evidence);manifest.files.sort((a,b)=>a.path.localeCompare(b.path));
fs.writeFileSync(path.join(evidence,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({build:manifest.build,coverage:manifest.coverage,artifacts:manifest.files.length},null,2));
