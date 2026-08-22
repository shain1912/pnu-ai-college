import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('console', m => { if (m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,200)); });
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message.slice(0,200)));
await p.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const info = await p.evaluate(() => {
  const root = document.getElementById('root');
  return {
    rootLen: root ? root.innerHTML.length : -1,
    totalEls: document.querySelectorAll('*').length,
    bodyText: (document.body.innerText||'').slice(0,300),
  };
});
console.log(JSON.stringify(info,null,1));
console.log('CONSOLE:', JSON.stringify(errs.slice(0,15),null,1));
await p.screenshot({ path: 'C:/Users/shain/AppData/Local/Temp/claude/E--testFront/61bc7dc9-5d88-43b9-ab50-0978e7a2ca75/scratchpad/home.png', fullPage: false });
await b.close();
