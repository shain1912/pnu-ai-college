#!/usr/bin/env node
/**
 * 색이 사이트 밖으로 나간 자산 셋을 다시 잡는다.
 *
 * 38회차에 자산 39장의 평균 색상각을 재보니 서른여섯 장이 209~232° 에 몰려
 * 있었다. 나머지 셋만 딴 데 있었다.
 *
 *   obj_gather_v    20°   채도 4%
 *   obj_outgrow_v  315°   채도 2%
 *   apex            27°   채도 3%
 *
 * 셋 다 스튜디오 렌더인데 **바탕이 따뜻한 크림색**이다. 물체(짙은 남색)는
 * 맞는데 바탕이 틀렸다. 흰 절 위에 얹으면 네모난 크림색 얼룩으로 읽힌다.
 * 클라이언트가 「에셋부터가 색감이 우리 사이트랑 안맞음」이라 한 것이 이것이다.
 *
 * 고치는 방법은 색상각을 돌리는 것이 아니다. 채도가 2~4% 라 돌려봐야 거의
 * 움직이지 않는다. 캐스트를 빼고(colorbalance) 밝기를 들어올려야(curves)
 * 바탕이 페이지의 흰색에 닿는다.
 *
 * 처음에는 모서리를 235 쯤에서 멈췄다. 캐스트는 빠졌는데 **네모가 그대로
 * 남았다** — 235 와 페이지 흰색 255 는 눈에 보이는 차이라, 둥근 상자 테두리가
 * 그대로 드러났다. 얼룩이 회색 얼룩으로 바뀌었을 뿐이다.
 *
 * 그래서 바탕을 255 까지 밀어 페이지에 붙였다. 남는 것은 물체와 그 그림자뿐이고
 * 상자는 사라진다. 세 자산 다 흰 자리에 놓이므로(FactSheetScene·BreatherScene 은
 * bg-canvas, ApexScene 은 흰 .card 안) 이렇게 해야 맞다.
 *
 * 곡선은 자산마다 다르다. 원본 모서리 밝기가 140 / 197 / 193 으로 제각각이라
 * 같은 곡선을 걸면 하나는 모자라고 하나는 물체까지 날아간다.
 *
 * 합격 기준:
 *   - 모서리 = rgb(255,255,255)   상자 테두리가 페이지에서 보이지 않는다
 *   - 물체 색상각 205~235°        나머지 서른여섯 장과 같은 띠 안
 *
 *   node scripts/regrade.mjs [슬러그…]
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const CAST = 'colorbalance=rm=-0.12:gm=-0.03:bm=0.10:rh=-0.07:bh=0.06'

const JOBS = {
  obj_gather_v: {
    // 모서리가 140 으로 가장 어둡다. 가장 많이 들어올려야 한다.
    curve: "curves=all='0/0 0.32/0.28 0.46/1 1/1'",
    still: 'assets/raw/obj_gather.png',
    video: 'assets/video/obj_gather_v.mp4',
    width: 1120,
    posterWidth: 1120,
  },
  obj_outgrow_v: {
    // 물체가 rgb(28,33,54) 로 거의 검정이다. 그림자 쪽을 먼저 들어
    // 남색으로 읽히게 한 다음 바탕을 흰색까지 민다.
    curve: "curves=all='0/0 0.12/0.18 0.42/0.62 0.62/1 1/1'",
    still: 'assets/raw/obj_outgrow.png',
    video: 'assets/video/obj_outgrow_v.mp4',
    width: 1120,
    posterWidth: 1120,
  },
  apex: {
    /*
     * 이 한 장만 마스터가 없다. assets/raw/apex.png 와 assets/video/apex.mp4 는
     * 둘 다 유리 다면체이고, 사이트에 나가 있는 apex@2x.webp 는 남색 분자다 —
     * 언젠가 갈아끼우면서 마스터가 남지 않았다. 나간 파일을 그대로 PNG 로
     * 떠서 assets/raw/apex_molecule.png 에 두고 거기서 굽는다. 이렇게 해야
     * 이 스크립트를 두 번 돌려도 두 번 물들지 않는다.
     */
    curve: "curves=all='0/0 0.2/0.22 0.48/0.72 0.66/1 1/1'",
    still: 'assets/raw/apex_molecule.png',
    video: null, // ApexScene 은 그림 한 장만 쓴다
    posterWidth: 1200,
  },
}

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })

/** 모서리와 물체를 재서 합격 기준을 그대로 찍는다. */
const probe = async (file) => {
  const meta = await sharp(file).metadata()
  const at = async (left, top, width, height) => {
    const buf = await sharp(file).extract({ left, top, width, height }).png().toBuffer()
    const { channels } = await sharp(buf).stats()
    return channels.slice(0, 3).map((c) => Math.round(c.mean))
  }
  const edge = await at(6, 6, 28, 28)
  const body = await at(Math.round(meta.width / 2) - 30, Math.round(meta.height * 0.55), 60, 30)
  const hue = ([r, g, b]) => {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
    if (!d) return 0
    const h = mx === r ? 60 * ((((g - b) / d) % 6 + 6) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4)
    return Math.round(h)
  }
  return { edge, body, white: edge.every((c) => c === 255), bodyHue: hue(body) }
}

const only = process.argv.slice(2)
for (const [slug, job] of Object.entries(JOBS)) {
  if (only.length && !only.includes(slug)) continue
  const grade = `${CAST},${job.curve}`

  const poster = `public/img/${slug}@2x.webp`
  const before = existsSync(poster) ? await probe(poster) : null

  // 포스터 — 원본 스틸에서 다시 뽑는다
  const buf = execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', job.still,
    '-vf', `${grade},scale=${job.posterWidth}:-2`,
    '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1',
  ], { maxBuffer: 1 << 28 })
  await sharp(buf).webp({ quality: 82, effort: 5 }).toFile(poster)

  /*
   * 영상 — 마스터에서 다시 인코딩한다. 이미 나간 파일에 또 거는 것보다 깨끗하다.
   *
   * 여기서 encode-loops.mjs 와 두 가지가 다르고, 둘 다 이유가 같다. 곡선이
   * 바탕을 들어올리면서 원본에서는 어둠에 묻혀 있던 렌더 그레인까지 같이
   * 드러난다. 그대로 굽었더니 webm 이 59KB → 275KB, 4.6배가 됐다.
   *
   *   hqdn3d   들린 그레인만 지운다. 물체 윤곽은 건드리지 않는다.
   *   crf 40   매끈한 그러데이션과 덩어리 하나뿐이라 34 까지 쓸 자리가 없다.
   *
   * 둘을 합쳐 65KB. 프레임을 꺼내 봐도 띠가 지지 않는다.
   */
  if (job.video) {
    const vf = `${grade},hqdn3d=3:2:4:6,scale=${job.width}:-2`
    ff(['-i', job.video, '-an', '-vf', vf, '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0',
        '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `public/video/${slug}.webm`])
    ff(['-i', job.video, '-an', '-vf', vf, '-c:v', 'libx264', '-crf', '25', '-preset', 'slow',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `public/video/${slug}.mp4`])
  }

  const after = await probe(poster)
  const show = (s) => (s ? `모서리 rgb(${s.edge})${s.white ? ' = 페이지 흰색' : ''} · 물체 ${s.bodyHue}°` : '—')
  const pass = after.white && after.bodyHue >= 205 && after.bodyHue <= 235
  console.log(`${slug}\n  전 ${show(before)}\n  후 ${show(after)}  ${pass ? '통과' : '미달'}`)
}
