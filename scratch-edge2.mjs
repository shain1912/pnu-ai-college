import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
const dir=process.argv[2]
const cols=[900,1000,1150,1400]
const YMAX=760
const files=(await readdir(dir)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
for(const f of files){
  const {data,info}=await sharp(path.join(dir,f)).raw().toBuffer({resolveWithObject:true})
  const {width:W,channels:C}=info
  const out=cols.map(col=>{
    let last=-1
    for(let y=0;y<YMAX;y++){
      const i=(y*W+col)*C
      const r=data[i],g=data[i+1],b=data[i+2]
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b)
      if(mx>0&&(mx-mn)/mx>0.15) last=y
    }
    return `x${col}:${String(last).padStart(4)}`
  }).join('  ')
  console.log(`${f}  ${out}`)
}
