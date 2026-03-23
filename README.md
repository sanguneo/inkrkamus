<p align="center">
  <img src="./public/img/info-logo.png" alt="InKrKamus Logo" width="320" />
</p>

<h1 align="center">InKrKamus</h1>
<p align="center">인도네시아어-한국어 사전 (React + Vite + IndexedDB)</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Dexie" src="https://img.shields.io/badge/IndexedDB-Dexie-1b7f79" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

Electron 의존성을 제거하고 정적 호스팅에 맞게 리빌드한 프로젝트입니다.  
브라우저 환경에서 빠른 검색과 재방문 로딩 최적화에 초점을 맞췄습니다.

## 주요 기능

- 검색 타입: 인니어(`in`) / 한국어(`kr`) / 영어(`en`) / 어근(`rt`)
- 로마자 변환 토글
- 다국어 UI (한국어/영어/인도네시아어)
- 모바일 반응형 (리스트 화면 / 상세 화면 분리)
- 좌측 단어 리스트 가상 스크롤
- 검색 디바운스 + 결과 캐시
- 서비스워커 기반 오프라인 캐시

## 데이터/로딩 구조

- 원본 DB: `db/kamus.sqlite`
- 배포 데이터: `public/data/dictionary.json`
- 압축 데이터: `public/data/dictionary.json.gz`, `public/data/dictionary.json.br`
- 버전 매니페스트: `public/data/manifest.json`

로딩 전략:

- 첫 화면은 로컬 IndexedDB 데이터로 즉시 부팅
- 백그라운드에서 `manifest.json` 버전 확인
- 버전이 바뀐 경우에만 전체 JSON 갱신 + 인덱싱 수행

## 시작하기

```bash
pnpm install
pnpm dev
```

## 빌드

```bash
pnpm build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

## 데이터 갱신

SQLite -> JSON 추출:

```bash
pnpm data:export
```

JSON + 압축본까지 생성:

```bash
pnpm data:prepare
```

## 프로젝트 구조

- `src/`: 애플리케이션 코드
- `src/components/`: UI 컴포넌트
- `src/lib/`: 검색/DB 로직
- `src/workers/`: IndexedDB 인덱싱 워커
- `public/`: 정적 에셋/사전 데이터
- `db/`: 원본 SQLite
- `tools/`: 데이터 추출/압축 스크립트

## 배포

`dist/` 정적 파일 배포만으로 동작합니다.

- Netlify
- Vercel
- GitHub Pages
- Nginx / Apache

## 라이선스

[MIT License](./LICENSE)

