# Development Guidelines — 아이타임 (AiTime)

## Project Overview

- Notion DB를 CMS로 사용하던 설계에서 **Prisma + PostgreSQL** 기반 DB로 전환된 아이 성장 기록 타임라인 웹 서비스
- 단일 페이지 서비스 (`/` 타임라인 페이지 + 상세 모달 오버레이)
- 인증 없는 공개 정적 사이트 — 인증/관리자/댓글/검색/다크모드 토글 MVP 범위 외
- 스택: Next.js 15.5.3 (App Router + Turbopack), React 19.1.0, TypeScript 5, TailwindCSS v4, shadcn/ui (new-york), Prisma (PostgreSQL)

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (수정 가능, 구조 변경 금지)
│   ├── page.tsx            # 타임라인 메인 페이지 (ISR 서버 컴포넌트, 구현 완료)
│   ├── loading.tsx         # 로딩 UI (구현 완료)
│   ├── error.tsx           # 에러 경계 (구현 완료)
│   └── not-found.tsx       # 404 페이지 (구현 완료)
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트 (직접 수정 금지, CLI로만 추가)
│   │   ├── tag-chip.tsx    # 태그 칩 (구현 완료)
│   │   ├── safe-image.tsx  # 이미지 폴백 (구현 완료)
│   │   └── empty-state.tsx # 빈 상태 UI (구현 완료)
│   ├── layout/             # container.tsx, header.tsx
│   ├── providers/          # theme-provider.tsx
│   └── timeline/           # 타임라인 기능 컴포넌트 (모두 구현 완료)
│       ├── timeline-view.tsx     # 클라이언트 루트 — 필터 + 모달 상태 통합
│       ├── timeline-card.tsx     # 개별 기록 카드
│       ├── stats-card.tsx        # 요약 통계
│       ├── photo-detail-modal.tsx # 사진 상세 모달 (Dialog 기반)
│       └── timeline-skeleton.tsx  # 로딩 스켈레톤
├── generated/
│   └── prisma/             # Prisma CLI가 자동 생성 — 직접 수정 금지
└── lib/
    ├── env.ts              # 환경변수 접근 (반드시 이 파일 경유)
    ├── utils.ts            # cn() 유틸
    ├── db/                 # DB 레이어 (구현 완료)
    │   ├── client.ts       # Prisma 싱글톤 클라이언트 (PrismaPg + Pool)
    │   └── queries.ts      # fetchGrowthRecords, fetchRecordById, fetchTimelineSummary
    ├── types/              # 타입 정의 (구현 완료)
    │   ├── growth-record.ts  # GrowthRecord, TimelineSummary 인터페이스
    │   └── tag.ts            # TAG_COLORS 상수, TagName 타입
    └── mock/               # 더미 데이터 (필요 시 참조용)
        └── growth-records.ts
prisma/
└── schema.prisma           # GrowthRecord, TimelineSummary 모델 정의
prisma.config.ts            # Prisma 설정 (schema 경로, migrations 경로)
docs/
├── PRD.md                  # 요구사항 (읽기 전용)
├── ROADMAP.md              # 로드맵 (작업 완료 시 ✅ 업데이트)
└── guides/                 # 개발 가이드 (읽기 전용)
```

## Naming Conventions

- 파일명: `kebab-case.tsx` (예: `growth-card.tsx`, `tag-filter.tsx`)
- 컴포넌트명: `PascalCase` (예: `GrowthCard`, `TagFilter`)
- 폴더명: `kebab-case` (예: `timeline/`, `tag-filter/`)
- 커스텀 훅: `use-` 접두사, `hooks/` 디렉토리에 위치 (예: `hooks/use-tag-filter.ts`)

## Component Architecture

### Server Components (기본)

- `src/app/page.tsx`: `export const revalidate = 3600` ISR 서버 컴포넌트, DB 데이터 fetch
- `src/components/timeline/timeline-card.tsx`: 개별 기록 카드 (서버 렌더링)
- `src/components/timeline/stats-card.tsx`: 요약 통계 카드 (서버 렌더링)

### Client Components ('use client' 필수)

- `src/components/timeline/timeline-view.tsx`: 태그 필터 + 모달 상태 통합 루트 클라이언트 컴포넌트
- `src/components/timeline/photo-detail-modal.tsx`: 사진 상세 모달 (Dialog 활용)

### 경계 규칙

- `src/app/page.tsx`에서 DB 데이터 fetch → `TimelineView`(클라이언트)에 props로 전달
- `'use client'`는 상호작용(상태/이벤트) 필요한 최하위 컴포넌트에만 추가
- 클라이언트 컴포넌트는 `src/components/timeline/` 하위에만 생성

## Data Layer — Prisma + PostgreSQL

### GrowthRecord 타입 (변경 금지)

```typescript
interface GrowthRecord {
  id: string
  title: string
  date: string // YYYY-MM-DD (ISO 날짜 문자열)
  photoUrl: string | null
  tags: string[]
  memo: string
  ageMonths: number | null
}
```

### Prisma 스키마 (prisma/schema.prisma)

```prisma
model GrowthRecord {
  id        String   @id @default(cuid())
  title     String
  date      DateTime
  memo      String   @default("")
  photoUrl  String?
  tags      String[]
  ageMonths Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### DB 쿼리 규칙

- 모든 DB 접근은 `src/lib/db/queries.ts`의 함수만 사용
- `prisma` 클라이언트 직접 import **금지** — `queries.ts` 함수 경유 필수
- `src/lib/db/client.ts`의 `prisma` 싱글톤은 `queries.ts`에서만 import

### ISR 설정 (필수)

```typescript
// src/app/page.tsx 최상단 — 절대 생략 금지
export const revalidate = 3600
```

### 환경변수 접근 규칙

- **반드시** `src/lib/env.ts`의 `env` 객체를 통해 접근
- `process.env.*` 직접 접근 **금지** (단, `src/lib/db/client.ts`의 `connectionString`은 예외)
- 현재 유효 변수: `env.DATABASE_URL`
- 새 환경변수 추가 시: `env.ts` + `.env.local` + `.env.local.example` 동시 수정

### Prisma 스키마 변경 규칙

1. `prisma/schema.prisma` 수정
2. `npx prisma migrate dev --name <description>` 실행
3. `src/generated/prisma/` 자동 재생성 확인
4. `src/generated/prisma/` 직접 수정 **절대 금지**

### 이미지 도메인 (next.config.ts)

- 외부 이미지 사용 시 `next.config.ts`에 `images.remotePatterns` 추가 필수

## Installed Packages & Components

### 이미 설치된 shadcn/ui 컴포넌트 (재설치 금지)

`alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `navigation-menu`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `sonner`

### 주요 설치 패키지

- `prisma` + `@prisma/client` + `@prisma/adapter-pg` + `pg` — DB 접근
- `react-hook-form` + `@hookform/resolvers` — 폼 처리
- `zod` — 스키마 검증 + 환경변수 검증
- `next-themes` — 다크/라이트 테마 (ThemeProvider 이미 layout.tsx에 적용됨)
- `sonner` — 토스트 알림 (Toaster 이미 layout.tsx에 적용됨)
- `usehooks-ts` — 유틸리티 훅 모음
- `lucide-react` — 아이콘
- `tw-animate-css` — Tailwind 애니메이션

## Styling Rules

- TailwindCSS v4: 설정 파일 없음, `src/app/globals.css`에서 CSS 변수 관리
- 색상은 시맨틱 변수만 사용: `bg-background`, `text-foreground`, `text-muted-foreground`, `border`
- **하드코딩 색상 금지**: `bg-gray-100`, `text-black`, `bg-white`, `text-gray-*`
- **예외**: `src/lib/types/tag.ts`의 `TAG_COLORS`는 태그별 고유 색상 시스템이므로 허용
- 클래스 조합은 반드시 `cn()` (`@/lib/utils`) 사용
- 인라인 스타일 (`style={{}}`) **금지** (단, `animationDelay` 등 동적 값은 허용)
- 반응형: 모바일 우선 (`sm:` → `md:` → `lg:` 순서)
- 새 shadcn 컴포넌트 필요 시: `npx shadcn@latest add <name>`

## Import Rules

- 경로 별칭 필수: `@/components/...`, `@/lib/...`, `@/hooks/...`
- 상대경로 import **금지**: `../../../lib/utils`
- import 순서: 외부 라이브러리 → `@/` 내부 모듈

## Key File Interactions

| 작업                    | 수정/생성 파일                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| DB 쿼리 추가            | `src/lib/db/queries.ts`                                             |
| DB 스키마 변경          | `prisma/schema.prisma` → migrate → `src/generated/prisma/` 자동갱신 |
| 타입 정의 추가          | `src/lib/types/growth-record.ts`                                    |
| 태그 추가/수정          | `src/lib/types/tag.ts` (TAG_COLORS)                                 |
| 타임라인 필터/모달 수정 | `src/components/timeline/timeline-view.tsx`                         |
| 모달 UI 수정            | `src/components/timeline/photo-detail-modal.tsx`                    |
| 카드 UI 수정            | `src/components/timeline/timeline-card.tsx`                         |
| 통계 UI 수정            | `src/components/timeline/stats-card.tsx`                            |
| 새 shadcn 컴포넌트      | `src/components/ui/<name>.tsx` (CLI로만 추가)                       |
| 외부 이미지 도메인      | `next.config.ts` — `images.remotePatterns`                          |
| 전역 스타일 변경        | `src/app/globals.css`                                               |
| 환경변수 추가           | `src/lib/env.ts` + `.env.local` + `.env.local.example`              |
| 로드맵 업데이트         | `docs/ROADMAP.md` — 완료 작업 ✅ 표시                               |

## Next.js 15.5.3 필수 규칙

- `params`, `searchParams`는 반드시 `await`으로 비동기 처리
- `cookies()`, `headers()`도 `await` 필수
- App Router 전용 — `pages/` 디렉토리 생성 **금지**
- 빌드: `npm run dev` (Turbopack), `npm run build`

## Export Rules

- 컴포넌트: named export (`export function TimelineCard`)
- 페이지(`page.tsx`): default export (`export default function TimelinePage`)
- named + default 동시 export **금지**

## Tag Filter Strategy

- 다중 태그 선택: **OR 방식** (선택 태그 중 하나라도 포함된 레코드 표시)
- '전체 보기' 칩: 모든 필터 해제, 전체 레코드 표시
- 모달 닫기 후 기존 필터 상태 유지
- 표시할 태그 목록: `TAG_COLORS` 키 중 실제 레코드에 존재하는 태그만 (`page.tsx`에서 필터링)

## Task Workflow

### 구현 순서 (API/비즈니스 로직)

1. 기능 구현
2. Playwright MCP로 Happy Path 테스트
3. Playwright MCP로 에러/실패 케이스 테스트
4. Playwright MCP로 엣지 케이스 테스트
5. 모든 테스트 통과 후에만 완료 처리 — 실패 시 수정 후 재테스트

### 작업 완료 후

- `docs/ROADMAP.md`에서 해당 Task를 ✅로 표시

## AI Decision Rules

### 컴포넌트 위치

1. 타임라인 전용 → `src/components/timeline/`
2. 재사용 UI → `src/components/ui/` (shadcn CLI로만, 커스텀은 직접 생성 가능)
3. 레이아웃 → `src/components/layout/`
4. 전역 Context → `src/components/providers/`
5. 커스텀 훅 → `src/hooks/`

### Server vs Client 판단

- 데이터 fetch, 정적 렌더링, SEO → Server Component
- `useState`, `useEffect`, 이벤트 핸들러 필요 → Client Component
- 의심스러우면 Server Component 먼저 시도

### 새 패키지 판단

- shadcn 컴포넌트: `npx shadcn@latest add <name>`
- DB 쿼리 변경: `queries.ts` 수정 (새 패키지 불필요)
- 기타: 기존 패키지(`usehooks-ts`, `zod` 등)로 해결 가능한지 먼저 확인

## Prohibited Actions

- `src/components/ui/` shadcn 파일 직접 수정 **금지** (shadcn/ui 관리 파일)
- `src/generated/prisma/` 직접 수정 **금지** (Prisma CLI 자동생성)
- `process.env.*` 직접 접근 **금지** (반드시 `env.ts` 경유, `db/client.ts` 예외)
- 인라인 스타일 **금지** (동적 `animationDelay` 등 예외)
- 상대경로 import **금지**
- 하드코딩 색상 클래스 **금지** (`text-gray-*`, `bg-white` 등, `tag.ts` TAG_COLORS 예외)
- `pages/` 디렉토리 생성 **금지** (App Router 전용)
- `'use client'` 불필요한 컴포넌트에 추가 **금지**
- ISR 없이 DB 데이터 fetch **금지** (`revalidate = 3600` 필수)
- MVP 범위 외 기능 구현 **금지**: 인증, 관리자, 댓글, 다크모드 토글, 검색, 다국어
- 파일 300줄 초과 **금지**
- 테스트 미통과 상태에서 다음 단계 진행 **금지**
