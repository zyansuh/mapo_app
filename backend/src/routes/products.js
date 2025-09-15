const express = require("express");
const { body, query, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 제품 카테고리 목록 조회
router.get("/categories", async (req, res) => {
  try {
    // 기본 제품 카테고리 (실제로는 데이터베이스에서 관리할 수 있음)
    const categories = [
      { id: "1", name: "식품", description: "식품류" },
      { id: "2", name: "음료", description: "음료류" },
      { id: "3", name: "과자", description: "과자류" },
      { id: "4", name: "냉동식품", description: "냉동식품류" },
      { id: "5", name: "건강식품", description: "건강식품류" },
      { id: "6", name: "기타", description: "기타 상품" },
    ];

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    logger.error("제품 카테고리 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 제품 목록 조회 (사용자별 저장된 제품)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("category").optional().trim(),
    query("search").optional().trim(),
    query("sortBy").optional().isIn(["name", "category", "createdAt"]),
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

      // 실제로는 Product 모델을 만들어서 사용자별 제품을 저장해야 함
      // 현재는 임시 데이터 반환
      const mockProducts = [
        {
          id: "1",
          name: "김치",
          category: "식품",
          unitPrice: 5000,
          description: "전통 김치",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "콜라",
          category: "음료",
          unitPrice: 1500,
          description: "탄산음료",
          createdAt: new Date(),
        },
      ];

      res.json({
        success: true,
        data: {
          products: mockProducts,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: mockProducts.length,
            itemsPerPage: 20,
          },
        },
      });
    } catch (error) {
      logger.error("제품 목록 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 제품 생성
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("제품명을 입력해주세요."),
    body("category").trim().notEmpty().withMessage("카테고리를 입력해주세요."),
    body("unitPrice")
      .isFloat({ min: 0 })
      .withMessage("단가는 0 이상이어야 합니다."),
    body("description").optional().trim(),
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

      // 실제로는 Product 모델에 저장
      const product = {
        id: Date.now().toString(),
        ...req.body,
        userId: req.user._id,
        createdAt: new Date(),
      };

      logger.info(`새 제품 생성: ${product.name} (사용자: ${req.user.email})`);

      res.status(201).json({
        success: true,
        message: "제품이 등록되었습니다.",
        data: { product },
      });
    } catch (error) {
      logger.error("제품 생성 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 제품 수정
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("제품명을 입력해주세요."),
    body("category")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("카테고리를 입력해주세요."),
    body("unitPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("단가는 0 이상이어야 합니다."),
    body("description").optional().trim(),
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

      // 실제로는 Product 모델에서 업데이트
      const product = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date(),
      };

      logger.info(`제품 수정: ${product.name} (사용자: ${req.user.email})`);

      res.json({
        success: true,
        message: "제품이 수정되었습니다.",
        data: { product },
      });
    } catch (error) {
      logger.error("제품 수정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 제품 삭제
router.delete("/:id", async (req, res) => {
  try {
    // 실제로는 Product 모델에서 삭제
    logger.info(`제품 삭제: ${req.params.id} (사용자: ${req.user.email})`);

    res.json({
      success: true,
      message: "제품이 삭제되었습니다.",
    });
  } catch (error) {
    logger.error("제품 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
