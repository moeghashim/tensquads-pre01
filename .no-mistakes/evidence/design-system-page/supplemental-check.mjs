import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const {chromium,expect}=createRequire(process.cwd()+'/package.json')('@playwright/test');
const dir='/Users/moeghashim/.no-mistakes/evidence/01M6X9NKGDG0KASFKX80SGMY01';
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const page=await context.newPage();
const records=[];
for(const name of ['Components','Colour','Type']){
 await page.goto('http://localhost:8791/design/');
 await page.getByRole('link',{name,exact:true}).click();
 const y=await page.evaluate(()=>scrollY);
 await page.waitForTimeout(2500);
 const after=await page.evaluate(()=>scrollY);
 assert.ok(Math.abs(y-after)<2,`${name} moved from ${y} to ${after}`);
 records.push({section:name,initialScroll:y,afterLazyPreviews:after});
 await page.screenshot({path:dir+'/cold-navigation-'+name+'.png'});
}
await page.goto('http://localhost:8791/design/agent-ui/previews/CommandPalette.html');
await page.getByRole('textbox',{name:'Search commands'}).fill('Classify');
await expect(page.getByRole('option')).toHaveCount(1);
await page.getByRole('textbox',{name:'Search commands'}).press('Enter');
await expect(page.getByRole('dialog')).toHaveCount(0);
await page.reload(); await page.mouse.click(5,5); await expect(page.getByRole('dialog')).toHaveCount(0);
records.push({commandPalette:'Enter selects a matching command; backdrop dismisses'});
await page.goto('http://localhost:8791/design/agent-ui/previews/WorkflowCard.html');
await page.getByRole('button',{name:/actions/i}).first().click(); await expect(page.getByRole('menu').first()).toBeVisible();
await page.screenshot({path:dir+'/workflow-menu-open.png'});
records.push({workflowCard:'Actions button opens menu; previously declined dismissal behavior excluded'});
await page.goto('http://localhost:8791/design/');
const links=await page.locator('.dl a').evaluateAll(es=>es.map(e=>e.href));
const downloads=[];
for(let i=0;i<links.length;i+=5){
 downloads.push(...await Promise.all(links.slice(i,i+5).map(async url=>{const r=await context.request.get(url); return {url,status:r.status(),type:r.headers()['content-type'],bytes:(await r.body()).length};})));
}
for(const d of downloads){assert.equal(d.status,200,d.url);assert.ok(d.bytes>0,d.url);assert.match(d.type,/image\//,d.url);}
records.push({mascotDownloads:downloads});
writeFileSync(dir+'/supplemental-results.json',JSON.stringify(records,null,2));
console.log(JSON.stringify(records));
await browser.close();
