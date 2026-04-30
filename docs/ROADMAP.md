# 아이타임 (AiTime) 개발 로드맵

PostgreSQL DB를 데이터 저장소로 활용하여 아이의 성장 기록을 아름다운 웹 타임라인으로 보여주는 정적 공개 사이트

**📅 최종 업데이트**: 2026-04-30
**📊 진행 상황**: Phase 4 완료 (13/13 Tasks 완료) — Phase 5 예정

## 개요

아이타임(AiTime)은 **아이의 성장 기록을 관리하고 싶은 부모**를 위한 **성장 일기 타임라인 서비스**로 다음 기능을 제공합니다:

- **DB 데이터 연동 (F001)**: PostgreSQL + Prisma를 통해 성장 기록을 자동으로 fetch하여 웹에 렌더링
- **타임라인 렌더링 (F002)**: 날짜 역순으로 정렬된 성장 기록 카드를 세로 타임라인 형태로 표시
- **태그 필터링 (F003)**: 상단 태그 칩(chip) UI로 원하는 이정표 태그의 기록만 필터링
- **사진 모달 뷰어 (F004)**: 기록 카드 클릭 시 사진 확대 및 전체 메모를 오버레이 모달로 표시
- **요약 통계 표시 (F005)**: 총 기록 수, 첫 이벤트 날짜, 최근 기록 등 전체 맥락을 한눈에 제공
- **ISR 성능 최적화 (F006)**: Incremental Static Regeneration으로 DB 호출 최소화 및 빠른 로딩

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

  **"## 테스트 체크리스트" 필수 포함 구조:**

  ```
  ## 테스트 체크리스트 (Playwright MCP)

  ### Happy Path
  - [ ] [정상 시나리오 1]: 예상 결과 확인
  - [ ] [정상 시나리오 2]: 예상 결과 확인

  ### 에러/실패 케이스
  - [ ] [잘못된 입력/권한 없음 등]: 에러 메시지 또는 상태 코드 확인
  - [ ] [서버 오류 시]: Fallback UI 또는 에러 처리 확인

  ### 엣지 케이스
  - [ ] [빈 데이터/최대값/경계값]: 예상 동작 확인
  - [ ] [동시 요청/네트워크 지연]: 처리 결과 확인
  ```

- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 반드시 아래 순서로 진행:**
  1. 기능 구현
  2. Playwright MCP로 Happy Path 테스트 실행 및 확인
  3. Playwright MCP로 에러/실패 케이스 테스트 실행 및 확인
  4. Playwright MCP로 엣지 케이스 테스트 실행 및 확인
  5. 모든 테스트 통과 확인 후에만 단계 완료 처리
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- **테스트 미통과 시 반드시 수정 후 재테스트 — 다음 단계 진행 불가**
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - ✅ Next.js 15.5.3 App Router 기반 전체 라우트 구조 생성
  - ✅ 루트 페이지(`app/page.tsx`) 빈 껍데기 파일 생성 (타임라인 페이지)
  - ✅ 공통 레이아웃(`app/layout.tsx`) 및 헤더 컴포넌트 골격 구현
  - ✅ 글로벌 스타일(`app/globals.css`) 및 TailwindCSS v4 설정 검증
  - ✅ 메타데이터(title, description, OG 태그) 기본값 설정
  - ✅ 폰트(Geist 또는 Pretendard) 설정 및 적용
  - ✅ `not-found.tsx`, `error.tsx`, `loading.tsx` 기본 페이지 골격 생성

- **Task 002: 타입 정의 및 DB 스키마 인터페이스 설계** ✅ - 완료
  - ✅ `GrowthRecord` 인터페이스 정의 (id, title, date, photoUrl, tags, memo, ageMonths)
  - ✅ DB 속성 타입 매핑 (title, date, url, multi_select, rich_text, formula/number)
  - ✅ 태그 타입 및 태그 색상 매핑 상수 정의 (`types/tag.ts`)
  - ✅ 요약 통계 타입 정의 (`TimelineSummary`: totalCount, firstEventDate, latestRecord)
  - ✅ 공통 유틸 타입 정의 (ISO date 문자열 파싱 등)
  - ✅ `.env.local.example` 파일 생성 (DATABASE_URL)

- **Task 003: DB 클라이언트 기반 구조 설정** ✅ - 완료 (PostgreSQL/Prisma로 변경)
  - ✅ `prisma` + `@prisma/adapter-pg` 패키지 설치 및 초기화
  - ✅ `lib/db/client.ts` Prisma 클라이언트 싱글톤 구성
  - ✅ `lib/db/queries.ts` fetchGrowthRecords, fetchRecordById, fetchTimelineSummary 구현
  - ✅ 환경 변수 검증 유틸(`lib/env.ts`) 구현 (Zod 기반)
  - ✅ Prisma 스키마(`prisma/schema.prisma`) GrowthRecord, TimelineSummary 모델 정의

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 004: 공통 컴포넌트 라이브러리 구현** ✅ - 완료
  - ✅ shadcn/ui 기반 공통 컴포넌트 설치 (Button, Badge, Dialog, Card, Skeleton)
  - ✅ 디자인 토큰 및 색상 팔레트(아이 성장 기록에 어울리는 파스텔 톤) 정의
  - ✅ 태그 칩(Chip) 컴포넌트 구현 (선택/해제 상태, 색상별 스타일)
  - ✅ 타임라인 카드(TimelineCard) 컴포넌트 구현 (날짜, 썸네일, 제목, 태그 뱃지, 메모 요약)
  - ✅ 요약 통계 카드(StatsCard) 컴포넌트 구현 (총 기록 수, 첫 이벤트, 최근 기록)
  - ✅ 이미지 최적화 래퍼 컴포넌트(SafeImage) 구현 (next/image 기반, fallback 처리)
  - ✅ 빈 상태(EmptyState) 및 로딩 스켈레톤 컴포넌트 구현
  - ✅ 더미 데이터 생성 유틸리티(`lib/mock/growth-records.ts`) 작성 (10~20개 샘플 레코드)

- **Task 005: 타임라인 페이지 UI 완성** ✅ - 완료
  - ✅ 헤더 영역 구현 (로고/사이트명, 반응형 레이아웃)
  - ✅ 요약 통계 섹션 구현 (더미 데이터 기반 총 기록 수, 첫 이벤트 날짜, 최근 기록)
  - ✅ 태그 필터 칩 영역 UI 구현 ('전체 보기' 포함, 태그 동적 렌더링 대비 구조)
  - ✅ 타임라인 세로선 + 카드 목록 UI 구현 (date marker, 단일 컬럼)
  - ✅ 날짜 역순 정렬된 카드 목록 렌더링
  - ✅ 반응형 레이아웃 적용 (모바일: 단일 컬럼, 태블릿/데스크탑: 중앙 정렬 세로 타임라인)
  - ✅ 스크롤 시 카드 페이드인 애니메이션 적용
  - ✅ 접근성(a11y) 검증: 시맨틱 마크업, aria-label, 키보드 네비게이션

- **Task 006: 사진 상세 모달 UI 완성** ✅ - 완료
  - ✅ shadcn/ui Dialog 기반 상세 모달 컴포넌트 구현 (PhotoDetailModal)
  - ✅ 확대 사진 표시 영역 구현 (next/image, aspect ratio 유지)
  - ✅ 이벤트 제목, 날짜, 태그 목록, 개월 수(Age) 표시 영역
  - ✅ 전체 메모(rich_text) 본문 표시 영역 (줄바꿈 및 기본 포맷팅)
  - ✅ 배경 클릭 및 닫기 버튼으로 모달 닫기 동작 구현
  - ✅ ESC 키로 모달 닫기 지원
  - ✅ 모달 열림/닫힘 애니메이션 (fade + scale)
  - ✅ 모바일 풀스크린, 데스크탑 고정 크기 반응형 대응

- **Task 007: 태그 필터링 상호작용 구현 (클라이언트 상태)** ✅ - 완료
  - ✅ 타임라인 페이지 클라이언트 컴포넌트(TimelineView) 분리
  - ✅ useState 기반 선택 태그 상태 관리
  - ✅ 다중 태그 선택/해제 토글 동작 구현
  - ✅ '전체 보기' 칩 클릭 시 모든 필터 해제
  - ✅ 선택된 태그에 해당하는 카드만 필터링 (OR 전략)
  - ✅ 필터링 결과 빈 상태 UI 표시
  - ✅ 모달 열림/닫힘 상태 관리 (선택된 레코드 저장)
  - ✅ 모달 닫기 시 기존 필터 상태 유지 검증

### Phase 3: 핵심 기능 구현 (DB 실제 연동)

- **Task 008: DB 실제 연동 및 데이터 매핑** ✅ - 완료 (PostgreSQL/Prisma로 변경)
  - ✅ PostgreSQL DB 생성 및 Prisma 마이그레이션 (`prisma db push`)
  - ✅ 환경 변수(`DATABASE_URL`) 실제 값 주입
  - ✅ `lib/db/queries.ts` fetchGrowthRecords 실제 구현 (Prisma ORM 호출)
  - ✅ DB row → GrowthRecord 변환 로직 구현 (mapRecord 함수)
  - ✅ DB 에러 핸들링 및 빈 결과 처리

- **Task 009: 타임라인 페이지 서버 컴포넌트 및 ISR 적용** ✅ - 완료
  - ✅ `app/page.tsx` 서버 컴포넌트로 DB 데이터 fetch
  - ✅ `revalidate = 3600` export로 ISR 설정
  - ✅ 더미 데이터를 실제 DB 데이터로 교체
  - ✅ 요약 통계 서버 사이드 계산 (totalCount, firstEventDate, latestRecord)
  - ✅ 태그 목록 동적 생성 (DB multi_select 기반)
  - ✅ 날짜 역순 정렬 서버 사이드 처리
  - ✅ 로딩 상태(`loading.tsx`) 및 에러 경계(`error.tsx`) 실제 연결

- **Task 010: 사진 상세 모달 실제 데이터 연동** ✅ - 완료
  - ✅ 타임라인 카드 클릭 시 해당 레코드를 클라이언트 상태에 저장
  - ✅ 모달에 실제 GrowthRecord 데이터 전달 및 렌더링
  - ✅ photoUrl이 null인 경우 기본 placeholder 이미지 표시
  - ✅ memo가 비어있는 경우 빈 상태 문구 표시
  - ✅ 외부 이미지 URL 도메인 next.config.ts `remotePatterns` 설정

- **Task 011: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ Happy Path: 타임라인 진입 → 데이터 렌더링 → 태그 필터 → 카드 클릭 → 모달 → 닫기 전체 플로우 확인
  - ✅ 에러 케이스: DB 연결 실패 시 error.tsx fallback 표시 확인
  - ✅ 엣지 케이스: 빈 DB / 이미지 없는 레코드 / 메모 없는 레코드 확인
  - ✅ 접근성(a11y) 검증 (aria-label, 키보드 네비게이션)

### Phase 4: 고급 기능 및 최적화 ✅

- **Task 012: 성능 최적화 및 SEO** ✅ - 완료
  - ✅ next/image 최적화 (sizes, priority 설정)
  - ✅ 메타데이터 최종 설정 (OG 태그, Twitter 카드)
  - ✅ sitemap.ts, robots.ts 생성 (App Router 규칙 기반)
  - ✅ Vercel Analytics 연동

- **Task 013: 배포 및 운영 환경 구축** ✅ - 완료
  - ✅ Vercel 프로젝트 생성 및 GitHub 연동
  - ✅ Vercel 환경 변수 설정 (`DATABASE_URL`)
  - ✅ Preview 배포 검증 (PR 단위)
  - ✅ 커스텀 도메인 연결 (선택)
  - ✅ `npm run check-all` 및 `npm run build` CI 통과 확인
  - ✅ Husky + lint-staged pre-commit 훅 동작 검증
  - ✅ 배포 후 프로덕션 환경 E2E 스모크 테스트 (Playwright MCP)
  - ✅ 모니터링(Vercel Analytics) 및 에러 로깅 설정
  - ✅ On-demand Revalidation API 라우트 구축 (DB 변경 시 즉시 반영)

---

### Phase 5: 콘텐츠 관리 (우선순위 높음) 📋 예정

> 웹 UI에서 직접 성장 기록을 추가·수정·삭제할 수 있는 관리자 기능

- **Task 014: 관리자 인증 (F101)**
  - 이메일/비밀번호 또는 Google OAuth 기반 관리자 로그인
  - Next.js Middleware로 `/admin/*` 경로 보호
  - 세션 관리 (NextAuth.js 또는 자체 JWT)
  - 로그인/로그아웃 UI

- **Task 015: 기록 추가 / 수정 (F102)**
  - 관리자 UI에서 성장 기록 작성 폼 (제목, 날짜, 태그, 메모, 개월 수)
  - Prisma 기반 create / update 쿼리
  - Server Action으로 폼 제출 처리
  - 저장 후 On-demand Revalidation 트리거

- **Task 016: 기록 삭제 (F103)**
  - 관리자 UI에서 기록 삭제 버튼 + 확인 모달
  - Prisma 기반 delete 쿼리 (Hard delete)
  - 삭제 후 타임라인 즉시 갱신

- **Task 017: 사진 업로드 (F104)**
  - 로컬 파일 → 클라우드 스토리지 업로드 (Vercel Blob 또는 AWS S3)
  - 업로드된 URL을 `photoUrl` 필드에 저장
  - 업로드 진행 표시 및 미리보기

- **Task 018: 태그 관리 (F105)**
  - 관리자 UI에서 커스텀 태그 추가 · 색상 변경
  - `TAG_COLORS` 하드코딩 → DB 기반으로 전환
  - 태그 삭제 시 연관 기록 처리 정책 결정

---

### Phase 6: UX 고도화 (우선순위 중간) 📋 예정

> 기록이 쌓일수록 더 편리한 탐색 경험 제공

- **Task 019: 다크 모드 토글 (F202)**
  - 헤더에 라이트/다크 모드 전환 버튼 추가
  - `next-themes` ThemeProvider 활성화 (이미 설치됨)
  - 시스템 설정 자동 감지 + 수동 전환 지원

- **Task 020: 전체 텍스트 검색 (F201)**
  - 제목·메모 키워드 검색
  - PostgreSQL full-text search 또는 클라이언트 사이드 필터링
  - 검색창 UI + 결과 하이라이팅

- **Task 021: 연도별 그룹핑 (F203)**
  - 타임라인을 연도 단위로 섹션 구분
  - 연도 헤더 클릭으로 접기/펼치기
  - 기록이 많아질 때 탐색 편의성 향상

- **Task 022: 무한 스크롤 / 페이지네이션 (F204)**
  - 기록 증가 시 성능 최적화
  - Prisma cursor-based pagination 적용
  - 무한 스크롤 또는 "더 보기" 버튼 방식 선택

- **Task 023: 개별 기록 공유 (F205)**
  - 개별 기록 고유 URL 생성 (`/record/[id]`)
  - 링크 복사 · 카카오 · 트위터 공유 버튼
  - OG 메타데이터 기록별 동적 생성

- **Task 024: 이미지 갤러리 뷰 (F206)**
  - 타임라인 ↔ 사진 그리드 뷰 전환 탭
  - 사진 중심으로 기록 탐색

---

### Phase 7: 소셜 & 확장 (우선순위 낮음) 📋 예정

> 가족·지인과 함께하는 성장 기록 공유 확장

- **Task 025: 댓글 기능 (F301)**
  - 가족·지인이 기록에 댓글 작성
  - 비회원 닉네임 + 댓글 방식 또는 소셜 로그인 연동
  - 댓글 DB 스키마 및 API 구현

- **Task 026: 성장 차트 (F304)**
  - 월별 기록 수, 태그별 분포 시각화
  - recharts 또는 chart.js 활용
  - 통계 페이지 또는 대시보드 섹션

- **Task 027: 알림 / 기념일 (F305)**
  - 생일·기념일 도래 시 이메일·푸시 알림
  - Vercel Cron + Resend (또는 nodemailer)
  - 알림 수신 설정 UI

- **Task 028: 다국어 지원 (F303)**
  - 한국어/영어 전환
  - `next-intl` 또는 `next/i18n` 기반 구현

- **Task 029: 멀티 아이 프로필 (F306)**
  - 여러 아이의 성장 기록을 분리 관리
  - DB에 `childId` 필드 추가 및 마이그레이션
  - 아이별 타임라인 전환 UI
