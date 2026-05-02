# harness-builder

> AI가 AI 프로젝트 환경을 스스로 설정해주는 메타-에이전트 시스템

"하네스 세팅 진행해" 한 마디로 → 전문가 에이전트 팀 자동 구성, MCP/Skills 추천, 보안 룰 주입, QA 검증까지 7단계 자동 완성

## 설치

```bash
npx harness-builder
```

Node.js 16 이상 필요. 그 외 설치 없음.

## 지원 플랫폼

| 플랫폼 | 파일 위치 |
|--------|----------|
| Antigravity | `.agents/skills/` |
| Claude Code | `.claude/agents/` + `CLAUDE.md` |
| Cursor | `.cursor/rules/*.mdc` |
| Windsurf | `.windsurf/rules/*.md` |

## 사용법

프로젝트 폴더에서 실행:

```bash
cd my-project
npx harness-builder
```

플랫폼 선택 → 설치 완료 → AI에게 `"하네스 세팅 진행해"` 입력

## 7단계 파이프라인

```
[1] 요구사항 수집  →  [2] 문서 설계  →  [3] 팀 구성 + MCP 추천
                                              ↓
                              [4] MCP/Skills 설치 (사용자)
                                              ↓
                              [5] 재검증 + 팀 강화
                                              ↓
                        [6] 보안 주입  →  [7] QA 검증 → ✅
```

## 트리거 키워드

| 입력 | 동작 |
|------|------|
| `하네스 세팅 진행해` | Phase 1 시작 |
| `00-doc-architect 진행해` | Phase 2 |
| `00-team-architect 진행해` | Phase 3 |
| `MCP 재검증` | Phase 5 |
| `00-security-enforcer 진행해` | Phase 6 |
| `00-qa-gate 진행해` | Phase 7 |

## License

MIT
