# Mapo Business Manager Backend

마포종합식품 관리프로그램의 백엔드 API 서버입니다.

## 기술 스택

- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증 토큰
- **bcryptjs** - 비밀번호 해싱
- **Winston** - 로깅

## 주요 기능

### 인증 시스템

- 회원가입/로그인
- JWT 토큰 기반 인증
- 비밀번호 암호화
- 사용자 프로필 관리

### 데이터 관리

- **회사 관리**: 거래처, 협력업체 등 회사 정보 CRUD
- **배송 관리**: 배송 정보 및 상태 관리
- **계산서 관리**: 세금계산서 생성 및 관리
- **제품 관리**: 제품 정보 관리
- **사용자 관리**: 관리자 기능

### API 특징

- RESTful API 설계
- 데이터 검증 및 에러 처리
- 페이지네이션 지원
- 검색 및 필터링
- 통계 데이터 제공
- 사용자별 데이터 분리

## 설치 및 실행

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 환경 변수 설정

```bash
cp env.example .env
```

`.env` 파일을 편집하여 필요한 설정을 입력하세요:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mapo_business_manager
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### 3. MongoDB 실행

MongoDB가 설치되어 있고 실행 중인지 확인하세요.

### 4. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 인증 (Authentication)

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 수정
- `PUT /api/auth/password` - 비밀번호 변경

### 회사 관리 (Companies)

- `GET /api/companies` - 회사 목록 조회
- `GET /api/companies/:id` - 회사 상세 조회
- `POST /api/companies` - 회사 생성
- `PUT /api/companies/:id` - 회사 수정
- `DELETE /api/companies/:id` - 회사 삭제
- `GET /api/companies/stats/overview` - 회사 통계

### 배송 관리 (Deliveries)

- `GET /api/deliveries` - 배송 목록 조회
- `GET /api/deliveries/:id` - 배송 상세 조회
- `POST /api/deliveries` - 배송 생성
- `PUT /api/deliveries/:id` - 배송 수정
- `DELETE /api/deliveries/:id` - 배송 삭제
- `GET /api/deliveries/stats/overview` - 배송 통계

### 계산서 관리 (Invoices)

- `GET /api/invoices` - 계산서 목록 조회
- `GET /api/invoices/:id` - 계산서 상세 조회
- `POST /api/invoices` - 계산서 생성
- `PUT /api/invoices/:id` - 계산서 수정
- `DELETE /api/invoices/:id` - 계산서 삭제
- `GET /api/invoices/stats/overview` - 계산서 통계

### 제품 관리 (Products)

- `GET /api/products/categories` - 제품 카테고리 조회
- `GET /api/products` - 제품 목록 조회
- `POST /api/products` - 제품 생성
- `PUT /api/products/:id` - 제품 수정
- `DELETE /api/products/:id` - 제품 삭제

### 사용자 관리 (Users) - 관리자만

- `GET /api/users` - 사용자 목록 조회
- `GET /api/users/:id` - 사용자 상세 조회
- `PUT /api/users/:id/role` - 사용자 역할 변경
- `PUT /api/users/:id/status` - 사용자 상태 변경
- `DELETE /api/users/:id` - 사용자 삭제
- `GET /api/users/stats/overview` - 사용자 통계

## 데이터베이스 스키마

### User (사용자)

- email, password, name, phoneNumber
- role (admin, manager, user)
- isActive, lastLogin
- preferences (언어, 시간대, 알림 설정)

### Company (회사)

- name, type, region, status
- address, phoneNumber, email
- businessNumber, contactPerson, contactPhone
- memo, isFavorite, tags
- lastContactDate, nextContactDate
- userId (사용자별 데이터 분리)

### Delivery (배송)

- deliveryNumber, companyId
- products (배열), totalAmount
- deliveryDate, deliveryAddress, deliveryMemo
- driverName, driverPhone, status
- userId (사용자별 데이터 분리)

### Invoice (계산서)

- invoiceNumber, companyId
- items (배열), totalSupplyAmount, totalTaxAmount, totalAmount
- issueDate, dueDate, status
- memo, attachments
- userId (사용자별 데이터 분리)

## 보안 기능

- **CORS** 설정으로 허용된 도메인에서만 접근 가능
- **Rate Limiting**으로 API 호출 제한
- **Helmet**으로 보안 헤더 설정
- **JWT** 토큰 기반 인증
- **bcrypt**로 비밀번호 해싱
- **입력 데이터 검증** 및 **에러 처리**

## 로깅

Winston을 사용하여 로그를 관리합니다:

- `logs/error.log` - 에러 로그
- `logs/combined.log` - 전체 로그
- 개발 환경에서는 콘솔에도 출력

## 개발 가이드

### 새로운 API 엔드포인트 추가

1. `src/models/`에 데이터 모델 생성
2. `src/routes/`에 라우트 파일 생성
3. `src/server.js`에 라우트 등록
4. 필요한 경우 미들웨어 추가

### 데이터 검증

`express-validator`를 사용하여 입력 데이터를 검증합니다.

### 에러 처리

모든 에러는 `src/middleware/errorHandler.js`에서 중앙 처리됩니다.

## 배포

### 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수들을 설정해야 합니다:

- `NODE_ENV=production`
- `MONGODB_URI` (프로덕션 MongoDB URI)
- `JWT_SECRET` (강력한 시크릿 키)
- `CORS_ORIGIN` (프로덕션 도메인)

### PM2를 사용한 배포

```bash
npm install -g pm2
pm2 start src/server.js --name mapo-backend
pm2 startup
pm2 save
```

## 문제 해결

### MongoDB 연결 오류

- MongoDB가 실행 중인지 확인
- 연결 URI가 올바른지 확인
- 방화벽 설정 확인

### JWT 토큰 오류

- JWT_SECRET이 설정되어 있는지 확인
- 토큰이 만료되지 않았는지 확인

### CORS 오류

- CORS_ORIGIN에 클라이언트 도메인이 포함되어 있는지 확인
