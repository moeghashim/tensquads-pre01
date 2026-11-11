import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const dir='/Users/moeghashim/.no-mistakes/evidence/01M7603WCPCCWCGH3D2FV6MANT';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try {
 await p.goto('http://localhost:4288/signup');
 await p.waitForFunction(()=>Array.from(document.querySelectorAll('button')).some(x=>Object.keys(x).some(k=>k.startsWith('__reactProps$'))));
 const choices=[];
 for(const kind of [/A new business/,/An existing business/]){
 await p.getByRole('button',{name:kind}).click();
 await p.getByRole('button',{name:'Choose my squads'}).click();
 await expect(p.locator('[data-handler="a.toggle"]')).toHaveCount(7);
 await expect(p.getByRole('button',{name:/Alexandria/})).toHaveCount(0);
 await expect(p.getByRole('button',{name:/Venice/})).toHaveCount(0);
 await expect(p.getByRole('button',{name:/^Pisa/})).toBeVisible();
 choices.push({kind:String(kind),choices:await p.locator('[data-handler="a.toggle"]').allTextContents()});
 await p.screenshot({path:`${dir}/signup-${choices.length===1?'new':'existing'}-squads.png`,fullPage:true});
 await p.getByRole('button',{name:'Back',exact:true}).click();
 await p.getByRole('button',{name:'Back',exact:true}).click();
 }
 await writeFile(`${dir}/signup-choices.json`,JSON.stringify({result:'pass',choices,errors},null,2));console.log(JSON.stringify({result:'pass',choices,errors}));
}catch(e){console.log(JSON.stringify({result:'fail',error:e.message,errors}));await p.screenshot({path:`dir/signup-failure.png`.replace('dir',dir),fullPage:true});}finally{await b.close()}
