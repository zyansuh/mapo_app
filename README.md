# 📱 마포 비즈니스 매니저 (Mapo Business Manager)

<div align="center">

![Mapo Business Manager Logo](./assets/mapo-icon.png)

**🏢 종합적인 비즈니스 관리 솔루션**

_마포종합식품의 거래처, 계산서, 배송, 매출을 한 번에 관리하는 스마트한 모바일 앱_

[![React Native](https://img.shields.io/badge/React_Native-0.79.5-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-53.0.17-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React](https://img.shields.io/badge/React-19.0.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)](https://developer.apple.com/ios/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📋 목차

- [✨ 주요 특징](#-주요-특징)
- [🛠️ 기술 스택](#️-기술-스택)
- [🔄 렌더링 방식 및 아키텍처](#-렌더링-방식-및-아키텍처)
- [🎯 핵심 기능](#-핵심-기능)
- [📱 화면 구성](#-화면-구성)
- [🏗️ 아키텍처](#️-아키텍처)
- [🚀 설치 및 실행](#-설치-및-실행)
- [📖 사용법](#-사용법)
- [🔧 개발환경 설정](#-개발환경-설정)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [📝 최근 업데이트](#-최근-업데이트)
- [🤝 기여하기](#-기여하기)
- [📞 지원 및 문의](#-지원-및-문의)
- [📄 라이선스](#-라이선스)

---

## ✨ 주요 특징

### 🎨 **현대적인 UI/UX**

- **Material Design 3** 기반의 세련된 인터페이스
- **🆕 스마트 인터랙션** - 과세구분별 동적 라벨, 직관적 드롭다운
- **🆕 맥락적 피드백** - 거래처명 포함 완료 메시지, 명확한 오류 안내
- **반응형 스케일링 시스템** - 모든 디바이스에서 일관된 사용자 경험
- **다이나믹 컬러 시스템** - 브랜드 아이덴티티를 반영한 색상 팔레트
- **부드러운 애니메이션과 전환 효과**

### 📊 **강력한 데이터 관리**

- **실시간 데이터 동기화** - 모든 변경사항 즉시 반영
- **로컬 스토리지 캐싱** - 오프라인에서도 원활한 사용
- **자동 백업 및 복원** - 데이터 손실 방지
- **대용량 일괄 처리** - CSV, Excel 파일 가져오기/내보내기

### 🔍 **스마트 검색 및 필터링**

- **고급 검색 알고리즘** - 부분 매칭, 퍼지 검색 지원
- **다중 조건 필터** - 날짜, 카테고리, 상태별 필터링
- **실시간 검색 결과** - 타이핑과 동시에 즉시 결과 표시
- **검색 히스토리 관리** - 자주 사용하는 검색어 저장

### 📈 **비즈니스 인텔리전스**

- **실시간 대시보드** - 핵심 KPI 및 통계 시각화
- **매출 트렌드 분석** - 시계열 차트 및 예측 분석
- **거래처별 성과 분석** - 개별 거래처 수익성 평가
- **상품별 판매 통계** - 베스트셀러 및 재고 최적화

---

## 🛠️ 기술 스택

### **📱 Frontend & Mobile**

[![React Native](https://img.shields.io/badge/React_Native-0.79.5-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.0.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-53.0.17-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

### **🎨 UI/UX & Design System**

[![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![React Native SVG](https://img.shields.io/badge/React_Native_SVG-15.12.0-FF6B6B?style=for-the-badge&logo=svg&logoColor=white)](https://github.com/software-mansion/react-native-svg)
[![Linear Gradient](https://img.shields.io/badge/Linear_Gradient-14.1.5-4ECDC4?style=for-the-badge&logo=gradient&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
[![Vector Icons](https://img.shields.io/badge/Vector_Icons-Ionicons-3498DB?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicons.com/)

### **🧭 Navigation & State**

[![React Navigation](https://img.shields.io/badge/React_Navigation-7.1.14-6366F1?style=for-the-badge&logo=react&logoColor=white)](https://reactnavigation.org/)
[![React Hooks](https://img.shields.io/badge/React_Hooks-Custom-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/docs/hooks-intro.html)
[![Context API](https://img.shields.io/badge/Context_API-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/docs/context.html)

### **💾 Data & Storage**

[![AsyncStorage](https://img.shields.io/badge/AsyncStorage-2.1.2-FF9500?style=for-the-badge&logo=database&logoColor=white)](https://react-native-async-storage.github.io/async-storage/)
[![FileSystem](https://img.shields.io/badge/FileSystem-18.1.11-34C759?style=for-the-badge&logo=files&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/filesystem/)
[![React Native FS](https://img.shields.io/badge/React_Native_FS-2.20.0-007AFF?style=for-the-badge&logo=folder&logoColor=white)](https://github.com/itinance/react-native-fs)

### **📊 Charts & Analytics**

[![Chart Kit](https://img.shields.io/badge/Chart_Kit-6.12.0-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://github.com/indiespirit/react-native-chart-kit)
[![React Native SVG Charts](https://img.shields.io/badge/SVG_Charts-Custom-36A2EB?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://github.com/JesperLekland/react-native-svg-charts)

### **📞 Communication & Integration**

[![Phone Call](https://img.shields.io/badge/Phone_Call-1.2.0-25D366?style=for-the-badge&logo=phone&logoColor=white)](https://github.com/kianmeng/react-native-phone-call)
[![Call Detection](https://img.shields.io/badge/Call_Detection-1.9.0-FF3B30?style=for-the-badge&logo=detectify&logoColor=white)](https://github.com/priteshrnandgaonkar/react-native-call-detection)
[![Network Info](https://img.shields.io/badge/Network_Info-11.4.1-5856D6?style=for-the-badge&logo=wifi&logoColor=white)](https://github.com/react-native-netinfo/react-native-netinfo)

### **🔧 QR Code & Utilities**

[![QR Code SVG](https://img.shields.io/badge/QR_Code_SVG-6.3.15-000000?style=for-the-badge&logo=qr-code&logoColor=white)](https://github.com/awesomejerry/react-native-qrcode-svg)
[![Sharing](https://img.shields.io/badge/Sharing-13.1.5-007AFF?style=for-the-badge&logo=share&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/sharing/)
[![Gesture Handler](https://img.shields.io/badge/Gesture_Handler-2.24.0-8A2BE2?style=for-the-badge&logo=gesture&logoColor=white)](https://docs.swmansion.com/react-native-gesture-handler/)

### **🔒 Platform & Build**

[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)](https://developer.apple.com/ios/)
[![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Metro](https://img.shields.io/badge/Metro-5.0.4-FF6B6B?style=for-the-badge&logo=metro&logoColor=white)](https://metrobundler.dev/)

### **🛠️ Development Tools**

[![Babel](https://img.shields.io/badge/Babel-7.25.2-F9DC3E?style=for-the-badge&logo=babel&logoColor=black)](https://babeljs.io/)
[![Sharp](https://img.shields.io/badge/Sharp-0.34.3-99CC00?style=for-the-badge&logo=sharp&logoColor=white)](https://sharp.pixelplumbing.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

---

## 🔄 렌더링 방식 및 아키텍처

### **📱 Client-Side Rendering (CSR)**

본 프로젝트는 **CSR (Client-Side Rendering)** 방식을 사용합니다.

#### **🎯 렌더링 특징**

| 항목            | 설명                                 |
| --------------- | ------------------------------------ |
| **렌더링 위치** | 클라이언트 (사용자 디바이스)         |
| **초기 로딩**   | React Native 번들 로드 후 렌더링     |
| **데이터 로딩** | AsyncStorage에서 실시간 로드         |
| **상태 관리**   | React Hooks + Context API            |
| **네비게이션**  | React Navigation (클라이언트 라우팅) |

#### **✅ CSR의 장점**

- **🚀 실시간 상호작용**: 즉시 반응하는 UI/UX
- **📱 네이티브 앱 경험**: 모바일 최적화된 성능
- **🔄 실시간 업데이트**: 데이터 변경 즉시 반영
- **📶 오프라인 지원**: 로컬 스토리지 기반 데이터 관리
- **🎨 부드러운 애니메이션**: 네이티브 수준의 전환 효과

#### **🏗️ 플랫폼별 지원**

```typescript
// 지원 플랫폼
{
  "android": "✅ 네이티브 Android 앱",
  "ios": "✅ 네이티브 iOS 앱",
  "web": "✅ 웹 앱 (react-native-web)"
}
```

#### **📊 성능 최적화**

- **Lazy Loading**: 화면별 지연 로딩
- **Virtual Lists**: 대용량 데이터 가상화
- **Memory Management**: 효율적인 메모리 사용
- **Bundle Splitting**: 모듈별 번들 분할

---

## 🎯 핵심 기능

### 🏢 **거래처 관리 (Company Management)**

#### 📋 **거래처 등록 및 편집**

- **완전한 CRUD 작업**: 생성, 조회, 수정, 삭제
- **향상된 수정 기능**: 기존 데이터 자동 로드 및 유지
- **상세 정보 관리**: 회사명, 주소, 담당자, 연락처, 사업자번호
- **거래처 유형 분류**: 고객사, 협력업체, 공급업체, 하청업체
- **즐겨찾기 기능**: 자주 거래하는 업체 빠른 액세스
- **QR 코드 생성**: 거래처 정보 공유 및 식별

#### 🔍 **고급 검색 및 필터링**

- **실시간 검색**: 거래처명, 주소, 담당자명, 전화번호, 사업자번호
- **퍼지 검색**: 오타나 부분 일치에도 정확한 결과
- **다중 필터**: 거래처 유형, 지역, 등록일별 필터링
- **검색 결과 하이라이팅**: 일치하는 텍스트 강조 표시

#### 📞 **통신 기능**

- **원터치 전화걸기**: 거래처 연락처로 바로 전화
- **전화 이력 관리**: 통화 기록 자동 저장 및 조회
- **통화 감지**: 수신/발신 전화 자동 인식

#### 📊 **거래처 통계**

- **거래처 현황**: 총 거래처 수, 유형별 분포
- **지역별 분석**: 거래처 지역 분포 시각화
- **활동 통계**: 최근 거래 활동 분석

### 📄 **계산서 관리 (Invoice Management)**

#### 💰 **과세/면세 계산서 분리 관리**

- **과세 계산서**: 묵류 상품 (도토리묵, 청포묵, 검정깨묵 등)
- **면세 계산서**: 두부/콩나물 상품 (착한손두부, 순두부, 시루콩나물 등)
- **부가세 포함 가격 계산**: 과세품목 입력 시 부가세 포함 금액으로 자동 계산
  - 24,000원 입력 → 공급가액: 21,818원, 세액: 2,182원, 합계: 24,000원
- **자동 세금 계산**: VAT 역산 및 정확한 금액 분할
- **세무 보고서**: 부가세 신고용 데이터 자동 생성

#### 📝 **계산서 작성 및 편집**

- **🆕 거래처 선택 시스템**: 직관적인 거래처 선택 인터페이스

  - 세련된 드롭다운 버튼으로 거래처 선택
  - 전체화면 모달에서 거래처 목록 표시 (거래처명, 유형, 지역)
  - **🔍 스마트 검색**: 거래처명, 유형, 지역, 주소, 담당자, 전화번호로 검색
  - 실시간 검색 결과 개수 표시
  - 거래처별 계산서 생성 시 자동 선택
  - 계산서 편집 시 기존 거래처 정보 자동 로드

- **🆕 계산서 상태 관리**: 체계적인 상태 워크플로우

  | 상태         | 아이콘 | 의미             | 언제 사용              |
  | ------------ | ------ | ---------------- | ---------------------- |
  | **임시저장** | 📝     | 작성 중인 계산서 | 초안 작성, 수정 가능   |
  | **발행**     | ✅     | 완성된 계산서    | 발송 준비 완료         |
  | **전송**     | 📤     | 발송된 계산서    | 거래처에 발송 완료     |
  | **승인**     | 🎉     | 승인된 계산서    | 거래처 승인, 거래 확정 |
  | **취소**     | ❌     | 취소된 계산서    | 무효 처리, 수정 불가   |

  - 계산서 생성 시 상태 선택 가능
  - 계산서 상세 화면에서 상태 변경
  - 상태별 설명과 아이콘으로 직관적 구분
  - 실시간 상태 업데이트 및 저장

- **드롭다운 상품 선택**: 카테고리별 상품 체계적 선택
  - **두부 카테고리**: 착한손두부, 고소한손두부, 순두부, 맛두부, 판두부, 모두부, 콩물
  - **콩나물 카테고리**: 시루콩나물, 박스콩나물, 두절콩나물
  - **묵류 카테고리**: 도토리묵小/大, 도토리420, 검정깨묵, 우뭇가사리, 청포묵
- **직접 입력 모드**: 커스텀 상품 등록 가능

- **🆕 스마트 UI 라벨링**: 과세구분에 따른 동적 표시

  - 과세품목: "부가세 포함 단가" 라벨
  - 면세품목: "단가" 라벨
  - 실시간 라벨 변경으로 사용자 혼동 방지

- **스마트 금액 계산**:
  - 과세품목: 부가세 포함 단가 기준 역산 계산
  - 면세품목: 수량 × 단가 직접 계산
- **실시간 데이터 저장**: 계산서 생성 시 AsyncStorage에 즉시 저장
- **다중 상품 지원**: 하나의 계산서에 여러 상품 포함

#### 🔍 **계산서 필터링 및 검색**

- **날짜 범위 필터**: 특정 기간 계산서 조회
- **상품별 필터**: 과세는 묵류만, 면세는 두부/콩나물만
- **상태별 필터**: 임시저장, 발행완료, 취소 등
- **거래처별 조회**: 특정 거래처 계산서 모아보기

#### 📊 **계산서 통계 및 분석**

- **발행 현황**: 총 계산서 수, 과세/면세 비율
- **매출 통계**: 일별/월별/연별 매출 추이
- **상품별 판매량**: 인기 상품 랭킹
- **거래처별 거래액**: 주요 고객 분석

### 🚚 **배송 관리 (Delivery Management)**

#### 📦 **배송 등록 및 관리**

- **배송 등록**: 거래처별 배송 일정 등록
- **상품 선택**: 배송할 상품 목록 및 수량 지정
- **배송 상태 관리**: 준비중 → 배송중 → 배송완료 → 취소
- **배송 메모**: 특별 요청사항 및 주의사항 기록

#### 🗓️ **배송 일정 관리**

- **배송 예정일**: 날짜 및 시간 설정
- **배송 현황 대시보드**: 오늘/이번 주 배송 일정
- **지연 알림**: 예정일 경과 배송 건 알림
- **완료율 통계**: 정시 배송률 추적

#### 📍 **배송 추적**

- **실시간 상태 업데이트**: 배송 단계별 상태 변경
- **배송 이력**: 과거 배송 기록 조회
- **문제 상황 관리**: 배송 취소, 반품 처리

#### 📊 **배송 통계**

- **배송 현황**: 총 배송 건수, 상태별 분포
- **배송 성과**: 정시 배송률, 평균 배송 시간
- **거래처별 배송량**: 배송 빈도 분석

### 📈 **매출 분석 (Sales Analytics)**

#### 📊 **대시보드 및 KPI**

- **실시간 매출 현황**: 일/주/월/년 매출 요약
- **매출 목표 대비 실적**: 진행률 및 달성률 표시
- **전년 동기 대비**: 성장률 분석
- **핵심 지표**: 평균 거래액, 거래 빈도, 신규 고객 수

#### 📈 **매출 트렌드 분석**

- **시계열 차트**: 매출 추이 그래프
- **계절성 분석**: 월별/분기별 패턴 파악
- **예측 분석**: 향후 매출 전망
- **이상치 탐지**: 급격한 매출 변화 감지

#### 🏢 **거래처별 매출 분석**

- **거래처 순위**: 매출액 기준 상위 고객
- **거래처별 상세 분석**: 개별 거래 내역 및 트렌드
- **수익성 분석**: 거래처별 마진율 계산
- **성장 잠재력**: 거래량 증감 분석

#### 🛍️ **상품별 판매 분석**

- **상품 판매 순위**: 베스트셀러 제품
- **카테고리별 성과**: 두부/콩나물/묵류 비교
- **계절성 패턴**: 상품별 성수기/비수기
- **재고 최적화**: 판매량 기반 재고 제안

#### 📅 **기간별 비교 분석**

- **동적 기간 설정**: 사용자 정의 날짜 범위
- **기간 대비 분석**: 전월 대비, 전년 동월 대비
- **누적 매출**: 연초부터 현재까지 누적
- **일평균 매출**: 기간별 일평균 비교

### 🔧 **시스템 기능**

#### 📱 **반응형 디자인 시스템**

- **스케일링 시스템**: 모든 디바이스 크기 자동 대응
- **통일된 디자인**: 일관된 색상, 폰트, 간격
- **접근성**: 시각 장애인을 위한 스크린 리더 지원
- **다크 모드**: 눈의 피로 감소를 위한 어두운 테마

#### 💾 **데이터 관리**

- **로컬 스토리지**: 오프라인 사용 지원
- **자동 백업**: 정기적 데이터 백업
- **데이터 복원**: 앱 삭제 후 재설치 시 복원
- **버전 관리**: 데이터 스키마 변경 자동 마이그레이션

#### 📤 **가져오기/내보내기**

- **일괄 가져오기**: CSV, Excel 파일에서 거래처 정보 가져오기
- **데이터 내보내기**: 계산서, 매출 데이터 Excel 파일 생성
- **공유 기능**: 보고서 및 데이터 이메일 전송
- **QR 코드**: 거래처 정보 QR 코드 생성 및 공유

#### 🔍 **검색 및 필터링 엔진**

- **실시간 검색**: 타이핑과 동시에 결과 표시
- **퍼지 매칭**: 오타 허용 검색
- **고급 필터**: 다중 조건 조합 검색
- **검색 히스토리**: 최근 검색어 저장

---

## 📱 화면 구성

### 🏠 **홈 화면 (Home Screen)**

- **HERO 섹션**: 브랜드 로고 및 환영 메시지
- **빠른 통계**: 총 거래처 수, 계산서 수 등 핵심 지표
- **주요 기능 메뉴**: 6개 메인 기능 카드 배치
  - 거래처 관리 (회사 아이콘)
  - 계산서 관리 (문서 아이콘)
  - 과세 계산서 (영수증 아이콘)
  - 면세 계산서 (영수증 아웃라인 아이콘)
  - 배송 관리 (자동차 아이콘)
  - 매출 분석 (차트 아이콘)
- **빠른 액션**: 새 거래처 추가 버튼

### 🏢 **거래처 목록 화면 (Company List)**

- **헤더**: 검색 버튼 및 총 거래처 수 표시
- **검색 기능**: 펼침/접힘 가능한 검색 바
- **거래처 카드**: 회사명, 유형, 주소, 연락처 정보
- **액션 버튼**: 전화걸기, 즐겨찾기, 삭제
- **FAB**: 새 거래처 추가 플로팅 버튼

### 📋 **거래처 상세 화면 (Company Detail)**

- **탭 네비게이션**: 정보/계산서/상품/배송 탭
- **회사 정보 탭**: 상세 정보 표시 및 QR 코드 생성
- **계산서 탭**: 해당 거래처 관련 계산서 목록
- **상품 탭**: 상품 선택 및 계산서 생성
- **배송 탭**: 배송 현황 및 새 배송 등록
- **액션 버튼**: 수정, 삭제, 전화걸기

### ✏️ **거래처 편집 화면 (Company Edit)**

- **기본 정보**: 회사명, 사업자번호, 업종
- **연락처 정보**: 전화번호, 담당자명
- **주소 정보**: 카카오맵 API 연동 주소 검색
- **유형 선택**: 고객사/협력업체/공급업체/하청업체
- **저장/취소**: 유효성 검사 후 저장

### 📄 **계산서 관리 화면 (Invoice Management)**

- **필터 바**: 날짜 범위, 상품 유형 필터
- **통계 표시**: 필터링된 계산서 건수
- **계산서 목록**: 계산서 번호, 거래처, 금액, 날짜
- **상태 배지**: 임시저장/발행완료/취소 상태 표시
- **액션**: 수정, 삭제, 상세 보기

### ✏️ **계산서 편집 화면 (Invoice Edit)**

- **기본 정보**: 계산서 번호, 거래처 선택, 발행일
- **상품 선택**: 드롭다운 기반 상품 선택 시스템
- **아이템 목록**: 상품, 수량, 단가, 금액
- **세금 계산**: 과세/면세 구분 및 VAT 자동 계산
- **합계**: 소계, 세액, 총액 자동 계산

### 🚚 **배송 관리 화면 (Delivery Management)**

- **통계 대시보드**: 총 배송 건수, 상태별 분포
- **상태 필터**: 전체/준비중/배송중/완료/취소
- **배송 카드**: 배송번호, 거래처, 상품, 상태, 날짜
- **상태 변경**: 원터치 상태 업데이트
- **액션**: 수정, 삭제, 상세 보기

### 📦 **배송 상세/편집 화면**

- **배송 정보**: 배송번호, 거래처, 예정일
- **상품 목록**: 배송 상품 및 수량
- **상태 관리**: 배송 단계별 상태 변경
- **메모**: 배송 관련 특이사항
- **이력**: 상태 변경 기록

### 📊 **매출 분석 화면 (Sales Analytics)**

- **기간 선택**: 전체/1-6월/사용자 정의
- **정렬 옵션**: 회사명/총매출/과세/면세별
- **거래처 목록**: 매출액 기준 거래처 랭킹
- **통계 카드**: 총 매출, 거래처 수, 평균 거래액
- **차트**: 매출 트렌드 그래프

### 📈 **매출 상세 화면 (Sales Detail)**

- **거래처 개요**: 기본 정보 및 총 매출액
- **탭 구성**: 상품별/월별 분석
- **상품별 탭**: 상품 매출 순위 및 비율
- **월별 탭**: 월별 매출 추이 및 트렌드
- **차트**: 파이 차트, 라인 차트 시각화

---

## 🏗️ 아키텍처

### 🧩 **컴포넌트 구조**

```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Card, Button 등)
│   ├── forms/           # 폼 관련 컴포넌트 (Input, Select 등)
│   ├── modals/          # 모달 컴포넌트
│   └── charts/          # 차트 컴포넌트
├── screens/             # 화면 컴포넌트
├── navigation/          # 네비게이션 설정
├── hooks/              # 커스텀 훅
├── services/           # API 및 외부 서비스
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
├── styles/             # 스타일 시스템
└── constants/          # 상수 정의
```

### 🎨 **스타일 시스템**

- **공통 스타일**: 재사용 가능한 스타일 컴포넌트
- **스케일링 시스템**: 반응형 크기 조정
- **컬러 팔레트**: 일관된 브랜드 색상
- **타이포그래피**: 텍스트 스타일 체계
- **그림자 효과**: 계층감 표현

### 🔧 **커스텀 훅 시스템**

- **useCompany**: 거래처 데이터 관리
- **useInvoice**: 계산서 데이터 관리
- **useDelivery**: 배송 데이터 관리
- **useLoading**: 로딩 상태 관리
- **useNotifications**: 알림 관리
- **useForm**: 폼 상태 및 유효성 검사
- **useCrudActions**: CRUD 공통 액션

### 💾 **데이터 관리**

- **AsyncStorage**: 로컬 데이터 저장
- **컨텍스트 API**: 전역 상태 관리
- **Custom Hooks**: 비즈니스 로직 캡슐화
- **타입 안전성**: TypeScript 완전 지원

---

## 🚀 설치 및 실행

### 📋 **시스템 요구사항**

- **Node.js**: 18.0.0 이상
- **npm** 또는 **yarn**: 최신 버전
- **Expo CLI**: 최신 버전
- **Android Studio** (Android 개발용)
- **Xcode** (iOS 개발용, macOS 전용)

### 💻 **설치 과정**

1. **저장소 클론**

```bash
git clone https://github.com/your-username/mapo-business-manager.git
cd mapo-business-manager
```

2. **의존성 설치**

```bash
npm install
# 또는
yarn install
```

3. **Expo 개발 서버 시작**

```bash
npm start
# 또는
yarn start
```

4. **앱 실행**

- **Android**: `npm run android` 또는 Expo Go 앱에서 QR 코드 스캔
- **iOS**: `npm run ios` 또는 Expo Go 앱에서 QR 코드 스캔
- **웹**: `npm run web` 또는 브라우저에서 localhost 접속

### 🔧 **빌드 설정**

#### **Android APK 빌드**

```bash
# 개발용 APK
expo build:android -t apk

# 릴리스용 AAB
expo build:android -t app-bundle
```

#### **iOS IPA 빌드**

```bash
# 시뮬레이터용
expo build:ios -t simulator

# 앱스토어용
expo build:ios -t archive
```

---

## 📖 사용법

### 🏠 **홈 화면에서 시작**

1. 앱을 실행하면 **마포 비즈니스 매니저** 홈 화면이 표시됩니다
2. **빠른 통계** 섹션에서 현재 데이터 현황을 확인할 수 있습니다
3. **주요 기능** 메뉴에서 원하는 기능을 선택합니다

### 🏢 **거래처 관리**

1. **거래처 관리** 메뉴 선택
2. **검색 아이콘**을 터치하여 검색 바 표시
3. **새 거래처 추가**는 우하단 FAB 버튼 사용
4. 거래처 카드 터치하여 상세 정보 확인
5. **전화 아이콘**으로 바로 통화 가능

### 📄 **계산서 작성**

1. **계산서 관리** 메뉴 선택
2. **+ 버튼**으로 새 계산서 작성
3. **거래처 선택**: 드롭다운에서 거래처 선택
4. **상품 추가**:
   - 상품명 옆 화살표 버튼 클릭
   - 카테고리 선택 (두부/콩나물/묵류)
   - 세부 상품 선택
   - 수량 및 단가 입력
5. **저장**: 임시저장 또는 발행완료 상태로 저장

### 🚚 **배송 등록**

1. **거래처 상세 화면**에서 **배송 탭** 선택
2. **새 배송 등록** 버튼 클릭
3. **배송 정보 입력**:
   - 배송 예정일 설정
   - 상품 선택 및 수량 입력
   - 배송 메모 작성 (선택사항)
4. **등록 완료** 버튼으로 배송 등록

### 📊 **매출 분석 확인**

1. **매출 분석** 메뉴 선택
2. **기간 설정**: 전체/1-6월/사용자 정의 선택
3. **거래처별 매출** 목록에서 원하는 거래처 선택
4. **상세 분석**: 상품별/월별 매출 현황 확인
5. **차트 분석**: 시각적 데이터로 트렌드 파악

---

## 🔧 개발환경 설정

### 🛠️ **개발 도구 설치**

1. **Node.js 설치**

```bash
# Node.js 버전 확인
node --version

# 18.0.0 이상이어야 함
```

2. **Expo CLI 설치**

```bash
npm install -g @expo/cli
```

3. **개발용 앱 설치**

- **Android**: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### 📱 **디바이스 설정**

#### **Android 설정**

1. **USB 디버깅 활성화**
2. **개발자 옵션** 활성화
3. **ADB 연결** 확인

#### **iOS 설정** (macOS만 가능)

1. **Xcode 설치**
2. **iOS 시뮬레이터** 설정
3. **개발자 계정** 설정 (기기 테스트용)

### 🔧 **IDE 설정**

#### **VSCode 추천 확장**

- **React Native Tools**
- **TypeScript Importer**
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**

#### **Android Studio 설정**

- **Android SDK** 설치
- **Android Virtual Device** 생성
- **환경 변수** 설정

---

## 📂 프로젝트 구조

```
📁 mapo-business-manager/
├── 📁 android/                     # Android 네이티브 코드
│   ├── 📁 app/
│   │   ├── 📁 src/main/
│   │   │   ├── 📄 AndroidManifest.xml
│   │   │   └── 📁 java/com/mapo/businessmanager/
│   │   │       ├── 📄 MainActivity.kt
│   │   │       └── 📄 MainApplication.kt
│   │   └── 📄 build.gradle
│   └── 📄 settings.gradle
├── 📁 assets/                      # 정적 자산
│   ├── 🖼️ mapo-icon.png            # 앱 아이콘
│   ├── 🖼️ splash-icon.png          # 스플래시 이미지
│   └── 🖼️ favicon.png              # 웹 파비콘
├── 📁 src/                         # 소스 코드
│   ├── 📁 components/              # 재사용 컴포넌트
│   │   ├── 📁 common/              # 공통 컴포넌트
│   │   │   └── 📄 Card.tsx         # 카드 컴포넌트
│   │   ├── 📁 forms/               # 폼 컴포넌트
│   │   │   ├── 📄 Button.tsx       # 버튼 컴포넌트
│   │   │   ├── 📄 Input.tsx        # 입력 필드
│   │   │   ├── 📄 Picker.tsx       # 선택 컴포넌트
│   │   │   ├── 📄 Select.tsx       # 드롭다운 선택
│   │   │   └── 📄 TextInput.tsx    # 텍스트 입력
│   │   ├── 📁 modals/              # 모달 컴포넌트
│   │   │   ├── 📄 CompanyRegistrationModal.tsx
│   │   │   └── 📄 DeliveryRegistrationModal.tsx
│   │   ├── 📄 ProductSelection.tsx # 상품 선택 컴포넌트
│   │   ├── 📄 QRCodeGenerator.tsx  # QR 코드 생성기
│   │   └── 📄 index.ts             # 컴포넌트 내보내기
│   ├── 📁 screens/                 # 화면 컴포넌트
│   │   ├── 📄 HomeScreen.tsx       # 홈 화면
│   │   ├── 📄 CompanyListScreen.tsx        # 거래처 목록
│   │   ├── 📄 CompanyDetailScreen.tsx      # 거래처 상세
│   │   ├── 📄 CompanyEditScreen.tsx        # 거래처 편집
│   │   ├── 📄 CompanyImportScreen.tsx      # 거래처 가져오기
│   │   ├── 📄 DirectImportScreen.tsx       # 직접 가져오기
│   │   ├── 📄 InvoiceManagementScreen.tsx  # 계산서 관리
│   │   ├── 📄 InvoiceEditScreen.tsx        # 계산서 편집
│   │   ├── 📄 InvoiceDetailScreen.tsx      # 계산서 상세
│   │   ├── 📄 CompanySalesAnalysisScreen.tsx   # 매출 분석
│   │   ├── 📄 CompanySalesDetailScreen.tsx     # 매출 상세
│   │   ├── 📄 DeliveryManagementScreen.tsx     # 배송 관리
│   │   ├── 📄 DeliveryDetailScreen.tsx         # 배송 상세
│   │   ├── 📄 DeliveryEditScreen.tsx           # 배송 편집
│   │   └── 📄 index.ts             # 화면 내보내기
│   ├── 📁 navigation/              # 네비게이션 설정
│   │   ├── 📄 AppNavigator.tsx     # 메인 네비게이터
│   │   └── 📄 index.ts
│   ├── 📁 hooks/                   # 커스텀 훅
│   │   ├── 📄 useApi.ts            # API 훅
│   │   ├── 📄 useCallAnalytics.ts  # 통화 분석 훅
│   │   ├── 📄 useCallDetection.ts  # 통화 감지 훅
│   │   ├── 📄 useCompany.ts        # 거래처 관리 훅
│   │   ├── 📄 useInvoice.ts        # 계산서 관리 훅
│   │   ├── 📄 useDelivery.ts       # 배송 관리 훅
│   │   ├── 📄 usePhoneCall.ts      # 전화 걸기 훅
│   │   ├── 📄 useSalesAnalytics.ts # 매출 분석 훅
│   │   ├── 📄 useKeyboardShortcuts.ts  # 키보드 단축키
│   │   ├── 📄 useCommonActions.ts  # 공통 액션 훅
│   │   └── 📄 index.ts             # 훅 내보내기
│   ├── 📁 services/                # 외부 서비스
│   │   ├── 📄 api.ts               # API 서비스
│   │   ├── 📄 kakaoApi.ts          # 카카오 API
│   │   └── 📄 storage.ts           # 스토리지 서비스
│   ├── 📁 utils/                   # 유틸리티 함수
│   │   ├── 📄 format.ts            # 포맷팅 함수
│   │   ├── 📄 validation.ts        # 유효성 검사
│   │   ├── 📄 scaling.ts           # 스케일링 시스템
│   │   ├── 📄 importCompanies.ts   # 거래처 가져오기
│   │   ├── 📄 bulkImportCompanies.ts   # 일괄 가져오기
│   │   ├── 📄 directImportCompanies.ts # 직접 가져오기
│   │   ├── 📄 resetImport.ts       # 가져오기 초기화
│   │   └── 📄 index.ts             # 유틸리티 내보내기
│   ├── 📁 types/                   # TypeScript 타입
│   │   ├── 📄 common.ts            # 공통 타입
│   │   ├── 📄 company.ts           # 거래처 타입
│   │   ├── 📄 invoice.ts           # 계산서 타입
│   │   ├── 📄 delivery.ts          # 배송 타입
│   │   ├── 📄 product.ts           # 상품 타입
│   │   ├── 📄 analytics.ts         # 분석 타입
│   │   ├── 📄 call.ts              # 통화 타입
│   │   ├── 📄 navigation.ts        # 네비게이션 타입
│   │   └── 📄 index.ts             # 타입 내보내기
│   ├── 📁 styles/                  # 스타일 시스템
│   │   ├── 📄 index.ts             # 통합 스타일 내보내기
│   │   ├── 📄 colors.ts            # 색상 팔레트
│   │   ├── 📄 formStyles.ts        # 폼 스타일
│   │   ├── 📄 listStyles.ts        # 리스트 스타일
│   │   └── 📄 modalStyles.ts       # 모달 스타일
│   ├── 📁 constants/               # 상수 정의
│   │   ├── 📄 app.ts               # 앱 상수
│   │   ├── 📄 messages.ts          # 메시지 상수
│   │   └── 📄 index.ts             # 상수 내보내기
│   ├── 📁 data/                    # 초기 데이터
│   │   └── 📄 companies.ts         # 거래처 초기 데이터
│   ├── 📁 providers/               # 컨텍스트 프로바이더
│   │   └── 📄 CallProvider.tsx     # 통화 컨텍스트
│   └── 📄 App.tsx                  # 메인 앱 컴포넌트
├── 📄 App.tsx                      # 앱 진입점
├── 📄 index.ts                     # Expo 진입점
├── 📄 app.json                     # Expo 설정
├── 📄 eas.json                     # EAS 빌드 설정
├── 📄 package.json                 # 의존성 및 스크립트
├── 📄 tsconfig.json                # TypeScript 설정
├── 📄 babel.config.js              # Babel 설정
├── 📄 metro.config.js              # Metro 번들러 설정
└── 📄 README.md                    # 프로젝트 문서
```

---

## 🔐 주요 기능 상세

### 🏢 **거래처 관리 시스템**

#### **데이터 구조**

```typescript
interface Company {
  id: string;
  name: string; // 회사명
  type: CompanyType; // 고객사/협력업체/공급업체/하청업체
  region: string; // 지역
  address: string; // 주소
  phoneNumber: string; // 전화번호
  contactPerson?: string; // 담당자명
  businessNumber?: string; // 사업자등록번호
  isFavorite: boolean; // 즐겨찾기 여부
  createdAt: Date; // 등록일
  updatedAt: Date; // 수정일
}
```

#### **주요 기능**

- **CRUD 작업**: 완전한 생성, 조회, 수정, 삭제
- **실시간 검색**: 모든 필드에 대한 즉시 검색
- **즐겨찾기**: 자주 사용하는 거래처 별도 관리
- **유형별 분류**: 거래처 성격에 따른 분류 시스템
- **연락처 통합**: 원터치 전화걸기 기능

### 📄 **계산서 관리 시스템**

#### **데이터 구조**

```typescript
interface Invoice {
  id: string;
  invoiceNumber: string; // 계산서 번호
  companyId: string; // 거래처 ID
  status: InvoiceStatus; // 상태 (임시저장/발행완료/취소)
  issueDate: Date; // 발행일
  items: InvoiceItem[]; // 상품 목록
  subtotal: number; // 소계
  taxAmount: number; // 세액
  totalAmount: number; // 총액
  notes?: string; // 비고
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceItem {
  id: string;
  name: string; // 상품명
  quantity: number; // 수량
  unitPrice: number; // 단가
  amount: number; // 금액
  taxType: TaxType; // 과세/면세
  taxAmount: number; // 세액
  totalAmount: number; // 총액
}
```

#### **세금 계산 로직**

- **과세 상품**: VAT 10% 자동 계산
- **면세 상품**: 세금 0%
- **혼합 계산서**: 과세/면세 상품 동시 포함 가능
- **실시간 계산**: 수량/단가 변경 시 즉시 재계산

### 🚚 **배송 관리 시스템**

#### **데이터 구조**

```typescript
interface Delivery {
  id: string;
  deliveryNumber: string; // 배송 번호
  companyId: string; // 거래처 ID
  products: DeliveryProduct[]; // 배송 상품
  totalAmount: number; // 총 금액
  deliveryDate: Date; // 배송 예정일
  deliveryMemo?: string; // 배송 메모
  status: DeliveryStatus; // 상태 (준비중/배송중/완료/취소)
  createdAt: Date;
  updatedAt: Date;
}
```

#### **상태 관리 워크플로우**

1. **준비중**: 배송 등록 직후 상태
2. **배송중**: 실제 배송 시작
3. **배송완료**: 고객 수령 완료
4. **취소**: 배송 취소 또는 반품

### 📊 **매출 분석 시스템**

#### **통계 계산**

- **일별/월별/연별** 매출 집계
- **거래처별 매출 순위**
- **상품별 판매 통계**
- **과세/면세 비율 분석**
- **전년 동기 대비 성장률**

#### **차트 시각화**

- **라인 차트**: 매출 트렌드
- **파이 차트**: 상품 비율
- **바 차트**: 거래처별 비교
- **도넛 차트**: 카테고리별 분포

---

## 🔒 보안 및 프라이버시

### 🛡️ **데이터 보안**

- **로컬 스토리지**: 모든 데이터 디바이스 내 저장
- **암호화**: 민감한 정보 암호화 저장
- **접근 제한**: 앱 차원의 접근 권한 관리
- **백업 보안**: 안전한 데이터 백업 메커니즘

### 🔐 **권한 관리**

- **최소 권한 원칙**: 필요한 권한만 요청
- **전화 권한**: 통화 기능을 위한 CALL_PHONE 권한
- **저장소 권한**: 파일 가져오기/내보내기용
- **네트워크 권한**: API 통신용 (카카오맵 등)

### 📱 **프라이버시**

- **로컬 우선**: 외부 서버 의존성 최소화
- **데이터 익명화**: 분석용 데이터 익명 처리
- **사용자 동의**: 데이터 수집 전 명시적 동의
- **투명성**: 데이터 사용 목적 명확히 공개

---

## 🚀 성능 최적화

### ⚡ **렌더링 최적화**

- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 연산 결과 메모이제이션
- **지연 로딩**: 화면별 컴포넌트 지연 로드
- **이미지 최적화**: 적응형 이미지 크기

### 💾 **메모리 관리**

- **가비지 컬렉션**: 메모리 누수 방지
- **이벤트 리스너 정리**: 컴포넌트 언마운트 시 정리
- **대용량 리스트**: FlatList 가상화 활용
- **캐시 관리**: 적절한 캐시 정책 적용

### 📊 **데이터 최적화**

- **인덱싱**: 검색 성능 향상을 위한 인덱스
- **페이지네이션**: 대용량 데이터 분할 로드
- **압축**: 데이터 압축 저장
- **중복 제거**: 중복 데이터 자동 감지 및 제거

---

## 🧪 테스트

### 🔍 **테스트 전략**

- **단위 테스트**: 개별 함수 및 컴포넌트 테스트
- **통합 테스트**: 컴포넌트 간 상호작용 테스트
- **E2E 테스트**: 전체 사용자 플로우 테스트
- **성능 테스트**: 메모리 사용량 및 속도 측정

### 📱 **디바이스 테스트**

- **Android 테스트**: 다양한 Android 버전 및 기기
- **iOS 테스트**: iPhone 및 iPad 다양한 모델
- **해상도 테스트**: 다양한 화면 크기 대응
- **성능 테스트**: 저사양 기기에서의 동작 확인

---

## 🔄 업데이트 및 버전 관리

### 📋 **버전 정책**

- **Semantic Versioning**: MAJOR.MINOR.PATCH 형식
- **자동 업데이트**: OTA(Over-The-Air) 업데이트 지원
- **하위 호환성**: 이전 버전 데이터 호환성 보장
- **마이그레이션**: 데이터 스키마 변경 시 자동 마이그레이션

### 🔄 **릴리스 사이클**

- **개발 버전**: 매주 내부 테스트용 릴리스
- **베타 버전**: 월 1회 베타 테스터용 릴리스
- **정식 버전**: 분기별 안정 버전 릴리스
- **핫픽스**: 긴급 버그 수정 즉시 릴리스

---

## 🤝 기여하기

### 💡 **기여 방법**

1. **이슈 리포트**: 버그 발견 시 GitHub Issues에 등록
2. **기능 제안**: 새로운 기능 아이디어 제안
3. **코드 기여**: Pull Request를 통한 코드 기여
4. **문서화**: README, 주석 등 문서 개선

### 📝 **개발 가이드라인**

- **코딩 스타일**: ESLint 및 Prettier 설정 준수
- **커밋 메시지**: Conventional Commits 형식 사용
- **브랜치 전략**: Git Flow 브랜치 전략 채택
- **코드 리뷰**: 모든 PR은 리뷰 후 머지

### 🔧 **개발 환경 설정**

```bash
# 1. 저장소 포크
git clone https://github.com/your-username/mapo-business-manager.git

# 2. 브랜치 생성
git checkout -b feature/새기능명

# 3. 개발 후 커밋
git commit -m "feat: 새로운 기능 추가"

# 4. 푸시 및 PR 생성
git push origin feature/새기능명
```

### 🐛 **버그 리포트**

```markdown
**버그 설명**
버그에 대한 명확하고 간결한 설명

**재현 단계**

1. '...' 로 이동
2. '...' 클릭
3. '...' 입력
4. 오류 확인

**예상 동작**
예상했던 동작에 대한 설명

**실제 동작**
실제로 발생한 동작에 대한 설명

**환경 정보**

- OS: [예: iOS 15.0]
- 앱 버전: [예: 1.0.0]
- 기기: [예: iPhone 13]
```

---

## 📊 성능 지표

### 📈 **핵심 지표**

- **앱 시작 시간**: < 3초
- **화면 전환 시간**: < 500ms
- **검색 응답 시간**: < 200ms
- **데이터 저장 시간**: < 100ms
- **메모리 사용량**: < 100MB

### 📱 **사용자 경험 지표**

- **앱 크래시율**: < 0.1%
- **사용자 만족도**: > 4.5/5.0
- **일일 활성 사용자**: 추적 중
- **기능 사용률**: 분석 중

---

## 🛣️ 로드맵

### 🎯 **버전 1.1 (예정)**

- [ ] **다크 모드**: 눈의 피로 감소를 위한 어두운 테마
- [ ] **다국어 지원**: 영어, 중국어 지원 추가
- [ ] **클라우드 백업**: Google Drive, iCloud 백업 지원
- [ ] **고급 차트**: 더 많은 시각화 옵션

### 🎯 **버전 1.2 (예정)**

- [ ] **AI 분석**: 매출 예측 및 트렌드 분석
- [ ] **알림 시스템**: 배송 알림, 매출 목표 알림
- [ ] **동기화 기능**: 여러 기기 간 데이터 동기화
- [ ] **리포트 자동화**: 정기 리포트 자동 생성

### 🎯 **버전 2.0 (장기)**

- [ ] **웹 버전**: 브라우저에서 사용 가능한 웹 앱
- [ ] **API 통합**: ERP 시스템과의 연동
- [ ] **팀 협업**: 다중 사용자 지원
- [ ] **고급 분석**: 빅데이터 기반 비즈니스 인사이트

---

## 📝 최근 업데이트

### 🔥 **v2.0.4 (2025.07.23)** - 계산서 삭제 기능 추가

#### **🎯 주요 변경 요약**

| 분야          | 개선사항                  | 사용자 혜택                            |
| ------------- | ------------------------- | -------------------------------------- |
| **🗑️ 삭제**   | 계산서 삭제 기능 추가     | 불필요한 계산서 안전하게 제거 가능     |
| **🎨 UI/UX**  | 거래처 선택 드롭다운 추가 | 계산서 생성 시 직관적 거래처 선택      |
| **📊 상태**   | 계산서 상태 관리 시스템   | 체계적인 5단계 워크플로우 관리         |
| **🏷️ 라벨링** | 과세구분별 동적 라벨 표시 | "부가세 포함 단가" vs "단가" 혼동 해소 |
| **💬 피드백** | 거래처명 포함 완료 메시지 | 어느 거래처 계산서인지 명확히 확인     |
| **🐛 버그**   | 폼 데이터 유지 문제 해결  | 업체/계산서 수정 시 기존 내용 보존     |
| **💰 계산**   | 부가세 포함 가격 방식     | 24,000원 입력 = 24,000원 총액 (직관적) |

#### **🎨 UI/UX 개선**

- **🆕 거래처 선택 인터페이스**: 계산서 생성 시 거래처 선택 기능 추가

  - 세련된 드롭다운 버튼 디자인
  - 전체화면 거래처 선택 모달
  - **🔍 실시간 검색 기능**: 거래처명, 유형, 지역으로 빠른 검색
  - 검색 결과 개수 표시 및 "전체 목록 보기" 버튼
  - 거래처명, 유형, 지역 정보 한눈에 표시
  - "거래처 \* (필수)" 명확한 라벨링

- **🆕 계산서 상태 관리 시스템**: 체계적인 워크플로우 구현

  - 계산서 생성 시 상태 선택 (임시저장/발행/전송/승인/취소)
  - 각 상태별 아이콘과 상세 설명 제공
  - 계산서 상세 화면에서 상태 변경 가능
  - 실시간 상태 업데이트 및 AsyncStorage 저장

- **🗑️ 계산서 삭제 시스템**: 안전한 데이터 관리

  - 계산서 상세 화면에서 삭제 버튼 제공
  - 이중 확인 다이얼로그로 실수 방지
  - "⚠️ 삭제된 계산서는 복구할 수 없습니다" 경고 메시지
  - 삭제 완료 후 자동으로 이전 화면 복귀

- **🏷️ 스마트 라벨링**: 과세구분에 따른 동적 UI 표시

  - 과세품목: "부가세 포함 단가" 표시
  - 면세품목: "단가" 표시
  - 실시간 라벨 변경으로 사용자 혼동 방지

- **💬 향상된 피드백 메시지**:
  - 계산서 생성 완료 시 거래처명 + 계산서번호 표시
  - 상태 변경 시 상세한 설명과 확인 메시지
  - 명확한 오류 안내 메시지
  - 사용자 친화적인 알림 문구

#### **🐛 버그 수정**

- **✅ 업체 수정 폼 데이터 유지**: 업체 수정 시 기존 내용이 사라지는 문제 해결
  - `useEffect`를 활용한 기존 데이터 자동 로드
  - 데이터 로딩 완료 후 폼 필드 자동 채움
- **✅ 계산서 목록 표시**: 계산서 생성 후 목록에 나타나지 않는 문제 해결
  - `useInvoice` 훅에서 실제 스토리지 저장 구현
  - 계산서 생성 시 즉시 목록 업데이트
- **✅ 거래처 정보 누락**: 계산서 생성 시 "거래처 정보가 필요하다" 오류 해결
  - 거래처 선택 UI 추가로 완전한 정보 입력 보장

#### **🚀 기능 개선**

- **💰 부가세 포함 가격 계산**: 과세품목 계산 방식 개선

  ```typescript
  // 기존: 부가세 별도 계산
  총액 = 공급가액 + (공급가액 × 0.1)

  // 새로운: 부가세 포함 가격 역산
  공급가액 = 입력금액 ÷ 1.1
  세액 = 입력금액 - 공급가액
  총액 = 입력금액 (부가세 포함)
  ```

- **🆕 계산서 상태 관리**: 완전한 상태 워크플로우 구현

  ```
  📝 임시저장 → ✅ 발행 → 📤 전송 → 🎉 승인
                     ↓
                   ❌ 취소
  ```

  - 5단계 상태 관리: 임시저장 → 발행 → 전송 → 승인/취소
  - 계산서 생성 시 상태 선택 가능
  - 계산서 상세에서 실시간 상태 변경
  - 상태별 상세 설명과 아이콘으로 직관적 구분

- **🔗 매끄러운 워크플로우**:
  - 거래처 상세 → 계산서 생성 시 자동 거래처 설정
  - 계산서 편집 시 기존 거래처 정보 자동 로드
  - 상태 변경 시 실시간 저장 및 피드백
  - 일관된 사용자 경험 제공

#### **🛠️ 기술적 개선**

- **💾 데이터 영속성**: AsyncStorage를 통한 실제 데이터 저장
- **🔄 실시간 업데이트**: 상태 변경 시 즉시 UI 반영
- **🎯 타입 안전성**: TypeScript 타입 정의 강화
- **📱 반응형 UI**: 다양한 화면 크기 대응 개선

#### **📸 UI/UX 개선 미리보기**

```
🔧 계산서 생성 화면 개선 사항

┌─────────────────────────────────────┐
│ 📝 계산서 생성                        │
├─────────────────────────────────────┤
│ 📄 계산서 번호: [INV-2025-001]       │
│                                     │
│ 🏢 거래처 * (필수)                   │
│ ┌─────────────────────────────────┐ │
│ │ 📍 선택된 거래처명            ▼ │ │ ← 새로운 드롭다운
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 계산서 상태                       │
│ [📝임시저장] [✅발행] [📤전송] [🎉승인] [❌취소] │ ← 새로운 상태 선택
│ 📝 작성 중인 계산서입니다. 언제든 수정할... │
│                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │✏️ 수정  │ │📄 PDF  │ │🗑️ 삭제  │ │ ← 새로운 삭제 버튼
│ └─────────┘ └─────────┘ └─────────┘ │
│                                     │
│ 📦 품목 정보                         │
│ ┌─────────────────────────────────┐ │
│ │ 품목명: [착한손두부]              │ │
│ │ 수량: [10] | 부가세 포함 단가: [2400] │ ← 동적 라벨
│ │ ○ 과세 ○ 면세 ○ 영세            │ │
│ │                                 │ │
│ │ 📊 공급가액: 21,818원             │ │
│ │    세액: 2,182원                  │ │
│ │    합계: 24,000원 ✅             │ │ ← 부가세 포함
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

✨ 거래처 선택 모달 (검색 기능 포함)
┌─────────────────────────────────────┐
│ 거래처 선택 (3개)                ✕  │
├─────────────────────────────────────┤
│ 🔍 [거래처명, 유형, 지역으로 검색...] │ ← 새로운 검색
├─────────────────────────────────────┤
│ 📍 마포종합식품                      │
│    고객사 • 서울                    │
├─────────────────────────────────────┤
│ 📍 대한두부                         │
│    협력업체 • 경기                  │
├─────────────────────────────────────┤
│ 📍 콩나물농장                       │
│    공급업체 • 충남                  │
└─────────────────────────────────────┘

🔍 검색 시 실시간 필터링:
"두부" 검색 → 거래처 선택 (1개)
              📍 대한두부
                 협력업체 • 경기
```

### 🔧 **기술 스택 업데이트**

- **React Native**: 0.79.5
- **Expo**: 53.0.17
- **React**: 19.0.0
- **TypeScript**: 5.8.3
- **렌더링 방식**: CSR (Client-Side Rendering)

#### **🆕 새롭게 추가된 기능들**

| 기능                     | 구현 완료  | 설명                          |
| ------------------------ | ---------- | ----------------------------- |
| ✅ 계산서 삭제 기능      | 2025.07.23 | 안전한 삭제 + 확인 다이얼로그 |
| ✅ 거래처 선택 & 검색    | 2025.07.23 | 드롭다운 + 실시간 검색        |
| ✅ 부가세 포함 가격 계산 | 2025.07.23 | VAT 역산 방식                 |
| ✅ 계산서 상태 관리      | 2025.07.23 | 5단계 워크플로우              |
| ✅ 스마트 UI 라벨링      | 2025.07.23 | 동적 라벨 표시                |
| ✅ 폼 데이터 유지        | 2025.07.23 | 수정 시 기존 데이터 보존      |

---

## 📞 지원 및 문의

### 🛠️ **기술 지원**

- **이메일**: tjworud123@gmail.com
- **GitHub Issues**: [GitHub 이슈 페이지](https://github.com/your-username/mapo-business-manager/issues)
- **개발자**: tjworud123@gmail.com

### 📚 **문서**

- **API 문서**: [docs.mapo-business.com](https://docs.mapo-business.com)
- **사용자 가이드**: [guide.mapo-business.com](https://guide.mapo-business.com)
- **개발자 가이드**: [dev.mapo-business.com](https://dev.mapo-business.com)

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

```
MIT License

Copyright (c) 2025 Mapo Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🏆 감사의 말

### 👥 **개발팀**

- **주개발자**: 서지안 - 전체 시스템 설계 및 개발
- **UI/UX 디자이너**: 서지안
- **테스터**: 서지안

### 🛠️ **오픈소스 기여자들**

이 프로젝트는 다음과 같은 훌륭한 오픈소스 라이브러리들의 도움으로 만들어졌습니다:

- **React Native**: 크로스 플랫폼 모바일 개발
- **Expo**: 빠른 개발 및 배포
- **React Navigation**: 네비게이션 시스템
- **TypeScript**: 타입 안전성
- 기타 수많은 오픈소스 컨트리뷰터들

### 🙏 **특별 감사**

- **마포종합식품**: 실제 비즈니스 요구사항 제공

---

<div align="center">

**🚀 마포 비즈니스 매니저와 함께 스마트한 비즈니스 관리를 시작하세요! 🚀**

[![GitHub stars](https://img.shields.io/github/stars/your-username/mapo-business-manager?style=social)](https://github.com/your-username/mapo-business-manager/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/mapo-business-manager?style=social)](https://github.com/your-username/mapo-business-manager/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-username/mapo-business-manager)](https://github.com/your-username/mapo-business-manager/issues)

Made with ❤️ by Mapo Development Team

</div>
