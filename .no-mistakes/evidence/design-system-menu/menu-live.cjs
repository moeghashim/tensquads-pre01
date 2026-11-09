const { createRequire } = require('node:module');
const requireProject = createRequire(process.cwd() + '/package.json');
const { chromium, expect } = requireProject('playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const out = __dirname;
const results = [];
const errors = [];
const requests = [];
(async () => {
 const browser = await chromium.launch({headless:true});
 const context = await browser.newContext({viewport:{width:1440,height:1000}});
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 page.on('response', r => { if(r.status() >= 400) requests.push({status:r.status(),url:r.url()}); });
 const nav = page.locator('.side nav');
 const search = page.getByRole('searchbox', {name:'Search the menu'});
 const menu = page.getByRole('button',{name:'Open menu'});
 const shot = async name => { await page.waitForTimeout(300); await page.screenshot({path:path.join(out,name+'.png')}); };
 const run = async (name, fn) => {
  try { const detail = await fn();results.push({name,result:'pass',detail}); }
  catch(e){results.push({name,result:'fail',detail:e.message});await shot('failure-'+results.length);}
  console.log(JSON.stringify(results.at(-1)));
 };
 const visible = async title => {
  await expect(page.locator('.view:visible')).toHaveCount(1);
  await expect(page.locator('.view:visible h1')).toHaveText(title);
  await expect(page).toHaveTitle(title+' · tensquads design system');
 };
 await page.goto('http://127.0.0.1:8765/');
 await run('Desktop sidebar opens every foundation and component, renders previews, and preserves browser history',async()=>{
  await visible('Overview');await shot('desktop-overview');
  const foundations=[['colors','Colors'],['typography','Typography'],['spacing','Spacing'],['radius','Corner radius'],['shadows','Shadows'],['easing','Easing'],['duration','Duration'],['components','Components']];
  for(const [id,title] of foundations){await nav.locator('a[href="#'+id+'"]').click();await visible(title);await expect(nav.locator('a[href="#'+id+'"]')).toHaveAttribute('aria-current','page');}
  const components=await nav.locator('.subnav a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),name:e.textContent})));
  for(const c of components){
   await nav.locator('a[href="'+c.href+'"]').click();await visible(c.name);
   const frame=page.frameLocator('.view:visible iframe');
   await expect(frame.locator('body')).not.toBeEmpty();
   await expect(frame.locator('body')).toBeVisible();
   await expect(nav.locator('a[href="'+c.href+'"]')).toHaveAttribute('aria-current','page');
  }
  await nav.locator('a[href="#components/Switch"]').click();
  const switches=page.frameLocator('.view:visible iframe').getByRole('switch');
  const before=await switches.first().getAttribute('aria-checked');await switches.first().click();
  await expect(switches.first()).toHaveAttribute('aria-checked',before==='true'?'false':'true');
  await shot('desktop-switch-preview');await page.goBack();await visible(components.at(-1).name);await page.goForward();await visible('Switch');
  return {foundations:foundations.length,componentPreviews:components.length,switchToggled:true,historyRestoresView:true};
 });
 await run('Search filters nested navigation, opens a result with Enter, and recovers from no matches',async()=>{
  await search.fill('bUtToN');await expect(nav.locator('.subnav a:visible')).toHaveText(['Button']);
  await search.press('Enter');await visible('Button');await shot('desktop-search-button');
  await search.fill('zzzz-no-match');await expect(page.getByText('No match.',{exact:true})).toBeVisible();
  await search.press('Enter');await visible('Button');await shot('desktop-search-empty');
  await search.fill('');await expect(nav.locator('.main-nav > li:visible')).toHaveCount(10);
  return {caseInsensitive:true,nestedResult:true,emptySearchKeepsCurrentPage:true,clearRestoresMenu:true};
 });
 await run('Legacy and unknown fragment links resolve to usable design-system pages',async()=>{
  const aliases={mascot:'Mascots',principles:'Overview',colour:'Colors',type:'Typography',radius:'Corner radius',shadow:'Shadows',motion:'Easing','data-display':'Components','not-a-page':'Overview'};
  for(const [hash,title] of Object.entries(aliases)){await page.goto('http://127.0.0.1:8765/#'+hash);await visible(title);}
  return aliases;
 });
 await run('Mascot gallery renders all ten characters and exposes asset downloads',async()=>{
  await nav.locator('a[href="#mascots"]').click();await visible('Mascots');
  await expect(page.locator('.view:visible .mcard')).toHaveCount(10);
  await expect(page.locator('.view:visible .mcard svg')).toHaveCount(10);
  await expect(page.locator('.view:visible .dl a')).toHaveCount(50);
  await shot('desktop-mascots');return {mascotNames:await page.locator('.mcard-name').allTextContents(),downloadLinks:50};
 });
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:8765/#overview');
 await run('Mobile drawer opens with search focused, isolates page controls, and closes via Escape or scrim',async()=>{
  await expect(menu).toBeVisible();await shot('mobile-overview');
  await menu.click();await expect(search).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','true');
  await shot('mobile-drawer');
  await expect(page.locator('main')).toHaveJSProperty('inert',true);
  await expect(page.locator('.topbar')).toHaveJSProperty('inert',true);
  const focus=[];
  for(let i=0;i<16;i++){await page.keyboard.press('Tab');focus.push(await page.evaluate(()=>({tag:document.activeElement.tagName,inside:!!document.activeElement.closest('.side')})));}
  if(focus.some(x=>!x.inside&&x.tag!=='BODY'))throw Error('Tab reached covered page: '+JSON.stringify(focus));
  await page.keyboard.press('Escape');await expect(menu).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#side')).toHaveJSProperty('inert',true);
  for(let i=0;i<6;i++){await page.keyboard.press('Tab');if(await page.evaluate(()=>!!document.activeElement.closest('.side')))throw Error('Tab entered closed drawer');}
  await menu.click();await page.locator('.scrim').click({position:{x:370,y:400}});await expect(menu).toHaveAttribute('aria-expanded','false');
  return {searchFocusedOnOpen:true,coveredPageInert:true,tabStaysInDrawer:true,closedDrawerSkipped:true,escapeRestoresMenuFocus:true,scrimCloses:true};
 });
 await run('Mobile current-page links, brand, and same-result search dismiss the drawer without a hash change',async()=>{
  await page.goto('http://127.0.0.1:8765/#overview');await menu.click();await page.locator('.brand').click();await expect(menu).toHaveAttribute('aria-expanded','false');await visible('Overview');await shot('mobile-brand-dismissed');
  await menu.click();await nav.locator('a[href="#colors"]').click();await visible('Colors');await expect(menu).toHaveAttribute('aria-expanded','false');
  await menu.click();await nav.locator('a[href="#colors"]').click();await expect(menu).toHaveAttribute('aria-expanded','false');
  await menu.click();await search.fill('Colors');await search.press('Enter');await expect(menu).toHaveAttribute('aria-expanded','false');await visible('Colors');
  await shot('mobile-current-search-dismissed');
  return {brandAtOverviewCloses:true,currentColorsLinkCloses:true,currentSearchResultCloses:true};
 });
 await run('Responsive pages fit 390px and resizing an open drawer restores desktop navigation',async()=>{
  const widths=[];
  for(const hash of ['overview','colors','typography','spacing','radius','shadows','easing','duration','components','components/Button','mascots']){
   await page.goto('http://127.0.0.1:8765/#'+hash);
   const w=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));widths.push({hash,...w});
   if(w.page>w.viewport)throw Error('Horizontal page overflow: '+JSON.stringify(widths.at(-1)));
  }
  await shot('mobile-mascots');await menu.click();await page.setViewportSize({width:1440,height:1000});
  await expect(page.locator('#side')).toHaveJSProperty('inert',false);await expect(page.locator('main')).toHaveJSProperty('inert',false);
  await expect(page.locator('.scrim')).not.toBeVisible();await search.fill('');await nav.locator('a[href="#overview"]').click();await visible('Overview');
  await page.setViewportSize({width:390,height:844});await expect(page.locator('#side')).toHaveJSProperty('inert',true);
  return {widths,desktopNavigationRestored:true,mobileDrawerClosedOnReturn:true};
 });
 fs.writeFileSync(path.join(out,'menu-live-results.json'),JSON.stringify({results,errors,requests},null,2));
 await browser.close();
 if(results.some(r=>r.result==='fail')||errors.length||requests.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
