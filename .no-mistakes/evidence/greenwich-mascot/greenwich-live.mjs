import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:http';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const evidence='/Users/moeghashim/.no-mistakes/evidence/01M754E13T2TY0Q8C2Q7SACJNM';
const load=p=>import(pathToFileURL(`${root}/${p}`));
const {chromium,expect}=await load('node_modules/@playwright/test/index.mjs');
const {charactersPage}=await load('apps/landing/review-src/characters.mjs');
const {default:worker}=await load('apps/landing/src/index.js');
const {squadmateMarkup,SQUADMATE_CSS,AGENT_LOOP_STATES,characterName,shownRoleTag,UnknownSquadmateError,UnknownSquadmateStateError}=await load('packages/squadmates/src/index.ts');
// Run only the production review-page shell and character generator. The full
// review build also queries private GitHub repositories and builds unrelated pages.
const build=readFileSync(`${root}/apps/landing/build-review.mjs`,'utf8');
const shell=build.slice(build.indexOf('const page = '),build.indexOf('// Moe set the customer site domain'));
const pageShell=vm.runInNewContext(`${shell}\npage;`);
const review=pageShell('tensquads squadmates',charactersPage());
const states=['idle',...AGENT_LOOP_STATES.map(s=>s.id)];
const sizes=[16,24,32,48,63,64,96,112,256];
const grid=`<!doctype html><meta charset="utf-8"><title>Greenwich public renderer</title><style>body{font:14px system-ui;background:#fcfcfc;margin:24px}section{display:flex;gap:12px;align-items:end;flex-wrap:wrap}figure{margin:8px;text-align:center}h1{font-size:26px}</style>${SQUADMATE_CSS}<h1>Greenwich — Places</h1><p>Public squadmateMarkup API: states at 112 px</p><section>${states.map(s=>`<figure data-state="${s}">${squadmateMarkup('places',s,112)}<figcaption>${s}</figcaption></figure>`).join('')}</section><h2>Sizes and crop boundary</h2><section>${sizes.map(s=>`<figure data-size="${s}">${squadmateMarkup('places','idle',s)}<figcaption>${s} px</figcaption></figure>`).join('')}</section>`;
writeFileSync(`${evidence}/greenwich-review.html`,review);
writeFileSync(`${evidence}/greenwich-renderer.html`,grid);
const server=createServer(async(req,res)=>{
 try {
 const url=`http://127.0.0.1:${server.address().port}${req.url}`;
 let response;
 if(req.url==='/renderer') response=new Response(grid,{headers:{'content-type':'text/html'}});
 else response=await worker.fetch(new Request(url),{ASSETS:{fetch:async request=>new URL(request.url).pathname==='/review/characters.html'?new Response(review,{headers:{'content-type':'text/html'}}):new Response('Not found',{status:404})}});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500).end(String(e))}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch();
const report={url:`http://127.0.0.1:${server.address().port}`,review:[],renderer:{},errors:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',e=>report.errors.push(e.message));
 // Keep this isolated check independent of Google's font network availability.
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
 for(const width of [1440,390]){
 await page.setViewportSize({width,height:1000});
 const response=await page.goto(`${report.url}/review/characters`);
 assert.equal(response.status(),200);
 assert.equal(response.headers()['x-robots-tag'],'noindex, nofollow');
 await expect(page.locator('.mate')).toHaveCount(11);
 const card=page.locator('.mate').filter({has:page.getByText('Greenwich',{exact:true})});
 await expect(card).toHaveCount(1);
 await expect(card.getByRole('img',{name:'Greenwich, Places',exact:true})).toBeVisible();
 await expect(card.getByText('Places',{exact:true})).toBeVisible();
 await expect(card.getByText('Named after Greenwich, London',{exact:true})).toBeVisible();
 await expect(card.getByText('Keeps the business on Google Maps and the other maps.',{exact:true})).toBeVisible();
 const overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,card:[...document.querySelectorAll('.mate')].find(e=>e.querySelector('b').textContent==='Greenwich').getBoundingClientRect().toJSON()}));
 assert.ok(overflow.document<=width,JSON.stringify(overflow));
 await page.screenshot({path:`${evidence}/greenwich-review-${width}.png`,fullPage:true});
 await card.screenshot({path:`${evidence}/greenwich-card-${width}.png`});
 report.review.push({width,cardText:await card.innerText(),...overflow});
 }
 await page.setViewportSize({width:1440,height:1100});
 await page.goto(`${report.url}/renderer`);
 for(const state of states) await expect(page.locator(`[data-state="${state}"]`).getByRole('img',{name:state==='idle'?'Greenwich, Places':`Greenwich, Places, ${state}`,exact:true})).toBeVisible();
 for(const size of sizes){const box=await page.locator(`[data-size="${size}"] svg`).boundingBox();assert.equal(box.width,size);assert.equal(box.height,size);}
 const resolved=await page.locator('svg').evaluateAll(svgs=>svgs.every(svg=>[...svg.querySelectorAll('*')].every(el=>[...el.attributes].every(a=>{const m=/^url\(#(.+)\)$/.exec(a.value);return !m||!!document.getElementById(m[1]);}))));
 assert.equal(resolved,true);
 await page.screenshot({path:`${evidence}/greenwich-states-sizes.png`,fullPage:true});
 report.renderer={states,sizes,gradientReferencesResolved:resolved,characterName:characterName('places'),roleTag:shownRoleTag('places')};
 assert.equal(characterName('places'),'Greenwich');assert.equal(shownRoleTag('places'),'Places');
 assert.throws(()=>squadmateMarkup('places','asleep',64),UnknownSquadmateStateError);
 assert.throws(()=>squadmateMarkup('unknown','idle',64),UnknownSquadmateError);
 report.renderer.invalidInputs='Unknown state and unknown image rejected with typed errors';
 assert.deepEqual(report.errors,[]);
 writeFileSync(`${evidence}/greenwich-live-results.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
