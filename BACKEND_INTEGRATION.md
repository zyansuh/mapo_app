# 백엔드 연동 가이드

마포종합식품 관리프로그램에 백엔드 시스템을 연동하여 데이터를 클라우드에서 공유할 수 있도록 설정하는 가이드입니다.

## 🎯 목표

- 로컬 스토리지 대신 백엔드 서버를 통한 데이터 관리
- 여러 기기 간 데이터 동기화
- 사용자 인증 및 권한 관리
- 실시간 데이터 공유

## 🏗️ 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Backend API   │    │    MongoDB      │
│     Frontend    │◄──►│   (Node.js)     │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 구현된 기능

### 백엔드 (Node.js + Express + MongoDB)

- ✅ 사용자 인증 시스템 (JWT)
- ✅ 회사 관리 API
- ✅ 배송 관리 API
- ✅ 계산서 관리 API
- ✅ 제품 관리 API
- ✅ 데이터 검증 및 에러 처리
- ✅ 보안 미들웨어 (CORS, Rate Limiting, Helmet)
- ✅ 로깅 시스템

### 프론트엔드 (React Native)

- ✅ API 서비스 업데이트
- ✅ 인증 훅 (useAuth)
- ✅ 데이터 동기화 훅 (useDataSync)
- ✅ 로그인 화면
- ✅ 자동 토큰 관리

## 🚀 시작하기

### 1. 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 설정 입력

# MongoDB 실행 (별도 터미널)
mongod

# 백엔드 서버 실행
npm run dev
```

또는 시작 스크립트 사용:

```bash
./start.sh
```

### 2. 프론트엔드 앱 실행

```bash
# 프로젝트 루트에서
npm start
```

## 🔧 환경 설정

### 백엔드 환경 변수 (.env)

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mapo_business_manager
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### 프론트엔드 환경 변수

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## 📡 API 엔드포인트

### 인증

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 수정

### 회사 관리

- `GET /api/companies` - 회사 목록
- `POST /api/companies` - 회사 생성
- `PUT /api/companies/:id` - 회사 수정
- `DELETE /api/companies/:id` - 회사 삭제

### 배송 관리

- `GET /api/deliveries` - 배송 목록
- `POST /api/deliveries` - 배송 생성
- `PUT /api/deliveries/:id` - 배송 수정
- `DELETE /api/deliveries/:id` - 배송 삭제

### 계산서 관리

- `GET /api/invoices` - 계산서 목록
- `POST /api/invoices` - 계산서 생성
- `PUT /api/invoices/:id` - 계산서 수정
- `DELETE /api/invoices/:id` - 계산서 삭제

## 🔄 데이터 동기화

### 자동 동기화

- 앱 시작 시 서버에서 최신 데이터 다운로드
- 5분마다 로컬 변경사항을 서버로 업로드
- 온라인/오프라인 상태 자동 감지

### 수동 동기화

```typescript
import { useDataSync } from "../hooks/useDataSync";

const { fullSync, syncToServer, syncFromServer } = useDataSync();

// 전체 동기화
await fullSync();

// 서버로 업로드
await syncToServer();

// 서버에서 다운로드
await syncFromServer();
```

## 🔐 인증 시스템

### 로그인/회원가입

```typescript
import { useAuth } from "../hooks/useAuth";

const { login, register, logout, user, isAuthenticated } = useAuth();

// 로그인
await login("user@example.com", "password");

// 회원가입
await register({
  email: "user@example.com",
  password: "password",
  name: "사용자명",
});

// 로그아웃
await logout();
```

### 토큰 관리

- JWT 토큰 자동 저장/관리
- 토큰 만료 시 자동 갱신
- 로그아웃 시 토큰 삭제

## 📱 사용법

### 1. 첫 실행

1. 앱을 실행하면 로그인 화면이 표시됩니다
2. 회원가입을 진행하거나 기존 계정으로 로그인합니다
3. 로그인 성공 시 홈 화면으로 이동합니다

### 2. 데이터 관리

- 모든 데이터는 자동으로 서버와 동기화됩니다
- 오프라인 상태에서도 로컬 데이터를 사용할 수 있습니다
- 온라인 상태가 되면 자동으로 동기화됩니다

### 3. 다중 기기 사용

- 같은 계정으로 다른 기기에서 로그인하면 동일한 데이터에 접근할 수 있습니다
- 한 기기에서 변경한 내용이 다른 기기에서도 반영됩니다

## 🛠️ 개발 가이드

### 새로운 API 엔드포인트 추가

1. `backend/src/models/`에 데이터 모델 생성
2. `backend/src/routes/`에 라우트 파일 생성
3. `backend/src/server.js`에 라우트 등록
4. `src/services/api.ts`에 클라이언트 메서드 추가

### 새로운 화면 추가

1. `src/screens/`에 화면 컴포넌트 생성
2. `src/navigation/`에 네비게이션 설정 추가
3. 필요한 경우 새로운 훅 생성

## 🚨 문제 해결

### 백엔드 서버가 시작되지 않는 경우

1. MongoDB가 실행 중인지 확인
2. 포트 3001이 사용 중이지 않은지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### 프론트엔드에서 API 호출이 실패하는 경우

1. 백엔드 서버가 실행 중인지 확인
2. API URL이 올바른지 확인
3. CORS 설정이 올바른지 확인

### 데이터 동기화가 되지 않는 경우

1. 네트워크 연결 상태 확인
2. 사용자 인증 상태 확인
3. 서버 로그 확인

## 📈 성능 최적화

### 백엔드

- 데이터베이스 인덱스 최적화
- API 응답 캐싱
- Rate Limiting 적용

### 프론트엔드

- 데이터 로컬 캐싱
- 불필요한 API 호출 방지
- 오프라인 지원

## 🔒 보안 고려사항

- JWT 토큰 보안
- API 엔드포인트 인증
- 입력 데이터 검증
- CORS 설정
- Rate Limiting

## 📝 다음 단계

1. **프로덕션 배포**

   - 클라우드 서버 설정 (AWS, GCP, Azure)
   - 도메인 및 SSL 인증서 설정
   - 데이터베이스 클러스터 구성

2. **추가 기능**

   - 실시간 알림 (WebSocket)
   - 파일 업로드/다운로드
   - 데이터 백업/복원
   - 사용자 권한 관리

3. **모니터링**
   - 로그 수집 및 분석
   - 성능 모니터링
   - 에러 추적

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. 백엔드 로그 확인
2. 프론트엔드 콘솔 로그 확인
3. 네트워크 탭에서 API 요청/응답 확인

---

이제 로컬 스토리지 대신 백엔드 서버를 통해 데이터를 관리하고 여러 기기 간에 동기화할 수 있습니다! 🎉
