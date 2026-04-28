# 아이타임 (AiTime)

Notion DB를 CMS로 활용하여 비개발자(부모)도 콘텐츠를 쉽게 관리하고, 웹에서 아이의 성장 기록을 타임라인 형태로 볼 수 있는 서비스입니다.

## 프로젝트 개요

**목적**: Notion DB를 CMS로 활용하여 아이의 성장 기록을 타임라인으로 제공
**사용자**: 아이의 성장 기록을 Notion으로 관리하고 싶은 부모 (비개발자 포함)
**접근**: 공개 사이트 (인증 불필요)

## 주요 페이지

1. **타임라인 페이지** (메인 / 유일한 페이지) - 성장 기록 전체를 날짜 역순 카드 목록으로 표시
2. **상세 모달** - 카드 클릭 시 사진 확대 및 전체 메모를 오버레이로 표시

## 핵심 기능

- **Notion 데이터 연동** (F001): Notion API로 성장 기록 DB를 fetch하여 렌더링
- **타임라인 렌더링** (F002): 날짜 역순 정렬된 성장 기록 카드 세로 목록
- **태그 필터링** (F003): 상단 태그 칩 UI로 원하는 태그의 기록만 필터링 (다중 선택 가능)
- **사진 모달 뷰어** (F004): 카드 클릭 시 사진 확대 및 전체 메모 표시 모달
- **요약 통계 표시** (F005): 총 기록 수, 첫 이벤트 날짜, 최근 기록 등 상단 요약
- **ISR 성능 최적화** (F006): Incremental Static Regeneration으로 Notion 데이터 캐싱 (revalidate: 3600초)

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **CMS**: Notion API (`@notionhq/client`) + ISR
- **Icons**: Lucide React
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Notion API 키와 데이터베이스 ID를 입력합니다.

```env
NOTION_API_KEY=         # Notion Integration Token
NOTION_DATABASE_ID=     # 성장 기록 Notion DB ID
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
npm run start
```

## Notion DB 스키마

| 속성명   | Notion 타입         | 설명                                    |
| -------- | ------------------- | --------------------------------------- |
| Title    | title               | 이벤트 제목 (필수)                      |
| Date     | date                | 이벤트 발생 날짜 (필수)                 |
| PhotoURL | url                 | 외부 이미지 URL                         |
| Tags     | multi_select        | 첫걸음, 첫말, 첫니, 생일, 병원, 여행 등 |
| Memo     | rich_text           | 상세 메모/기록                          |
| Age      | formula 또는 number | 개월 수                                 |

## 개발 상태

- [x] 기본 프로젝트 구조 설정
- [ ] Notion API 연동 (`@notionhq/client` 설치, DB fetch 유틸 함수)
- [ ] 타임라인 페이지 UI (ISR 서버 컴포넌트, 기록 카드 목록)
- [ ] 태그 필터 + 사진 모달 (클라이언트 컴포넌트)

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
