from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "_extract" / "faculty.txt"


def parse_records() -> list[dict[str, object]]:
    lines = SOURCE.read_text(encoding="utf-8-sig").splitlines()
    records: list[dict[str, object]] = []
    for line in lines[2:]:
        cells = [cell.strip() for cell in line.split("|")]
        if cells and re.fullmatch(r"\d+", cells[0]):
            cells += [""] * (7 - len(cells))
            records.append(
                {
                    "row": int(cells[0]),
                    "college": cells[1],
                    "department": cells[2],
                    "rank": cells[3],
                    "name": cells[4],
                    "specialty": cells[5],
                    "career": cells[6],
                }
            )
        elif records and len(cells) >= 7:
            records[-1]["career"] += "\n" + cells[6]
    return records


# 세부전공 필드만 대상으로 하는 다중분류다. 한 교원이 여러 영역에 포함될 수 있다.
RESEARCH_RULES = {
    "AI·기계학습": r"인공지능|\bAI\b|머신러닝|기계학습|딥러닝|통계적 학습|learning",
    "컴퓨터비전·그래픽스": r"비전|Visual Computing|그래픽스|영상처리|원격탐사|3D알고리즘",
    "자연어처리·데이터마이닝": r"자연어|데이터\s*마이닝|텍스트마이닝|추천시스템|멀티모달",
    "데이터베이스·데이터공학": r"데이터베이스|공간정보공학|데이터 생성",
    "통계·수학": r"통계|확률|수학|베이지안|추론|예측",
    "산업공학·최적화": r"산업공학|산업\s*AI|최적화|생산|물류|팩토리|디지털트윈|역문제",
    "보안": r"보안|정보보호",
    "시스템·네트워크·소프트웨어": r"시스템|운영체제|네트워크|통신|소프트웨어|컴파일러|프로그래밍언어|반도체|IoT",
    "HCI·XR": r"상호작용|인터랙션|HCI|가상증강현실|디지털휴먼|메타버스",
    "바이오·헬스": r"바이오|의료|헬스|뇌과학|생물|유전자|신약|유전체|의생명",
}


# '근무'를 나타내는 직함/표현과 함께 아래 조직명이 경력 필드에 나온 경우만 센다.
# 대학 교원, 위원, 산학협력 과제, 학회 활동, 박사후연구원은 제외한다.
INDUSTRY_ORG = re.compile(
    r"금성통신연구소|금성반도체|금성사|삼성SDS|핸디소프트|NHN|텔코웨어|"
    r"동양시스템즈|소프트티엔큐|ETRI|한국전자통신연구원|삼성전자|TTA|"
    r"한국정보통신기술협회|국가보안기술연구소|한국원자력안전기술원|"
    r"한국원자력연구원|Opinion8|Konolabs|LYZE|Sony Research|플론베이|"
    r"삼성디스플레이|하이닉스|메리츠화재|LGD|삼성리서치|국방과학연구소|"
    r"차세대융합기술연구원|네이버|삼성메디슨|국립 암 연구소|National Cancer Institute"
)
EMPLOYMENT_ROLE = re.compile(
    r"연구원|책임|선임|주임|차장|대표이사|연구소장|CIO|사이언티스트|디렉터|"
    r"Staff Engineer|근무|부센터장|Trainee|업무|\d+(?:\.\d+)?년"
)


def main() -> None:
    records = parse_records()
    exact_keys = {
        (r["college"], r["department"], r["rank"], r["name"], r["specialty"], r["career"])
        for r in records
    }
    research = {
        label: [r["row"] for r in records if re.search(pattern, str(r["specialty"]), re.I)]
        for label, pattern in RESEARCH_RULES.items()
    }
    industry = [
        r["row"]
        for r in records
        if INDUSTRY_ORG.search(str(r["career"]))
        and (
            EMPLOYMENT_ROLE.search(str(r["career"]))
            or re.search(r"\(\d{2}\.\d+[-~]\d{2}\.\d+\)", str(r["career"]))
        )
    ]
    result = {
        "physical_lines": len(SOURCE.read_text(encoding="utf-8-sig").splitlines()),
        "records": len(records),
        "exact_unique_records": len(exact_keys),
        "unique_names": len({r["name"] for r in records}),
        "homonyms": {
            name: [r["row"] for r in records if r["name"] == name]
            for name, count in Counter(r["name"] for r in records).items()
            if count > 1
        },
        "college": Counter(r["college"] for r in records),
        "department": Counter(r["department"] for r in records),
        "rank": Counter(r["rank"] for r in records),
        "research": {label: {"count": len(rows), "rows": rows} for label, rows in research.items()},
        "industry": {"count": len(industry), "rows": industry},
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
