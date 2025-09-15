const mongoose = require("mongoose");

// 테스트 환경 설정
process.env.NODE_ENV = "test";
process.env.MONGODB_TEST_URI = "mongodb://localhost:27017/mapo_test";
process.env.JWT_SECRET = "test-secret-key";

// Jest 전역 설정
beforeAll(async () => {
  // 테스트 데이터베이스 연결
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  }
});

afterAll(async () => {
  // 모든 테스트 후 데이터베이스 연결 종료
  await mongoose.connection.close();
});

// 각 테스트 후 데이터 정리
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
