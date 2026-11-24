const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const files=['index.html','first_task.html','second_task.html','third_task.html','fourth_task.html','decisions.html'];
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith('/notebook/')){res.writeHead(404).end();return;}
 const name=url.pathname.slice(10)||'index.html';
 if(!files.includes(name)&&!/^assets\/[\w.-]+$/.test(name)){res.writeHead(404).end();return;}
 const path='dist/'+name;
 if(!fs.existsSync(path)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html; charset=utf-8');
 res.end(fs.readFileSync(path));
});
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1280,390,320]){
  await page.setViewportSize({width,height:900});
  for(const file of files){
   await page.goto('http://127.0.0.1:4173/notebook/'+file);
   assert.equal(await page.locator('h1:visible').count(),1,file+' heading');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' overflow at '+width);
   if(file==='index.html') {
    await page.locator('#enter').press('Enter');
    assert(await page.locator('#headline').evaluate(el=>el===document.activeElement));
    await page.locator('#person').fill('Maya');
    await page.locator('#runner button').press('Enter');
    assert.equal(await page.locator('#result').innerText(),'Hello, Maya!');
    assert.match(await page.locator('#zoom').getAttribute('href'),/zoom.us/);
    assert.match(await page.locator('#drive').getAttribute('href'),/sharepoint.com/);
    await page.locator('#copy').click();
    await page.waitForFunction(() => document.querySelector('#copy-status').textContent.length > 0);
    await page.locator('.roadmap summary').first().click();
    assert(await page.locator('#stages details p').first().isVisible());
    assert.equal(await page.locator('#resources input, #resources form').count(),0);
   } else if(file==='first_task.html'){
    await page.evaluate(()=>localStorage.removeItem('cql_m1_checkpoint'));
    await page.reload();
    await page.locator('.opt').nth(1).click();
    assert.match(await page.locator('#explainBox').innerText(),/Try again/);
    await page.locator('.opt').first().click();
    await page.locator('#nextBtn').click();
    await page.reload();
    assert.match(await page.locator('#qCounter').innerText(),/Question 2/);
   }
   else if(file==='second_task.html'){await page.locator('#go').click();await page.locator('.boxv .lab').click();assert(await page.locator('#next').isEnabled());await page.locator('#next').click();}
   else if(file==='decisions.html'){assert(await page.getByText(/Mission 05.*Coming soon/).isVisible());}
   else {await page.locator('.lvbtn').first().click();await page.locator('#hintBtn').click();assert(await page.locator('#hb').isVisible());const answer=page.locator('#area button').first();if(await answer.count())await answer.click();}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' exercise overflow at '+width);
   if(file !== 'index.html'){await page.getByRole('link',{name:'Back to missions'}).click();assert.equal(new URL(page.url()).hash,'#missions');assert(!(await page.locator('#welcome').isVisible()));assert.equal(await page.locator('#list .cleared').count(),4);}
   console.log(width+'px '+file+': layout and interaction passed');
  }
 }
 await page.evaluate(()=>{for(const [key,value] of Object.entries({cql_best_score:8,cql_m2plus_best:9,cql_m3:[1,1,1,1,1],cql_m5:{s:[1,1,1,1,1],p:[1,1,1,1,1]}}))localStorage.setItem(key,JSON.stringify(value));});
 await page.goto('http://127.0.0.1:4173/notebook/');
 await page.locator('#enter').click();
 assert.equal(await page.locator('#progress').innerText(),'4 of 5 missions complete');
 assert.equal(await page.locator('#print').count(),0);
 await page.getByRole('link',{name:'Preview mission'}).click();
 assert(page.url().endsWith('/decisions.html'));
 assert.deepEqual(errors,[]);console.log('No browser script errors.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
