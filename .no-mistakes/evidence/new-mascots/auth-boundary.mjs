import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(process.cwd()+'/package.json');
const {chromium}=require('@playwright/test');
const out='/Users/moeghashim/.no-mistakes/evidence/01M6XSJJKXC5697CFJ8TX5440W';
const b=await chromium.launch();
const rows=[];
try {
 const p=await b.newPage();
 for(const route of ['/agents','/chat','/admin/images']){
  await p.goto('http://localhost:3000'+route);await p.waitForURL('**/signin');
  rows.push({requested:route,actual:new URL(p.url()).pathname,heading:await p.locator('h1').allTextContents()});
 }
 await p.goto('http://localhost:3000/signup');
 await p.getByRole('button',{name:/A new business/}).click();
 await p.getByRole('button',{name:'Choose my squads'}).click();
 await p.getByRole('button',{name:'Create my workspace'}).click();
 await p.getByLabel('Email').fill('mascot-local@example.com');
 await p.getByLabel('Password').fill('DisposableLocalOnly42!');
 await p.getByRole('button',{name:'Create my workspace'}).click();
 await p.waitForTimeout(500);
 rows.push({requested:'Create workspace',actual:new URL(p.url()).pathname,alerts:await p.getByRole('alert').allTextContents(),accountFormVisible:await p.getByLabel('Email').isVisible(),note:'No Clerk keys configured; submission remains on account form.'});
 await p.screenshot({path:out+'/signup-auth-unavailable.png',fullPage:true});
 await writeFile(out+'/auth-boundary.json',JSON.stringify(rows,null,2));
 console.log(JSON.stringify(rows,null,2));
}finally{await b.close();}
