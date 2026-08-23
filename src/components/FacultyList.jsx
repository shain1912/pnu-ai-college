import { facultyStats } from '../data/schools'

/*
 * 한 학문단위의 교원 구성.
 *
 * 32회차 전에는 실명·직급·세부전공·개별 경력을 그대로 폈다. 그 구현의 근거는
 * "학과 페이지가 흔히 싣는 직업 정보" 였는데, 이 자료의 출처가 다르다.
 * faculty.json 은 대학 내부 교원정보 파일에서 왔고, 그것을 정리한
 * docs/_extract/SOURCE_FACTS.md 가 직접 이렇게 적어뒀다.
 *
 *   "개인 신상이므로 사이트에는 집계 통계로만 사용할 것. 개별 교수 이름·경력을
 *    공개 페이지에 싣는 것은 별도 동의가 필요하다."
 *
 * docs/EVAL_CONTENT.md 는 실명 + 소속 + 직급 + 세부전공이 동명이인까지 갈라내는
 * 재식별 조합이라고 짚었고(같은 이름 두 명이 소속·전공으로 구분된다),
 * docs/EVAL_GROK.md 는 이 항목을 제출 전 최소 수정 1번으로 올렸다. 저장소
 * 어디에도 공개 동의 기록이 없다.
 *
 * 그래서 집계만 낸다. 인원과 직급 구성, 그리고 다섯 명 이상인 묶음에 한해
 * 연구영역 목록. 사람을 특정하지 않으면서 "무엇을 가르치는 사람들인가" 에는
 * 답한다.
 *
 * 되돌리려면 schools.js 의 FACULTY_NAMES_PUBLIC 을 true 로 두면 된다.
 * faculty.json 도 facultyOf 도 지우지 않았다.
 */
export default function FacultyList({ school }) {
  const stats = facultyStats(school)

  if (stats.total === 0) {
    return <p className="text-[15px] leading-[1.7] text-ink-subtle">공개된 교원 정보가 아직 없어요.</p>
  }

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-none tracking-[-0.02em] text-ink">
          {stats.total}
          <span className="ml-1 text-[15px] font-bold text-ink-faint">명</span>
        </span>
        <span className="text-[15px] font-medium text-ink-subtle">
          {stats.byRank.map((r) => `${r.rank} ${r.n}`).join(' · ')}
        </span>
      </p>

      {stats.areas.length > 0 ? (
        <>
          <p className="mt-8 text-[14px] font-semibold text-ink-faint">주요 연구영역</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stats.areas.map((area) => (
              <li
                key={area}
                className="rounded-[--radius-sm] bg-gray-100 px-3 py-1.5 text-[14px] font-medium text-ink-muted"
              >
                {area}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 text-[14px] leading-[1.7] text-ink-faint">
          인원이 적어 연구영역은 따로 밝히지 않아요. 개인이 특정될 수 있어서예요.
        </p>
      )}

      <p className="mt-8 max-w-[42rem] text-[13px] leading-[1.7] text-ink-faint">
        교원 정보는 대학이 정리한 교원정보 자료(2026년 8월 기준)를 집계한 것이에요. 개인 신상에
        해당해서 이름과 개별 경력은 싣지 않아요.
      </p>
    </div>
  )
}
