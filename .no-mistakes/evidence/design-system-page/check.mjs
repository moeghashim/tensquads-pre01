import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import picomatch from 'picomatch';
const evidence='/Users/moeghashim/.no-mistakes/evidence/01M6XBNSKWR2TJ9NJGSGXZTK7A';
const base='http://127.0.0.1:8799';
const report=[];
const git=(...args)=>execFileSync('git',args);
const before=JSON.parse(git('show','93f7dc8:.fallowrc.json'));
const after=JSON.parse(readFileSync('.fallowrc.json'));
assert.deepEqual(after,{...before,ignorePatterns:[...before.ignorePatterns,'docs/design-system/**']});
const ignores=picomatch(after.ignorePatterns);
const files=git('ls-tree','-r','--name-only','6320169','docs/design-system').toString().trim().split('\n');
assert(files.every(p=>ignores(p)));
for(const p of ['docs/other/page.js','apps/web/src/example.ts','packages/domain/src/example.ts']) assert(!ignores(p));
report.push({scenario:'Fallow config semantics',result:'pass',live:false,details:`All ${files.length} copied files match the exclusion. Adjacent docs, web and domain paths remain in scope. All other configuration values are unchanged. Fallow itself was not run because static analysis is forbidden in this phase.`});
for(const path of ['/design','/design/','/review/','/design/missing-file.js']){
 const r=await fetch(base+path,{redirect:'manual'});
 const status=path==='/design'?301:path.includes('missing')?404:200;
 assert.equal(r.status,status,path);
 if(path==='/design')assert.equal(r.headers.get('location'),base+'/design/');
 else {assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.equal(r.headers.get('cache-control'),'no-cache');}
 report.push({path,status:r.status,location:r.headers.get('location'),robots:r.headers.get('x-robots-tag')});
}
for(const file of files){
 const r=await fetch(base+'/design/'+file.slice('docs/design-system/'.length));
 assert.equal(r.status,200,file);
 const actual=Buffer.from(await r.arrayBuffer());
 assert.deepEqual(actual,git('show',`6320169:${file}`),file);
}
report.push({scenario:'Build and Worker serve every copied file without byte changes',result:'pass',live:true,files:files.length});
const browser=await chromium.launch();
try{
const context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage(); const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/review/',{waitUntil:'networkidle'});
await page.locator('a.card[href="/design/"]').click();
await page.waitForURL(base+'/design/');
await page.screenshot({path:evidence+'/design-desktop.png',fullPage:false});
assert.equal(await page.locator('nav[aria-label="Sections"] a').count(),10);
await page.getByRole('link',{name:'Components',exact:true}).click();
await page.locator('#c-Switch').scrollIntoViewIfNeeded();
const frame=page.frameLocator('iframe[title="Switch preview"]');
const sw=frame.getByRole('switch').first();
await sw.waitFor();
const initial=await sw.getAttribute('aria-checked');await sw.click();assert.notEqual(await sw.getAttribute('aria-checked'),initial);
await page.screenshot({path:evidence+'/design-components.png'});
await page.locator('#c-Switch a.open').click();
await page.waitForURL('**/design/agent-ui/previews/Switch.html');
assert.equal(await page.getByRole('switch').count(),3);
const standalone=page.getByRole('switch').first();await standalone.focus();const checked=await standalone.getAttribute('aria-checked');await page.keyboard.press('Space');assert.notEqual(await standalone.getAttribute('aria-checked'),checked);
assert(await page.getByRole('switch').last().isDisabled());
report.push({scenario:'Review card opens design; section navigation, embedded preview and standalone preview work',result:'pass',live:true});
for(const file of files.filter(p=>p.includes('/previews/'))){
 await page.goto(base+'/design/'+file.slice('docs/design-system/'.length),{waitUntil:'domcontentloaded'});
 assert(await page.locator('#stage').evaluate(e=>e.children.length>0),file);
}
assert.deepEqual(errors,[]);
report.push({scenario:'Every copied component preview renders without uncaught script errors',result:'pass',live:true});
await page.setViewportSize({width:390,height:844});
await page.goto(base+'/design/',{waitUntil:'networkidle'});
await page.screenshot({path:evidence+'/design-mobile.png'});
const width=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
assert(width.content<=width.viewport,JSON.stringify(width));
report.push({scenario:'Design reference renders at 390 pixels without page overflow',result:'pass',live:true,...width});
}finally{await browser.close();writeFileSync(evidence+'/results.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
