import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
const dir = process.argv[2]
const files = (await readdir(dir)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
let prev = null, prevName=null
for (const f of files) {
  const {data, info} = await sharp(path.join(dir,f)).raw().toBuffer({resolveWithObject:true})
  if (prev) {
    // region stats: divide into grid 6x4
    const W=info.width,H=info.height,C=info.channels
    const gx=6,gy=4
    const sums=Array.from({length:gy},()=>Array(gx).fill(0))
    const cnts=Array.from({length:gy},()=>Array(gx).fill(0))
    let total=0, changed=0
    for(let y=0;y<H;y+=2){
      for(let x=0;x<W;x+=2){
        const i=(y*W+x)*C
        const d=Math.abs(data[i]-prev[i])+Math.abs(data[i+1]-prev[i+1])+Math.abs(data[i+2]-prev[i+2])
        const cx=Math.min(gx-1,Math.floor(x/W*gx)), cy=Math.min(gy-1,Math.floor(y/H*gy))
        sums[cy][cx]+=d; cnts[cy][cx]++
        total++; if(d>12) changed++
      }
    }
    const grid = sums.map((row,ri)=>row.map((s,ci)=>(s/cnts[ri][ci]).toFixed(1).padStart(6)).join('')).join('\n')
    console.log(`--- ${prevName} -> ${f}   changed>${12}: ${(changed/total*100).toFixed(1)}%`)
    console.log(grid)
  }
  prev=data; prevName=f
}
