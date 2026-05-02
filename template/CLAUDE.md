# Harness Builder Team

이 프로젝트에는 하네스 빌더 팀이 설치되어 있습니다.
에이전트 팀이 프로젝트 환경을 자동으로 설정해드립니다.

## 시작하기

```
하네스 세팅 진행해
```

## 전역 룰 (모든 에이전트 공통 적용)

- 작업 전 `docs/PRD.md`, `docs/ARCHITECTURE.md` 반드시 읽기
- 코드 작성 전 해당 기술 스택 공식 문서 웹 검색 필수 (사전 학습 지식 의존 금지)
- API 키 및 민감 정보는 `.env.local`에만 저장, 소스 코드 하드코딩 금지
- `rm -rf` 등 파괴적 명령어 실행 금지
- `.claude/agents/00-*` 폴더 수정/삭제 금지 (보호구역)
- `ONBOARDING.md` 존재 시 빌더 에이전트 비활성화

## 트리거 키워드

| 입력 | 동작 |
|------|------|
| `하네스 세팅 진행해` | Phase 1: 요구사항 수집 |
| `00-doc-architect 진행해` | Phase 2: 문서 설계 |
| `00-team-architect 진행해` | Phase 3: 팀 구성 |
| `MCP 재검증` | Phase 5: 팀 강화 |
| `00-security-enforcer 진행해` | Phase 6: 보안 주입 |
| `00-qa-gate 진행해` | Phase 7: QA 검증 |
| `재검증` | QA 재검증 |
