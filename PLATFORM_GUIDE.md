# 플랫폼별 변환 가이드

## 핵심 차이점

| 항목 | Antigravity | Claude Code | Cursor | Windsurf |
|------|-------------|-------------|--------|----------|
| 파일 위치 | `.agents/skills/00-name/SKILL.md` | `.claude/agents/00-name.md` | `.cursor/rules/00-name.mdc` | `.windsurf/rules/00-name.md` |
| 파일 확장자 | `.md` | `.md` | `.mdc` | `.md` |
| 에이전트 활성화 | description 키워드 | `/agents` 슬래시 커맨드 | description 키워드 | description 키워드 |
| 전역 룰 | 없음 (에이전트 내 상속) | `CLAUDE.md` (프로젝트 루트) | `.cursor/rules/always.mdc` | `.windsurf/rules/global.md` |
| assets 폴더 | 지원 (에이전트별 하위 폴더) | 미지원 (파일로 통합) | 미지원 | 미지원 |

---

## Antigravity → Claude Code 변환

### 변경 사항
1. `SKILL.md` → `.claude/agents/` 폴더에 개별 `.md` 파일로 이동
2. YAML frontmatter의 `name:` / `description:` 제거 (Claude Code는 파일명으로 인식)
3. 전역 룰(Harness Rules 상속 블록) → `CLAUDE.md`로 분리
4. assets 폴더 내용 → 각 에이전트 `.md` 파일 하단에 통합

### 예시: 00-harness-pm

**Antigravity (`.agents/skills/00-harness-pm/SKILL.md`)**
```yaml
---
name: 00-harness-pm
description: >
  하네스 환경 초기 세팅 전용 PM.
  "하네스 세팅", "팀 구성" 요청 시에만 활성화.
  ONBOARDING.md가 이미 존재하면 활성화하지 마시오.
---

# 하네스 PM
...
```

**Claude Code (`.claude/agents/00-harness-pm.md`)**
```markdown
# 하네스 PM (Harness Project Manager)

당신은 "하네스 세팅", "팀 구성" 요청 시에만 활성화됩니다.
ONBOARDING.md가 이미 존재하면 응답하지 마십시오.

## Role
...
```

**`CLAUDE.md` (프로젝트 루트 — 전역 룰)**
```markdown
# Harness Builder Team

이 프로젝트에는 하네스 빌더 팀이 설치되어 있습니다.

## 전역 룰
- 작업 전 docs/PRD.md, docs/ARCHITECTURE.md 읽기
- 코드 작성 전 공식 문서 웹 검색 필수
- API 키 하드코딩 금지, .env.local 사용
- .agents/ 또는 .claude/ 폴더 수정 금지

## 시작하기
"하네스 세팅 진행해" 라고 입력하세요.
```

---

## Antigravity → Cursor 변환

### 변경 사항
1. `SKILL.md` → `.cursor/rules/` 폴더에 `.mdc` 파일로 이동
2. YAML frontmatter → Cursor 전용 frontmatter로 교체
   - `name:` / `description:` → `description:` (한 줄)
   - `alwaysApply: false` 추가 (키워드 트리거 방식 유지)
3. 전역 룰 → `alwaysApply: true`인 별도 `.mdc` 파일로 분리

### 예시: 00-harness-pm

**Cursor (`.cursor/rules/00-harness-pm.mdc`)**
```markdown
---
description: 하네스 환경 초기 세팅 전용 PM. "하네스 세팅", "팀 구성" 요청 시에만 활성화.
alwaysApply: false
---

# 하네스 PM
...
```

**전역 룰 (`.cursor/rules/harness-global.mdc`)**
```markdown
---
description: Harness 전역 룰
alwaysApply: true
---

- 작업 전 docs/PRD.md 읽기
- 코드 작성 전 공식 문서 웹 검색 필수
- API 키 하드코딩 금지
```

---

## Antigravity → Windsurf 변환

Cursor와 거의 동일. 차이점:
- 파일 위치: `.cursor/rules/` → `.windsurf/rules/`
- 확장자: `.mdc` → `.md`
- frontmatter: `alwaysApply` → `trigger` (선택적)

```markdown
---
trigger: 하네스 세팅 진행해
---
```

---

## 요약: 뭘 바꿔야 하나

```
공통으로 바꿀 것:
  1. 파일 위치 (플랫폼별 다름)
  2. YAML frontmatter 형식
  3. 전역 룰 분리 방법

바꾸지 않아도 되는 것:
  - ## Role, ## Instructions, ## Constraints 본문 내용
  - Harness Rules 상속 블록
  - 7단계 파이프라인 로직
  - 트리거 키워드
```
