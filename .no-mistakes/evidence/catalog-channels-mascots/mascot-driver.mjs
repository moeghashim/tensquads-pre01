import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const evidence='/Users/moeghashim/.no-mistakes/evidence/01M7603WCPCCWCGH3D2FV6MANT';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const results=[];
async function run(name,fn){try {results.push({name,result:'pass',...await fn()});}catch(e){results.push({name,result:'fail',error:e.message});}console.log(JSON.stringify(results.at(-1)));}
await run('Public design cards show Alexandria, Venice and expanded Pisa copy',async()=>{
 await page.goto('http://localhost:4287/design/');
 await page.locator('a[href="#mascots"]').first().click();
 await expect(page.locator('.mcard')).toHaveCount(13);
 for(const name of ['Alexandria','Venice']) {
  const card=page.getByRole('article',{name:`${name} mascot card`});
  await expect(card).toBeVisible(); await expect(card.getByRole('img')).toBeVisible();
  await card.locator('..').locator('..').screenshot({path:`${evidence}/${name.toLowerCase()}-design-1440.png`});
 }
 const pisa=page.getByRole('article',{name:'Pisa mascot card'});
 await expect(pisa).toContainText('Pisa takes orders from every channel, carries them out of the door and handles returns.');
 await pisa.screenshot({path:`${evidence}/pisa-design-1440.png`});
 return {cards:13,pisa:await pisa.innerText()};
});
await run('Public asset download links return real images in every advertised format',async()=>{
 const links=await page.locator('.mc').filter({has:page.getByRole('heading',{name:/^(Alexandria|Venice)$/})}).locator('.dl a').evaluateAll(a=>a.map(x=>({label:x.textContent,url:x.href})));
 if(links.length!==10)throw new Error(`Expected 10 links, got ${links.length}`);
 const downloads=[];
 for(const link of links){const response=await fetch(link.url); const bytes=Buffer.from(await response.arrayBuffer()); const type=response.headers.get('content-type'); if(!response.ok)throw new Error(`${response.status} ${link.url}`); if(!/image\//.test(type??''))throw new Error(`Not image ${type}`); downloads.push({...link,status:response.status,type,bytes:bytes.length});}
 await writeFile(`${evidence}/downloads.json`,JSON.stringify(downloads,null,2)); return {downloads};
});
await run('App character review renders both new mascots and updated Pisa description',async()=>{
 await page.goto('http://localhost:4287/review/characters');
 await expect(page.locator('.mate')).toHaveCount(13);
 for(const [name,role,line] of [['Alexandria','Catalog','Keeps every product, title, photo, variant and price correct.'],['Venice','Channels','Lists the products on every sales channel and keeps stock and prices in step.'],['Pisa','Orders','Takes orders from every channel, ships them and handles returns.']]){
  const card=page.locator('.mate').filter({has:page.locator('b',{hasText:new RegExp(`^${name}$`)})});
  await expect(card).toContainText(role);await expect(card).toContainText(line);await expect(card.getByRole('img',{name:`${name}, ${role}`})).toBeVisible();
 }
 await page.locator('.cast').screenshot({path:`${evidence}/character-roster-1440.png`}); return {cards:13};
});
await run('New cards remain readable at 390px without horizontal page scroll',async()=>{
 await page.setViewportSize({width:390,height:844});
 const widths=[];
 for(const path of ['/design/','/review/characters']){
  await page.goto('http://localhost:4287'+path);
  if(path==='/design/')await page.locator('a.stat[href="#mascots"]').click();
  const width=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
  widths.push({path,...width});if(width.content>width.viewport)throw new Error(JSON.stringify(widths));
  for(const name of ['Alexandria','Venice']){
   const card=path==='/design/'?page.getByRole('article',{name:`${name} mascot card`}):page.locator('.mate').filter({has:page.locator('b',{hasText:new RegExp(`^${name}$`)})});
   await card.scrollIntoViewIfNeeded();await card.screenshot({path:`${evidence}/${name.toLowerCase()}-${path==='/design/'?'design':'review'}-390.png`});
  }
 }return {widths};
});
await writeFile(`${evidence}/live-results.json`,JSON.stringify({results,errors},null,2));
await browser.close();
