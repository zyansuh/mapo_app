const { body, param, query, validationResult } = require("express-validator");

// 검증 결과 처리 미들웨어
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "입력 데이터가 올바르지 않습니다",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// 회사 관련 검증
const validateCompany = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("회사명은 1-100자 사이여야 합니다"),
  body("type")
    .isIn(["공급업체", "고객", "협력업체", "기타"])
    .withMessage("올바른 회사 유형을 선택해주세요"),
  body("region")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("지역은 1-50자 사이여야 합니다"),
  body("phoneNumber")
    .optional()
    .matches(/^[0-9-+\s()]+$/)
    .withMessage("올바른 전화번호 형식이 아닙니다"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("올바른 이메일 형식이 아닙니다"),
  body("businessNumber")
    .optional()
    .matches(/^[0-9-]+$/)
    .withMessage("올바른 사업자등록번호 형식이 아닙니다"),
  handleValidationErrors,
];

// 배송 관련 검증
const validateDelivery = [
  body("companyId").isMongoId().withMessage("올바른 회사 ID가 아닙니다"),
  body("products")
    .isArray({ min: 1 })
    .withMessage("최소 1개 이상의 상품이 필요합니다"),
  body("products.*.category")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("상품 카테고리는 1-50자 사이여야 합니다"),
  body("products.*.item")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("상품명은 1-100자 사이여야 합니다"),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("수량은 1 이상이어야 합니다"),
  body("products.*.unitPrice")
    .isFloat({ min: 0 })
    .withMessage("단가는 0 이상이어야 합니다"),
  body("deliveryDate").isISO8601().withMessage("올바른 날짜 형식이 아닙니다"),
  body("address")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("주소는 1-200자 사이여야 합니다"),
  handleValidationErrors,
];

// 계산서 관련 검증
const validateInvoice = [
  body("companyId").isMongoId().withMessage("올바른 회사 ID가 아닙니다"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("최소 1개 이상의 항목이 필요합니다"),
  body("items.*.name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("항목명은 1-100자 사이여야 합니다"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("수량은 1 이상이어야 합니다"),
  body("items.*.unitPrice")
    .isFloat({ min: 0 })
    .withMessage("단가는 0 이상이어야 합니다"),
  body("issueDate").isISO8601().withMessage("올바른 발행일 형식이 아닙니다"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("올바른 만료일 형식이 아닙니다"),
  handleValidationErrors,
];

// 사용자 관련 검증
const validateUser = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("올바른 이메일 형식이 아닙니다"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage("비밀번호는 영문과 숫자를 포함해야 합니다"),
  body("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("이름은 1-50자 사이여야 합니다"),
  body("phone")
    .optional()
    .matches(/^[0-9-+\s()]+$/)
    .withMessage("올바른 전화번호 형식이 아닙니다"),
  handleValidationErrors,
];

// ID 파라미터 검증
const validateId = [
  param("id").isMongoId().withMessage("올바른 ID 형식이 아닙니다"),
  handleValidationErrors,
];

// 쿼리 파라미터 검증
const validateQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("페이지는 1 이상이어야 합니다"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("제한은 1-100 사이여야 합니다"),
  query("sortBy")
    .optional()
    .isIn(["name", "createdAt", "updatedAt", "type", "region"])
    .withMessage("올바른 정렬 기준이 아닙니다"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("정렬 순서는 asc 또는 desc여야 합니다"),
  handleValidationErrors,
];

module.exports = {
  validateCompany,
  validateDelivery,
  validateInvoice,
  validateUser,
  validateId,
  validateQuery,
  handleValidationErrors,
};
