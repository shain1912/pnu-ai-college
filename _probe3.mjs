import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:1000} });
await p.goto('http://localhost:4199/', {waitUntil:'networkidle'});
await p.waitForTimeout(800);
// primary CTA
const cta = p.locator('a:has-text("AI대학 살펴보기")').first();
const before = await cta.evaluate(e=>{const c=getComputedStyle(e);return{bg:c.backgroundColor,r:c.borderRadius,dur:c.transitionDuration,ease:c.transitionTimingFunction};});
await cta.hover(); await p.waitForTimeout(400);
const after = await cta.evaluate(e=>{const c=getComputedStyle(e);return{bg:c.backgroundColor,r:c.borderRadius};});
console.log('CTA before',before,'after',after);
// pill badge
const pill = await p.locator('span.rounded-\[--radius-pill\]').first().evaluate(e=>{const c=getComputedStyle(e);const r=e.getBoundingClientRect();return{r:c.borderRadius,h:Math.round(r.height),bg:c.backgroundColor};}).catch(e=>'ERR '+e.message);
console.log('PILL',pill);
// door card
const door = await p.locator('a.rounded-\[--radius-xl\]').first().evaluate(e=>{const c=getComputedStyle(e);return{r:c.borderRadius,bg:c.backgroundColor,dur:c.transitionDuration};}).catch(e=>'ERR');
console.log('DOOR',door);
await p.screenshot({path:'E:/testFront/_shot_hero.png', clip:{x:340,y:150,width:760,height:520}});
// schools page
await p.goto('http://localhost:4199/ai-college/schools',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
const grid = await p.evaluate(()=>{
  const ul=document.querySelector('ul.grid');
  const lis=[...ul.querySelectorAll(':scope > li')];
  const cs=getComputedStyle(ul);
  return {cols:cs.gridTemplateColumns, gap:cs.gap, count:lis.length,
    boxes:lis.map(li=>{const r=li.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}),
    dls:lis.map(li=>{const d=li.querySelector('dl');const r=d.getBoundingClientRect();return Math.round(r.top);}),
    cards:lis.map(li=>{const a=li.querySelector('a');const c=getComputedStyle(a);return c.borderRadius;})
  };
});
console.log('SCHOOLS GRID', JSON.stringify(grid,null,1));
await p.screenshot({path:'E:/testFront/_shot_schools.png', fullPage:false});
await b.close();
