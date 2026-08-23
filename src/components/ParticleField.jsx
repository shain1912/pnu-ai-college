import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * three.js 캔버스 두 종류를 한 컴포넌트로 낸다.
 *
 *   wave    격자로 깔린 점들이 겹친 파동으로 오르내린다. 높이에 따라 색이 옅어진다.
 *   orbit   가운데 코어를 둘러싸고 노드들이 서로 다른 반경·속도로 돈다. 코어와
 *           노드 사이는 선으로 잇는다.
 *
 * ── 왜 캔버스인가 ────────────────────────────────────────────────────────
 * 이 페이지의 미디어는 전부 영상 아니면 사진이다. 같은 재질이 스물몇 화면
 * 이어지면 어느 화면도 도드라지지 않는다. 실시간으로 그려지는 면은 재질이
 * 다르고, 스크롤·포인터에 반응할 수 있어 "지금 움직이고 있다" 가 분명하다.
 *
 * ── 무게 ──────────────────────────────────────────────────────────────────
 * three 는 gzip 150KB 대다. 첫 화면에서 받으면 22회차에 2,754KB 까지 줄여둔
 * 첫 전송량이 도로 늘어난다. 그래서 화면에 들어올 때까지 import 하지 않는다.
 * 코드 분할은 번들러가 동적 import 를 보고 알아서 한다.
 *
 * ── 동작 줄이기 ──────────────────────────────────────────────────────────
 * 켜져 있으면 three 를 아예 받지 않고 한 장짜리 정지 배경을 그린다. 움직임을
 * 줄여 달라는 사람에게 60fps 캔버스를 돌릴 이유가 없고, 받을 이유는 더 없다.
 * ────────────────────────────────────────────────────────────────────────
 */

const PALETTE = {
  // index.css 의 브랜드 램프에서 그대로 가져왔다. 캔버스만 다른 파랑을 쓰면
  // 11회차에 맞춰둔 색이 다시 갈린다.
  deep: 0x0a1a33,
  base: 0x1b64da,
  bright: 0x3182f6,
  pale: 0x90c2ff,
}

export default function ParticleField({ kind = 'wave', className = '', nodes = [] }) {
  const reduced = useReducedMotion()
  const hostRef = useRef(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced || near) return
    const el = hostRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return setNear(true)
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && (setNear(true), io.disconnect()),
      { rootMargin: '60% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, near])

  useEffect(() => {
    if (!near || reduced) return
    let stop = () => {}
    let cancelled = false

    import('three').then((THREE) => {
      if (cancelled) return
      const host = hostRef.current
      if (!host) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      host.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

      const built = kind === 'orbit' ? buildOrbit(THREE, scene, camera) : buildWave(THREE, scene, camera)

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host
        if (!w || !h) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h, false)
        built.layout?.(camera.aspect)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      // 화면 밖에서는 돌리지 않는다. 스물몇 화면짜리 페이지에서 캔버스가
      // 계속 돌면 아래쪽을 읽는 동안 팬이 돈다.
      let visible = true
      const vis = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)), { threshold: 0 })
      vis.observe(host)

      let raf = 0
      const start = performance.now()
      const tick = (now) => {
        raf = requestAnimationFrame(tick)
        if (!visible || document.hidden) return
        built.update((now - start) / 1000)
        renderer.render(scene, camera)
      }
      raf = requestAnimationFrame(tick)
      setReady(true)

      stop = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        vis.disconnect()
        built.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      cancelled = true
      stop()
    }
  }, [near, reduced, kind])

  return (
    /*
      바깥 위치는 부르는 쪽이 정한다. 여기서 relative 를 붙여두면 호출부가
      넘긴 absolute inset-0 과 부딪혀 둘 중 나중에 선언된 쪽이 이긴다.
      실제로 높이가 0 이 되어 캔버스가 300x150 기본값으로 남았다.
    */
    <div className={className}>
      {/* 캔버스가 오기 전에도 같은 톤이 깔려 있어야 빈 상자가 안 보인다. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#050a14]"
        style={{
          backgroundImage:
            'radial-gradient(120% 90% at 50% 15%, rgba(49,130,246,0.28) 0%, rgba(10,26,51,0.5) 45%, rgba(5,10,20,1) 100%)',
        }}
      />
      <div
        ref={hostRef}
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
      {nodes.length > 0 && (
        /*
          좁은 화면에서는 표식을 감춘다. 자리를 비율로 박아뒀는데 390px 에서는
          그 비율이 아래 링크 목록과 같은 자리를 가리켜 상자 넷이 서로 겹쳤다.
          이름은 목록이 이미 말하므로 잃는 정보가 없다.
        */
        <ul className="pointer-events-none absolute inset-0 hidden md:block">
          {nodes.map((node) => (
            <li
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-pill)] border border-white/20 bg-[#0a1a33]/70 px-3 py-1.5 text-[12px] font-semibold text-white/90 backdrop-blur-sm md:text-[13px]"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
              {node.note && <span className="ml-2 font-medium text-white/55">{node.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── 파동 ─────────────────────────────────────────────────────────────── */
function buildWave(THREE, scene, camera) {
  const COLS = 96
  const ROWS = 64
  const SPAN = 44
  const count = COLS * ROWS
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  let i = 0
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      positions[i * 3] = (c / (COLS - 1) - 0.5) * SPAN
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * SPAN * 0.62
      i += 1
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: 0.13,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  scene.add(points)

  camera.position.set(0, 9.5, 21)
  camera.lookAt(0, 0, 0)

  const low = new THREE.Color(PALETTE.deep)
  const mid = new THREE.Color(PALETTE.base)
  const high = new THREE.Color(PALETTE.pale)
  const tmp = new THREE.Color()

  return {
    update(t) {
      const pos = geometry.attributes.position.array
      const col = geometry.attributes.color.array
      for (let n = 0; n < count; n += 1) {
        const x = pos[n * 3]
        const z = pos[n * 3 + 2]
        // 주기가 서로 안 맞는 파동 셋을 겹친다. 하나만 쓰면 결이 규칙적이어서
        // 이어붙인 타일처럼 보인다.
        const y =
          Math.sin(x * 0.28 + t * 0.75) * 1.15 +
          Math.sin(z * 0.34 - t * 0.55) * 0.95 +
          Math.sin((x + z) * 0.16 + t * 0.38) * 0.7
        pos[n * 3 + 1] = y

        const k = Math.min(1, Math.max(0, (y + 2.4) / 4.8))
        if (k < 0.5) tmp.copy(low).lerp(mid, k * 2)
        else tmp.copy(mid).lerp(high, (k - 0.5) * 2)
        col[n * 3] = tmp.r
        col[n * 3 + 1] = tmp.g
        col[n * 3 + 2] = tmp.b
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
      points.rotation.y = Math.sin(t * 0.06) * 0.12
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}

/* ── 궤도 ─────────────────────────────────────────────────────────────── */
function buildOrbit(THREE, scene, camera) {
  const group = new THREE.Group()
  scene.add(group)
  camera.position.set(0, 1.4, 15)
  camera.lookAt(0, 0, 0)

  const disposables = []
  const add = (obj) => {
    disposables.push(obj)
    return obj
  }

  // 배경 별. 코어만 있으면 공간의 깊이가 안 보인다.
  const dustCount = 900
  const dust = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i += 1) {
    const r = 12 + Math.random() * 22
    const a = Math.random() * Math.PI * 2
    const b = (Math.random() - 0.5) * Math.PI * 0.55
    dust[i * 3] = Math.cos(a) * Math.cos(b) * r
    dust[i * 3 + 1] = Math.sin(b) * r * 0.55
    dust[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r
  }
  const dustGeo = add(new THREE.BufferGeometry())
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3))
  const dustMat = add(
    new THREE.PointsMaterial({ size: 0.075, color: PALETTE.base, transparent: true, opacity: 0.5, depthWrite: false }),
  )
  group.add(new THREE.Points(dustGeo, dustMat))

  // 코어
  const coreGeo = add(new THREE.IcosahedronGeometry(1.85, 2))
  const coreMat = add(new THREE.MeshBasicMaterial({ color: PALETTE.bright, wireframe: true, transparent: true, opacity: 0.55 }))
  const core = new THREE.Mesh(coreGeo, coreMat)
  group.add(core)

  // 네 축이 서로 다른 반경·기울기·속도로 돈다. 같은 궤도에 두면 넷이 한 줄로
  // 겹쳐 보이는 순간이 생긴다.
  const ORBITS = [
    { radius: 4.6, tilt: 0.18, speed: 0.42, size: 0.42 },
    { radius: 6.1, tilt: -0.34, speed: -0.31, size: 0.36 },
    { radius: 7.6, tilt: 0.46, speed: 0.24, size: 0.32 },
    { radius: 9.2, tilt: -0.12, speed: -0.19, size: 0.28 },
  ]
  const movers = ORBITS.map((o, i) => {
    const geo = add(new THREE.SphereGeometry(o.size, 18, 14))
    const mat = add(new THREE.MeshBasicMaterial({ color: i === 0 ? PALETTE.pale : PALETTE.bright }))
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)

    const ringGeo = add(new THREE.RingGeometry(o.radius - 0.012, o.radius + 0.012, 128))
    const ringMat = add(
      new THREE.MeshBasicMaterial({ color: PALETTE.base, transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
    )
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2 + o.tilt
    group.add(ring)

    const lineGeo = add(new THREE.BufferGeometry())
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    const lineMat = add(new THREE.LineBasicMaterial({ color: PALETTE.bright, transparent: true, opacity: 0.28 }))
    group.add(new THREE.Line(lineGeo, lineMat))

    return { ...o, mesh, lineGeo, phase: (i / ORBITS.length) * Math.PI * 2 }
  })

  return {
    /*
      넓은 화면에서는 코어를 오른쪽 위로 밀어낸다. 가운데 두면 아래 네 장의
      카드가 정확히 그 자리를 덮어 코어 윗머리만 보인다. 좁은 화면은 카드가
      세로로 쌓이며 위쪽이 비므로 가운데가 맞다.
    */
    layout(aspect) {
      const wide = aspect > 1.25
      group.position.set(wide ? 6.2 : 0, wide ? 2.9 : 1.2, 0)
      group.scale.setScalar(wide ? 0.78 : 0.62)
    },
    update(t) {
      core.rotation.y = t * 0.16
      core.rotation.x = Math.sin(t * 0.22) * 0.16
      for (const m of movers) {
        const a = m.phase + t * m.speed
        const x = Math.cos(a) * m.radius
        const z = Math.sin(a) * m.radius
        const y = Math.sin(a) * m.radius * Math.tan(m.tilt) * 0.55
        m.mesh.position.set(x, y, z)
        const p = m.lineGeo.attributes.position.array
        p[3] = x
        p[4] = y
        p[5] = z
        m.lineGeo.attributes.position.needsUpdate = true
      }
      group.rotation.y = Math.sin(t * 0.05) * 0.22
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.())
    },
  }
}
