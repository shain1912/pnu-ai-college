import sharp from 'sharp'
import path from 'node:path'
// args: dir out left top w h cols label... frames
const [dir,out,L,T,W,H,COLS,...frames]=process.argv.slice(2)
const l=+L,t=+T,w=+W,h=+H,cols=+COLS
const tiles=[]
for(let i=0;i<frames.length;i++){
  const f=frames[i]
  const body=await sharp(path.join(dir,`${f}.png`)).extract({left:l,top:t,width:w,height:h}).toBuffer()
  const label=Buffer.from(`<svg width="${w}" height="24"><rect width="100%" height="100%" fill="#000"/><text x="6" y="17" font-family="monospace" font-size="15" fill="#0f0">${f}</text></svg>`)
  const withLabel=await sharp({create:{width:w,height:h+24,channels:3,background:'#000'}})
    .composite([{input:label,top:0,left:0},{input:body,top:24,left:0}]).png().toBuffer()
  tiles.push({input:withLabel,left:(i%cols)*w,top:Math.floor(i/cols)*(h+24)})
}
const rows=Math.ceil(frames.length/cols)
await sharp({create:{width:w*cols,height:(h+24)*rows,channels:3,background:'#000'}})
  .composite(tiles).jpeg({quality:88}).toFile(out)
console.log('→',out)
