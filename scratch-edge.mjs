import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
const dir=process.argv[2], col=+(process.argv[3]||1300)
const files=(await readdir(dir)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
for(const f of files){
  const {data,info}=await sharp(path.join(dir,f)).raw().toBuffer({resolveWithObject:true})
  const {width:W,height:H,channels:C}=info
  let last=-1, first=-1
  for(let y=0;y<H;y++){
    const i=(y*W+col)*C
    const r=data[i],g=data[i+1],b=data[i+2]
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b)
    const sat=mx===0?0:(mx-mn)/mx
    if(sat>0.12){ if(first<0)first=y; last=y }
  }
  console.log(`${f}  x=${col}  firstColored=${first}  lastColored=${last}`)
}
