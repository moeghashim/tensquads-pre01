import {createServer} from 'node:http';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=process.cwd();
const out='/Users/moeghashim/.no-mistakes/evidence/01M6XSJJKXC5697CFJ8TX5440W';
const require=createRequire(root+'/package.json');
const {chromium}=require('@playwright/test');
const {charactersPage}=await import(root+'/apps/landing/review-src/characters.mjs');
const {SQUADMATES,AGENT_LOOP_STATES,SQUADMATE_CSS,squadmateMarkup}=await import(root+'/packages/squadmates/src/index.ts');
const states=['idle',...AGENT_LOOP_STATES.map(s=>s.id)];
const matrix=SQUADMATES.map(m=>`<section><h2>${m.name}</h2>${states.map(s=>`<div>${squadmateMarkup(m.id,s,80)}<p>${s}</p></div>`).join('')}</section>`).join('');
const sizes=[16,24,32,48,63,64,96,112];
const boundary=SQUADMATES.map(m=>`<section><h2>${m.name}</h2>${sizes.map(n=>`<div>${squadmateMarkup(m.id,'idle',n)}<p>${n}px</p></div>`).join('')}</section>`).join('');
const wrap=body=>`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:15px system-ui;background:#fcfcfc;color:#282828;margin:24px}main{max-width:980px;margin:auto}section{display:flex;align-items:center;border-bottom:1px solid #ddd;gap:12px;padding:12px}section h2{width:90px;font-size:16px}section div{text-align:center;min-width:85px}section p{font-size:12px}</style>${SQUADMATE_CSS}<main>${body}</main></html>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(wrap(req.url==='/matrix'?matrix:req.url==='/sizes'?boundary:charactersPage()));});
await new Promise(r=>server.listen(3001,'127.0.0.1',r));
const browser=await chromium.launch({args:['--font-render-hinting=none','--disable-font-subpixel-positioning','--force-color-profile=srgb']});
const results=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(const [route,file,count] of [['/review/characters','characters-1440.png',49],['/matrix','all-states.png',100],['/sizes','size-boundaries.png',80]]) {
  await page.goto('http://127.0.0.1:3001'+route);
  const rendered=await page.locator('svg[role=img]').count();
  assert.equal(rendered,count,route);
  assert.equal(await page.locator('parsererror').count(),0);
  await page.screenshot({path:out+'/'+file,fullPage:true});
  results.push({route,rendered,screenshot:file});
 }
 await page.goto('http://127.0.0.1:3001/matrix');
 const labels=await page.locator('svg').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
 for(const m of SQUADMATES) for(const s of states) assert(labels.includes(`${m.name}, ${m.role}${s==='idle'?'':', '+s}`));
 const animations=await page.locator('.sm-blink').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).animationName));
 assert(animations.every(n=>n==='none'));
 await page.emulateMedia({reducedMotion:'no-preference'});
 assert.equal(await page.locator('.sm-blink').first().evaluate(n=>getComputedStyle(n).animationName),'sm-blink');
 results.push({check:'All 100 accessible names; reduced motion stops blink; normal motion enables blink',pass:true});
 await page.goto('http://127.0.0.1:3001/sizes');
 const dimensions=await page.locator('svg').evaluateAll(ns=>ns.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
 dimensions.forEach((b,i)=>assert.deepEqual(b,{w:sizes[i%8],h:sizes[i%8]}));
 results.push({check:'All 80 avatar boxes preserve requested size, including 63/64 crop boundary',pass:true});
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://localhost:3000/');
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('a,button')).some(n=>Object.keys(n).some(k=>k.startsWith('__reactProps$'))));
  assert.equal(await page.locator('#squad .roster svg').count(),8);
  await page.screenshot({path:out+`/home-${width}.png`,fullPage:true,animations:'disabled'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto('http://localhost:3000/signup');
  await page.getByRole('button',{name:/A new business/}).click();
  await page.getByRole('button',{name:'Choose my squads'}).click();
  await page.getByText("3 squads and Petra's squad will be created.").waitFor();
  await page.screenshot({path:out+`/signup-squads-${width}.png`,fullPage:true,animations:'disabled'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  results.push({check:`Homepage and signup squads render without horizontal overflow at ${width}px`,pass:true});
 }
 assert.deepEqual(errors,[]);
 await writeFile(out+'/live-results.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
} finally {await browser.close();await new Promise(r=>server.close(r));}
