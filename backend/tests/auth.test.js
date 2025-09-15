const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/User");
const mongoose = require("mongoose");

describe("Auth API Tests", () => {
  beforeAll(async () => {
    // 테스트 데이터베이스 연결
    await mongoose.connect(
      process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/mapo_test"
    );
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // 각 테스트 전에 사용자 데이터 정리
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        phone: "010-1234-5678",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.token).toBeDefined();
    });

    it("should not register user with duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      // 첫 번째 사용자 등록
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // 동일한 이메일로 두 번째 사용자 등록 시도
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 존재합니다");
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // 테스트용 사용자 생성
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      await request(app).post("/api/auth/register").send(userData);
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("잘못된");
    });
  });

  describe("GET /api/auth/profile", () => {
    let authToken;

    beforeEach(async () => {
      // 테스트용 사용자 생성 및 로그인
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      await request(app).post("/api/auth/register").send(userData);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      authToken = loginResponse.body.data.token;
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("test@example.com");
      expect(response.body.data.name).toBe("Test User");
    });

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
