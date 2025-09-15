const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Company = require("../models/Company");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 회사 목록 조회 (검색, 필터링, 페이지네이션)
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("페이지는 1 이상의 정수여야 합니다."),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("제한은 1-100 사이의 정수여야 합니다."),
    query("search").optional().trim(),
    query("type")
      .optional()
      .isIn(["고객사", "협력업체", "공급업체", "하청업체", "기타"]),
    query("region")
      .optional()
      .isIn([
        "서울",
        "부산",
        "대구",
        "인천",
        "광주",
        "대전",
        "울산",
        "경기",
        "강원",
        "충북",
        "충남",
        "전북",
        "전남",
        "경북",
        "경남",
        "제주",
        "순창",
        "담양",
        "장성",
        "기타",
      ]),
    query("status").optional().isIn(["활성", "비활성", "보류", "종료"]),
    query("isFavorite").optional().isBoolean(),
    query("sortBy")
      .optional()
      .isIn(["name", "type", "region", "status", "createdAt", "updatedAt"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "입력 데이터가 유효하지 않습니다.",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 20,
        search,
        type,
        region,
        status,
        isFavorite,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // 검색 조건 구성
      const filter = { userId: req.user._id };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { contactPerson: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (type) filter.type = type;
      if (region) filter.region = region;
      if (status) filter.status = status;
      if (isFavorite !== undefined) filter.isFavorite = isFavorite === "true";

      // 정렬 조건
      const sort = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // 페이지네이션
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [companies, total] = await Promise.all([
        Company.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Company.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: {
          companies,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      logger.error("회사 목록 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 회사 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "회사를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: { company },
    });
  } catch (error) {
    logger.error("회사 상세 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 회사 생성
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("회사명을 입력해주세요."),
    body("type")
      .isIn(["고객사", "협력업체", "공급업체", "하청업체", "기타"])
      .withMessage("유효한 회사 유형을 선택해주세요."),
    body("region")
      .isIn([
        "서울",
        "부산",
        "대구",
        "인천",
        "광주",
        "대전",
        "울산",
        "경기",
        "강원",
        "충북",
        "충남",
        "전북",
        "전남",
        "경북",
        "경남",
        "제주",
        "순창",
        "담양",
        "장성",
        "기타",
      ])
      .withMessage("유효한 지역을 선택해주세요."),
    body("address").trim().notEmpty().withMessage("주소를 입력해주세요."),
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("전화번호를 입력해주세요."),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("유효한 이메일을 입력해주세요."),
    body("status").optional().isIn(["활성", "비활성", "보류", "종료"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "입력 데이터가 유효하지 않습니다.",
          errors: errors.array(),
        });
      }

      const companyData = {
        ...req.body,
        userId: req.user._id,
      };

      const company = new Company(companyData);
      await company.save();

      logger.info(`새 회사 생성: ${company.name} (사용자: ${req.user.email})`);

      res.status(201).json({
        success: true,
        message: "회사가 등록되었습니다.",
        data: { company },
      });
    } catch (error) {
      logger.error("회사 생성 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 회사 수정
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("회사명을 입력해주세요."),
    body("type")
      .optional()
      .isIn(["고객사", "협력업체", "공급업체", "하청업체", "기타"])
      .withMessage("유효한 회사 유형을 선택해주세요."),
    body("region")
      .optional()
      .isIn([
        "서울",
        "부산",
        "대구",
        "인천",
        "광주",
        "대전",
        "울산",
        "경기",
        "강원",
        "충북",
        "충남",
        "전북",
        "전남",
        "경북",
        "경남",
        "제주",
        "순창",
        "담양",
        "장성",
        "기타",
      ])
      .withMessage("유효한 지역을 선택해주세요."),
    body("address")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("주소를 입력해주세요."),
    body("phoneNumber")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("전화번호를 입력해주세요."),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("유효한 이메일을 입력해주세요."),
    body("status").optional().isIn(["활성", "비활성", "보류", "종료"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "입력 데이터가 유효하지 않습니다.",
          errors: errors.array(),
        });
      }

      const company = await Company.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "회사를 찾을 수 없습니다.",
        });
      }

      logger.info(`회사 수정: ${company.name} (사용자: ${req.user.email})`);

      res.json({
        success: true,
        message: "회사 정보가 수정되었습니다.",
        data: { company },
      });
    } catch (error) {
      logger.error("회사 수정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 회사 삭제
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "회사를 찾을 수 없습니다.",
      });
    }

    logger.info(`회사 삭제: ${company.name} (사용자: ${req.user.email})`);

    res.json({
      success: true,
      message: "회사가 삭제되었습니다.",
    });
  } catch (error) {
    logger.error("회사 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 회사 통계 조회
router.get("/stats/overview", async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalCompanies,
      companiesByType,
      companiesByRegion,
      companiesByStatus,
      favoriteCompanies,
      companiesWithBusinessNumber,
      companiesWithEmail,
    ] = await Promise.all([
      Company.countDocuments({ userId }),
      Company.aggregate([
        { $match: { userId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      Company.aggregate([
        { $match: { userId } },
        { $group: { _id: "$region", count: { $sum: 1 } } },
      ]),
      Company.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Company.countDocuments({ userId, isFavorite: true }),
      Company.countDocuments({
        userId,
        businessNumber: { $exists: true, $ne: "" },
      }),
      Company.countDocuments({ userId, email: { $exists: true, $ne: "" } }),
    ]);

    const stats = {
      total: totalCompanies,
      byType: companiesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byRegion: companiesByRegion.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byStatus: companiesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      favorites: favoriteCompanies,
      withBusinessNumber: companiesWithBusinessNumber,
      withEmail: companiesWithEmail,
    };

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    logger.error("회사 통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
