/*
 * ApexScene — id="apex" · /ai-college
 *
 * 이 씬은 사실 위계가 전부예요.
 * 총장 직속은 3개 기구(AI대학·AI융합교육원·장영실AI연구원)고, AX정보화혁신본부는
 * 대학본부 소속이에요. 기존 구현처럼 넷을 2×2 카드로 나란히 놓으면 네 기구가 같은
 * 층위로 읽혀서 사실이 틀려요. 그래서 카드 그리드를 버리고 조직도로 다시 그렸어요.
 *
 *  - 코어(PNU-APEX)에서 실선 팔 세 개가 곧장 내려가고, 그 줄기 위에 "총장 직속" 라벨이 앉아요.
 *  - AX정보화혁신본부는 코어 옆에 따로 서서 점선으로만 이어지고, 그 점선 위에
 *    "대학본부 소속" 라벨이 앉아요.
 *  - 선의 종류(실선/점선)와 선 위의 라벨이 관계를 직접 말하니까, 카드 안에 괄호로
 *    적어두고 독자가 알아채길 기대할 필요가 없어요. 그래서 detail 끝의 "(대학본부 소속)"은
 *    구조로 옮기고 문장에서는 뺐어요. 없어진 사실은 없어요.
 *  - 색도 같은 규칙을 지켜요. 브랜드 파랑은 직속 관계에만 쓰고, 별도 계열은 계속 회색이에요.
 *  - /img/apex@2x.webp 도 같은 구조(코어 + 직결 팔 3 + 옆 블록)라 그림과 글이 어긋나지 않아요.
 *
 * 모션 — 진입 애니메이션은 이 씬이 직접 만들지 않아요. #apex 는 /ai-college 에서 언제나
 * 첫 화면 아래고, docs/SCENES.md §4 는 "스크롤해서 도달하는 요소에는 붙이지 마라"고
 * 못박아요(docs/motion/reference.md: 레퍼런스 4곳 모두 스크롤 진입 애니메이션 없음, 픽셀 diff 0.00).
 * 진입은 훅이 주는 data-reveal 에 맡기고 — 첫 화면 아래면 훅이 그냥 표시해요 — 이 씬이
 * 만드는 모션은 §4 가 "반드시" 넣으라고 한 상호작용뿐이에요. 노드에 포인터를 얹으면 그
 * 노드로 가는 선만 살아나고 역할 배지가 채워져요. 어느 선이 어디로 이어지는지 짚어보게
 * 하는 게 목적이라, 정보를 감췄다 여는 연출은 쓰지 않았어요.
 *
 * 에셋 — /img/apex@2x.webp (1200×670) 은 이미 들어와 있고, 확인해 보니 코어에 짧은 팔
 * 세 개가 직결되고 사각 블록 하나가 긴 대에 매달려 옆에서 따로 붙는 형태예요. 위 구조와
 * 정확히 같아서 그대로 코어 노드 안에 놓았어요. 추가로 필요한 에셋은 없어요.
 */
import { APEX } from '../data/content'
import { revealDelay } from '../hooks/useReveal'

/* 오브젝트가 말하는 것과 조직도가 말하는 것이 같아야 해서, alt 도 같은 문장을 써요. */
const APEX_OBJECT_ALT = '코어 하나에 팔 세 개가 곧장 붙고, 블록 하나가 옆에서 따로 이어지는 도형.'

/*
 * 'PNU-APEX · AI·AX Platform for Education & eXecution' → 이름과 풀네임.
 * 구분자는 스페이스를 낀 가운뎃점이라 풀네임 안의 'AI·AX' 는 쪼개지지 않아요.
 * 이름을 코드에 직접 쓰지 않으려고 데이터에서 갈라 써요 (docs/SCENES.md §6).
 */
const [APEX_NAME, APEX_FULL] = APEX.full.split(' · ')

/* 대학본부 소속임을 데이터가 detail 괄호로 표시해요. 그 표시를 구조로 옮겨요. */
const ASIDE_MARK = '대학본부 소속'
const isAside = (pillar) => pillar.detail.includes(ASIDE_MARK)
const trimMark = (detail) => detail.replace(`(${ASIDE_MARK})`, '').trim()

const DIRECT = APEX.pillars.filter((pillar) => !isAside(pillar))
const ASIDE = APEX.pillars.filter(isAside)

function ApexNode({ pillar, aside = false }) {
  return (
    <article className={`apex-node card ${aside ? 'apex-node--aside' : ''}`}>
      <span className={`apex-role ${aside ? 'apex-role--aside' : ''}`}>{pillar.role}</span>
      <h3 className="apex-node-name">{pillar.name}</h3>
      <p className="apex-node-detail">{trimMark(pillar.detail)}</p>
    </article>
  )
}

export default function ApexScene() {
  return (
    <section id="apex" className="band bg-canvas-subtle">
      <div className="edge">
        <p data-reveal className="text-[15px] font-semibold text-brand">
          {APEX.eyebrow}
        </p>
        <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
          {APEX.title}
        </h2>
        <p data-reveal style={revealDelay(2)} className="lead mt-6 max-w-[38rem]">
          {APEX.body}
        </p>

        <div data-reveal style={revealDelay(3)} className="apex-map mt-14 md:mt-20">
          <div className="apex-core card">
            <img
              src="/img/apex@2x.webp"
              alt={APEX_OBJECT_ALT}
              width={380}
              height={212}
              loading="lazy"
              decoding="async"
              className="apex-core-object"
            />
            <div className="apex-core-copy">
              <p className="apex-core-name">{APEX_NAME}</p>
              <p className="apex-core-full">{APEX_FULL}</p>
            </div>
          </div>

          <div className="apex-arms">
            <span className="apex-edge-label apex-edge-label--direct">총장 직속</span>
            <ul className="apex-arm-list">
              {DIRECT.map((pillar) => (
                <li key={pillar.name} className="apex-arm">
                  <ApexNode pillar={pillar} />
                </li>
              ))}
            </ul>
          </div>

          <div className="apex-aside">
            <span className="apex-edge-label apex-edge-label--aside">{ASIDE_MARK}</span>
            <ul className="apex-aside-list">
              {ASIDE.map((pillar) => (
                <li key={pillar.name}>
                  <ApexNode pillar={pillar} aside />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .apex-map {
          --apex-stem: 44px;   /* 코어 아래 줄기 */
          --apex-drop: 32px;   /* 가로 버스에서 카드까지 */
          --apex-gap: 14px;
          --apex-link: 132px;  /* 코어와 별도 블록 사이 점선 길이 */
          --apex-line: var(--color-gray-300);
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-template-areas: 'core' 'arms' 'aside';
          row-gap: 0;
        }

        /* ---- 코어 ---- */
        .apex-core {
          grid-area: core;
          position: relative;
          display: flex;
          flex-direction: column;   /* 좁은 화면에서는 오브젝트를 글 위로 */
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
        }
        .apex-core::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          width: 2px;
          height: var(--apex-stem);
          transform: translateX(-50%);
          background: var(--apex-line);
        }
        /* 오브젝트는 배경이 살짝 회색이라, 타일로 보이도록 모서리를 둥글려 줘요. */
        .apex-core-object {
          flex: none;
          width: 168px;
          height: auto;
          aspect-ratio: 380 / 212;
          object-fit: contain;
          border-radius: var(--radius-lg);
        }
        .apex-core-copy { min-width: 0; }
        .apex-core-name {
          font-size: 21px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-ink);
        }
        .apex-core-full {
          margin-top: 4px;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 500;
          color: var(--color-ink-faint);
        }

        /* ---- 총장 직속 3개 기구 ---- */
        .apex-arms {
          grid-area: arms;
          position: relative;
          padding-top: calc(var(--apex-stem) + var(--apex-drop));
        }
        .apex-arm-list {
          position: relative;
          display: grid;
          gap: var(--apex-gap);
        }
        /* 좁은 화면: 카드 뒤로 지나가는 한 줄 레일 */
        .apex-arm-list::before {
          content: '';
          position: absolute;
          left: 50%;
          top: calc(-1 * var(--apex-drop));
          width: 2px;
          height: calc(100% + var(--apex-drop));
          transform: translateX(-50%);
          background: var(--apex-line);
        }
        .apex-arm {
          position: relative;
          z-index: 1;   /* 레일이 카드 위로 올라오지 않게 */
          display: grid;
        }

        /* ---- 별도 계열: 대학본부 ---- */
        .apex-aside {
          grid-area: aside;
          position: relative;
          margin-top: 48px;
          padding-top: 32px;
        }
        .apex-aside::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          border-top: 2px dashed var(--apex-line);
          transition: border-color var(--dur-base) var(--ease-standard);
        }
        .apex-aside-list {
          display: grid;
          gap: var(--apex-gap);
        }

        /* ---- 선 위에 앉는 라벨 ---- */
        .apex-edge-label {
          position: absolute;
          z-index: 2;
          white-space: nowrap;
          border-radius: var(--radius-pill);
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .apex-edge-label--direct {
          left: 50%;
          top: calc(var(--apex-stem) / 2);
          transform: translate(-50%, -50%);
          background: var(--color-blue-50);
          color: var(--color-blue-700);
        }
        .apex-edge-label--aside {
          left: 50%;
          top: 0;
          transform: translate(-50%, -50%);
          background: var(--color-gray-200);
          color: var(--color-ink-muted);
        }

        /* ---- 노드 카드 ---- */
        .apex-node {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 20px;
        }
        /* 그림자 대신 점선 테두리. 카드는 카드인데 계열이 다르다는 표시예요. */
        .apex-node--aside {
          box-shadow: none;
          border: 2px dashed var(--color-gray-300);
          transition:
            border-color var(--dur-base) var(--ease-standard),
            transform var(--dur-base) var(--ease-standard);
        }
        .apex-role {
          border-radius: var(--radius-sm);
          padding: 3px 9px;
          font-size: 12px;
          font-weight: 700;
          background: var(--color-blue-50);
          color: var(--color-blue-700);
          transition:
            background-color var(--dur-base) var(--ease-standard),
            color var(--dur-base) var(--ease-standard);
        }
        .apex-role--aside {
          background: var(--color-gray-200);
          color: var(--color-ink-muted);
        }
        .apex-node-name {
          margin-top: 12px;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.35;
          color: var(--color-ink);
        }
        .apex-node-detail {
          margin-top: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-ink-subtle);
        }

        @media (min-width: 768px) {
          .apex-map { --apex-gap: 16px; }
          .apex-core {
            flex-direction: row;
            align-items: center;
            gap: 26px;
            padding: 22px 30px;
          }
          .apex-core-object { width: 176px; }
          .apex-core-name { font-size: 25px; }
          .apex-core-full { font-size: 14px; }
          .apex-node { padding: 24px; }
          .apex-node-name { font-size: 20px; }
          .apex-node-detail { font-size: 15px; }

          .apex-arm-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          /* 별도 계열은 한 칸 너비로 오른쪽에 붙여요. 폭까지 나란하면 같은 급으로 읽혀요. */
          .apex-aside-list {
            max-width: calc((100% - 2 * var(--apex-gap)) / 3);
            margin-left: auto;
          }
          .apex-edge-label--aside {
            left: auto;
            right: calc((100% - 2 * var(--apex-gap)) / 6);
            transform: translate(50%, -50%);
          }
          /* 세 칸 그리드에서 첫 칸과 마지막 칸의 중심을 잇는 가로 버스 */
          .apex-arm-list::before {
            left: calc((100% - 2 * var(--apex-gap)) / 6);
            right: calc((100% - 2 * var(--apex-gap)) / 6);
            top: calc(-1 * var(--apex-drop));
            width: auto;
            height: 2px;
            transform: none;
          }
          .apex-arm::before {
            content: '';
            position: absolute;
            left: 50%;
            top: calc(-1 * var(--apex-drop));
            width: 2px;
            height: var(--apex-drop);
            transform: translateX(-50%);
            background: var(--apex-line);
            transition: background-color var(--dur-base) var(--ease-standard);
          }
        }

        /* 코어 옆에 별도 블록을 세우는 건 가로가 충분할 때만 */
        @media (min-width: 1120px) {
          .apex-map {
            grid-template-columns: minmax(0, 1fr) 236px;
            column-gap: var(--apex-link);
            grid-template-areas:
              'core aside'
              'arms .';
          }
          /* 코어가 행 높이를 채워야 줄기가 아래 버스까지 끊김 없이 이어져요. */
          .apex-core { align-self: stretch; padding: 26px 36px; }
          .apex-core-object { width: 220px; }
          .apex-aside {
            align-self: center;
            margin-top: 0;
            padding-top: 0;
          }
          .apex-aside::before {
            left: calc(-1 * var(--apex-link));
            right: auto;
            top: 50%;
            width: var(--apex-link);
          }
          .apex-aside-list { max-width: none; margin-left: 0; }
          .apex-edge-label--aside {
            left: calc(-1 * var(--apex-link) / 2);
            right: auto;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }

        /* ---- 상호작용: 선을 짚어보게 하는 것 ---- */
        @media (hover: hover) {
          .apex-arm:hover .apex-node {
            transform: translateY(-3px);
            box-shadow: 0 2px 6px rgb(25 31 40 / 0.06), 0 12px 32px rgb(25 31 40 / 0.1);
          }
          /* 별도 블록은 그림자 없는 점선 카드라, 들리기만 하고 떠오르지는 않아요. */
          .apex-aside:hover .apex-node--aside { transform: translateY(-3px); }
          .apex-arm:hover .apex-role {
            background: var(--color-brand-strong);
            color: #fff;
          }
          .apex-arm:hover::before { background: var(--color-brand); }

          /* 별도 계열은 브랜드색을 쓰지 않아요. 파랑은 직속 관계에만 써요. */
          .apex-aside:hover::before { border-color: var(--color-ink-faint); }
          .apex-aside:hover .apex-node--aside { border-color: var(--color-gray-400); }
          .apex-aside:hover .apex-role--aside {
            background: var(--color-ink-muted);
            color: #fff;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .apex-node,
          .apex-role,
          .apex-arm::before,
          .apex-aside::before { transition: none !important; }
          .apex-arm:hover .apex-node,
          .apex-aside:hover .apex-node { transform: none; }
        }
      `}</style>
    </section>
  )
}
