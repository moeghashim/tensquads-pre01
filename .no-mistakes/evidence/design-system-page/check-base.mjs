import assert from 'node:assert/strict';
import {existsSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
assert(!existsSync('apps/landing/public/design/index.html'));
const b=await chromium.launch();
try{
const p=await b.newPage();await p.goto('http://127.0.0.1:8799/review/',{waitUntil:'networkidle'});
assert.equal(await p.locator('a[href="/design/"]').count(),0);
assert.equal(await p.getByRole('heading',{name:'tensquads review',exact:true}).count(),1);
await p.screenshot({path:'/Users/moeghashim/.no-mistakes/evidence/01M6XBNSKWR2TJ9NJGSGXZTK7A/review-base.png'});
writeFileSync('/Users/moeghashim/.no-mistakes/evidence/01M6XBNSKWR2TJ9NJGSGXZTK7A/base-result.json',JSON.stringify({result:'pass',live:true,scenario:'Build older ref without design system: omit design page and review card, retain working review index'},null,2));
}finally{await b.close()}
