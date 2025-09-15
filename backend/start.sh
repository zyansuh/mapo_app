#!/bin/bash

# Mapo Backend 시작 스크립트

echo "🚀 Mapo Business Manager Backend 시작 중..."

# Node.js 버전 확인
echo "📋 Node.js 버전 확인 중..."
node --version

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 환경 변수 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다. env.example을 복사합니다..."
    cp env.example .env
    echo "✅ .env 파일이 생성되었습니다. 필요한 설정을 수정해주세요."
fi

# MongoDB 연결 확인
echo "🔍 MongoDB 연결 확인 중..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB가 설치되어 있습니다."
else
    echo "⚠️  MongoDB가 설치되어 있지 않습니다."
    echo "   MongoDB를 설치하고 실행해주세요:"
    echo "   - macOS: brew install mongodb-community"
    echo "   - Ubuntu: sudo apt-get install mongodb"
    echo "   - Windows: https://www.mongodb.com/try/download/community"
fi

# 로그 디렉토리 생성
mkdir -p logs

# 개발 모드로 서버 시작
echo "🎯 개발 모드로 서버를 시작합니다..."
npm run dev