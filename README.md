# 한채연 · 웹 개발자 포트폴리오

프론트엔드와 풀스택 개발 경험을 담은 반응형 포트폴리오 웹사이트입니다.

**사이트:** https://imi21123.github.io/web-developer-portfolio/

## 구성

- Celevu · YouthPick · ReadyVery · Prolog · Coedu
- 프로젝트별 개요, 핵심 기여, 문제 해결 경험
- 협업 경험과 교육·활동 이력
- 메인 화면과 프로젝트별 상세 화면, 상세 목차, 이력 필터
- 기존 24페이지 포트폴리오의 내용과 14개 상세 사례를 유지

## 파일

- `index.html`: 포트폴리오 콘텐츠
- `styles.css`: 데스크톱 및 모바일 스타일
- `portfolio.js`: 프로젝트 탐색, 모바일 메뉴, 이력 필터
- `analytics.js`: Google Analytics 4 방문·프로젝트·연락처 클릭 분석
- `assets/`: Pretendard 웹폰트와 폰트 라이선스

## 배포

GitHub Pages에서 `main` 브랜치의 루트 폴더를 게시합니다.
이 저장소의 파일을 수정해 `main`에 push하면 사이트가 갱신됩니다.
별도 빌드 과정은 없습니다.

## 방문 분석 · Google Analytics 4

`index.html`의 `google-analytics-id` 메타 태그에 웹 데이터 스트림의
실제 측정 ID(`G-`로 시작)를 입력하면 수집이 활성화됩니다.
현재 ID가 비어 있어 아직 방문 통계를 전송하지 않습니다.

Google Analytics에서 속성과 웹 데이터 스트림을 만들고 사이트 주소를
`https://imi21123.github.io/web-developer-portfolio/`로 설정합니다.
수동 페이지뷰와 중복되지 않도록 웹 스트림의 **향상된 측정**은 끕니다.

- `page_view`: 최초 방문 및 메인·프로젝트 상세 화면 전환
- `project_view`: 프로젝트 상세 진입
- `case_view`: 실제 화면에 노출된 상세 사례
- `section_view`: 소개·프로젝트·협업·이력 섹션 조회
- `contact_click`: 이메일·GitHub 링크 클릭

메인 내부의 목차 이동, 같은 프로젝트 내 이동, 글꼴 로딩에 따른 재표시는
새 페이지뷰로 중복 집계하지 않습니다. 광고용 신호는 비활성화하며,
쿼리 문자열·메일 주소·사용자 이름을 별도 이벤트 데이터로 보내지 않습니다.
로컬 미리보기와 브라우저의 추적 거부 설정에서는 수집하지 않습니다.

확인 화면: Google Analytics → 보고서 → 실시간 및 참여도 → 이벤트.
프로젝트별 조회 수는 페이지 제목 또는 `project_view` 이벤트로
구분할 수 있습니다. 프로젝트명과 사례명을 탐색 보고서에서 집계하려면
`project_name`, `section_id`, `section_name`을 이벤트 범위 맞춤 측정기준으로 등록합니다.

## 폰트

Pretendard를 사용합니다. 폰트는 SIL Open Font License 1.1로 배포되며,
원문 라이선스는 `assets/Pretendard-LICENSE.txt`에 포함되어 있습니다.
