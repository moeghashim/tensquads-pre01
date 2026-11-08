import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(process.cwd() + '/package.json');
const { chromium, expect } = require('@playwright/test');
const evidence = '/Users/moeghashim/.no-mistakes/evidence/01M6X9NKGDG0KASFKX80SGMY01';
const origin = 'http://localhost:8791';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [], failedLocal = [], results = [], shots = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if(r.url().startsWith(origin) && r.status() >= 400 && !r.url().includes('favicon')) failedLocal.push({ url:r.url(),status:r.status() }); });
async function scenario(name, fn) { try { const detail = await fn(); results.push({name,result:'pass',live:true,detail}); } catch(e) { results.push({name,result:'fail',live:true,detail:String(e.stack)}); } console.log(JSON.stringify(results.at(-1))); }
async function shot(name, locator) { const path = evidence+'/'+name+'.png'; await (locator || page).screenshot({path}); shots.push(name); }
await scenario('Review visitor opens the design system and direct routes serve the page with review headers', async()=>{
 const r = await context.request.get(origin+'/design', { maxRedirects:0 }); assert.equal(r.status(),301); assert.equal(new URL(r.headers().location).pathname,'/design/');
 await page.goto(origin+'/review/'); await page.getByRole('link',{name:/Design system.*ten squad mascots/}).click();
 await expect(page).toHaveURL(origin+'/design/'); await expect(page.getByRole('heading',{name:'tensquads design system',exact:true})).toBeVisible();
 const r2 = await context.request.get(origin+'/design/'); assert.equal(r2.status(),200); assert.equal(r2.headers()['x-robots-tag'],'noindex, nofollow'); assert.equal(r2.headers()['x-content-type-options'],'nosniff');
 assert.equal(await page.locator('.mc').count(),10); await shot('design-desktop');
 return {redirect:r.headers().location,status:r2.status(),robots:r2.headers()['x-robots-tag'],mascots:await page.locator('.mcard-name').allTextContents()};
});
let previews=[];
await scenario('Reader scrolls all component previews and opens every standalone example without runtime or asset failures',async()=>{
 previews=await page.locator('iframe').evaluateAll(es=>es.map(e=>({title:e.title,url:e.src})));
 assert.equal(previews.length,28);
 for(const p of previews){ const el=page.locator('iframe').filter({hasNot:page.locator('unused')}); const frameEl=page.locator('iframe[title="'+p.title+'"]'); await frameEl.scrollIntoViewIfNeeded(); const frame=await frameEl.contentFrame(); await expect(frame.locator('#stage > *')).not.toHaveCount(0); }
 const previewPage=await context.newPage();
 for(const p of previews){ const r=await previewPage.goto(p.url); assert.equal(r.status(),200); await expect(previewPage.locator('#stage > *')).not.toHaveCount(0); await previewPage.screenshot({path:evidence+'/preview-'+p.title.split(' ')[0]+'.png'}); shots.push('preview-'+p.title.split(' ')[0]); }
 await previewPage.close(); assert.deepEqual(errors,[]); assert.deepEqual(failedLocal,[]);
 return {previews:previews.map(p=>p.title),errors,failedLocal};
});
await scenario('Reader navigates reference sections and uses embedded command search without moving the surrounding page',async()=>{
 await page.goto(origin+'/design/'); await page.getByRole('link',{name:'Components',exact:true}).click(); await expect(page).toHaveURL(/#components$/);
 const element=page.locator('iframe[title="CommandPalette preview"]'); await element.scrollIntoViewIfNeeded();
 const cp=page.frameLocator('iframe[title="CommandPalette preview"]'); await expect(cp.getByRole('textbox',{name:'Search commands'})).toBeVisible();
 const y=await page.evaluate(()=>scrollY); const input=cp.getByRole('textbox',{name:'Search commands'});
 await input.fill('Guardrails'); await expect(cp.getByRole('option')).toHaveCount(2); await input.press('ArrowDown'); await expect(cp.getByRole('option').nth(1)).toHaveAttribute('aria-selected','true');
 await input.fill('no-such-node-xyz'); await expect(cp.getByText('No matches',{exact:true})).toBeVisible(); await input.press('ArrowDown'); await input.press('ArrowUp'); await input.press('Enter'); await expect(cp.getByRole('dialog')).toBeVisible();
 assert.ok(Math.abs(await page.evaluate(()=>scrollY)-y)<=1,'iframe search scrolled outer document');
 await shot('embedded-command-search',page.locator('#c-CommandPalette'));
 await input.press('Escape'); await expect(cp.getByRole('dialog')).toHaveCount(0);
 for(const name of ['Colour','Type','Spacing','Radius','Shadow','Motion']){ await page.getByRole('link',{name,exact:true}).click(); await expect(page.locator(new URL(page.url()).hash)).toBeVisible(); }
 await shot('reference-type',page.locator('#type'));
 return {embeddedSearch:'filter, no matches, arrow keys, Enter on empty list, Escape',outerScrollUnchanged:true,sections:['Components','Colour','Type','Spacing','Radius','Shadow','Motion']};
});
await scenario('User toggles enabled switches with mouse and keyboard while a disabled switch stays off and segmented choices stay exclusive',async()=>{
 await page.goto(origin+'/design/agent-ui/previews/Switch.html'); const on=page.getByRole('switch',{name:'Include chat history'}); await expect(on).toHaveAttribute('aria-checked','true'); await on.click(); await expect(on).toHaveAttribute('aria-checked','false'); await on.press('Space'); await expect(on).toHaveAttribute('aria-checked','true'); await expect(page.getByRole('switch',{name:'Disabled'})).toBeDisabled(); await expect(page.getByRole('switch',{name:'Disabled'})).toHaveAttribute('aria-checked','false');
 await shot('switch-state'); await page.goto(origin+'/design/agent-ui/previews/SegmentedControl.html'); await page.getByRole('button',{name:'Preview mode',exact:true}).click(); await expect(page.getByRole('button',{name:'Preview mode',exact:true})).toHaveAttribute('aria-pressed','true'); await expect(page.getByRole('button',{name:'Edit mode',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Pan',exact:true}).press('Space'); await expect(page.getByRole('button',{name:'Pan',exact:true})).toHaveAttribute('aria-pressed','true'); await expect(page.getByRole('button',{name:'Select',exact:true})).toHaveAttribute('aria-pressed','false'); return 'Mouse and keyboard update state; disabled and independent groups retain their boundaries';
});
await scenario('User flips the preview theme and sees the saved theme after reload and on another preview',async()=>{
 await page.goto(origin+'/design/agent-ui/previews/ThemeToggle.html'); await expect(page.locator('html')).toHaveAttribute('data-theme','light'); await page.getByRole('button',{name:'Toggle theme'}).click(); await expect(page.locator('html')).toHaveAttribute('data-theme','dark'); await shot('theme-dark'); await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme','dark'); await page.goto(origin+'/design/agent-ui/previews/Dashboard.html'); await expect(page.locator('html')).toHaveAttribute('data-theme','dark'); await shot('dashboard-dark'); return 'Dark theme persists across reload and Dashboard navigation';
});
await scenario('Mobile reader browses all reference sections at 390 px without page-wide horizontal scrolling',async()=>{
 await page.setViewportSize({width:390,height:844}); await page.goto(origin+'/design/'); await shot('design-mobile');
 const overflow = await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth})); assert.ok(overflow.document<=overflow.viewport,JSON.stringify(overflow));
 for(const p of previews){ await page.locator('iframe[title="'+p.title+'"]').scrollIntoViewIfNeeded(); }
 for(const id of ['components','data-display','colour','type','spacing','radius','shadow','motion']){ await page.locator('#'+id).scrollIntoViewIfNeeded(); const size=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth})); assert.ok(size.document<=size.viewport,id+':'+JSON.stringify(size)); }
 await page.locator('#components').scrollIntoViewIfNeeded(); await shot('components-mobile'); return overflow;
});
writeFileSync(evidence+'/results.json',JSON.stringify({results,errors,failedLocal,shots},null,2));
writeFileSync(evidence+'/gallery.html','<!doctype html><meta charset="utf-8"><title>Live design system evidence</title><style>body{font:16px system-ui;margin:24px}img{max-width:100%;border:1px solid #ddd}section{margin:32px 0}</style><h1>Design system: live Chromium evidence</h1>'+shots.map(s=>'<section><h2>'+s+'</h2><a href="'+s+'.png"><img loading="lazy" src="'+s+'.png"></a></section>').join(''));
await browser.close();
if(results.some(r=>r.result==='fail'))process.exitCode=1;
