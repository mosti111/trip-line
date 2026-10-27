import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split(/\r?\n/))];
const report = { status: 'pass', scope: 'All tracked and non-ignored Markdown: relative file/directory targets, excluding fenced examples, external URLs and anchor-only links. Heading fragments are not validated.', documents: 0, checked: 0, missing: [] };
for (const file of files) {
  if (!file.endsWith('.md') || !fs.existsSync(file)) continue;
  report.documents++;
  const source = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1].replace(/^<|>$/g, '');
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:|^#|^\//.test(target)) continue;
    const filename = decodeURIComponent(target.split('#')[0].split('?')[0]);
    report.checked++;
    if (!fs.existsSync(path.resolve(path.dirname(file), filename))) report.missing.push({ file, target });
  }
}
if (report.missing.length) { report.status = 'fail'; process.exitCode = 1; }
if (process.env.QA_DOC_OUT) {
  fs.mkdirSync(path.dirname(process.env.QA_DOC_OUT), { recursive: true });
  fs.writeFileSync(process.env.QA_DOC_OUT, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
