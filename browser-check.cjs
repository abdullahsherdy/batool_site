const {chromium}=require('C:/Users/TempAdmin/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const files=['index.html','first_task.html','second_task.html','third_task.html','fourth_task.html'];
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.slice(1)||'index.html');if(!files.includes(name)&&name!=='styles.css'){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',name.endsWith('css')?'text/css':'text/html; charset=utf-8');res.end(fs.readFileSync(name));});
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1280,390,320]){
  await page.setViewportSize({width,height:900});
  for(const file of files){
   await page.goto('http://127.0.0.1:4173/'+file);
   assert.equal(await page.locator('h1').count(),1,file+' heading');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' overflow at '+width);
   if(file==='index.html') {await page.locator('summary').first().click();assert(await page.locator('details').first().getAttribute('open')!==null);}
   else if(file==='first_task.html'){await page.locator('#startBtn').click();await page.locator('.opt').first().click();assert(await page.locator('#nextBtn').isEnabled());await page.locator('#nextBtn').click();}
   else if(file==='second_task.html'){await page.locator('#go').click();await page.locator('.boxv .lab').click();assert(await page.locator('#next').isEnabled());await page.locator('#next').click();}
   else {await page.locator('.lvbtn').first().click();await page.locator('#hintBtn').click();assert(await page.locator('#hb').isVisible());const answer=page.locator('#area button').first();if(await answer.count())await answer.click();}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' exercise overflow at '+width);
   console.log(width+'px '+file+': layout and interaction passed');
  }
 }
 await page.setViewportSize({width:1280,height:960});await page.goto('http://127.0.0.1:4173/');await page.screenshot({path:'preview-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/fourth_task.html');await page.screenshot({path:'preview-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('No browser script errors.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
