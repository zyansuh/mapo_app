const request = require("supertest");
const app = require("../src/server");
const User = require("../src/models/User");
const Company = require("../src/models/Company");
const mongoose = require("mongoose");

describe("Companies API Tests", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/mapo_test"
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});

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
    userId = loginResponse.body.data.user._id;
  });

  describe("POST /api/companies", () => {
    it("should create a new company", async () => {
      const companyData = {
        name: "Test Company",
        type: "공급업체",
        region: "서울",
        address: "서울시 마포구",
        phoneNumber: "02-1234-5678",
        email: "test@company.com",
        contactPerson: "김담당",
      };

      const response = await request(app)
        .post("/api/companies")
        .set("Authorization", `Bearer ${authToken}`)
        .send(companyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(companyData.name);
      expect(response.body.data.type).toBe(companyData.type);
      expect(response.body.data.userId).toBe(userId);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/companies")
        .set("Authorization", `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/companies", () => {
    beforeEach(async () => {
      // 테스트용 회사 데이터 생성
      const companies = [
        {
          name: "Company 1",
          type: "공급업체",
          region: "서울",
          address: "서울시 마포구",
          userId: userId,
        },
        {
          name: "Company 2",
          type: "고객",
          region: "부산",
          address: "부산시 해운대구",
          userId: userId,
        },
      ];

      await Company.insertMany(companies);
    });

    it("should get all companies for authenticated user", async () => {
      const response = await request(app)
        .get("/api/companies")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it("should filter companies by type", async () => {
      const response = await request(app)
        .get("/api/companies?type=공급업체")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe("공급업체");
    });

    it("should search companies by name", async () => {
      const response = await request(app)
        .get("/api/companies?search=Company 1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("Company 1");
    });
  });

  describe("PUT /api/companies/:id", () => {
    let companyId;

    beforeEach(async () => {
      const company = new Company({
        name: "Test Company",
        type: "공급업체",
        region: "서울",
        address: "서울시 마포구",
        userId: userId,
      });

      const savedCompany = await company.save();
      companyId = savedCompany._id;
    });

    it("should update company successfully", async () => {
      const updateData = {
        name: "Updated Company",
        type: "고객",
      };

      const response = await request(app)
        .put(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.type).toBe(updateData.type);
    });

    it("should not update company with invalid ID", async () => {
      const response = await request(app)
        .put("/api/companies/invalid-id")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/companies/:id", () => {
    let companyId;

    beforeEach(async () => {
      const company = new Company({
        name: "Test Company",
        type: "공급업체",
        region: "서울",
        address: "서울시 마포구",
        userId: userId,
      });

      const savedCompany = await company.save();
      companyId = savedCompany._id;
    });

    it("should delete company successfully", async () => {
      const response = await request(app)
        .delete(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("삭제되었습니다");

      // 삭제 확인
      const getResponse = await request(app)
        .get(`/api/companies/${companyId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
