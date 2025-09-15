const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Invoice = require("../models/Invoice");
const Company = require("../models/Company");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 계산서 목록 조회
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status")
      .optional()
      .isIn(["임시저장", "발행", "전송", "승인", "취소"]),
    query("companyId").optional().isMongoId(),
    query("sortBy")
      .optional()
      .isIn(["issueDate", "createdAt", "status", "totalAmount"]),
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
        status,
        companyId,
        sortBy = "issueDate",
        sortOrder = "desc",
      } = req.query;

      const filter = { userId: req.user._id };
      if (status) filter.status = status;
      if (companyId) filter.companyId = companyId;

      const sort = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [invoices, total] = await Promise.all([
        Invoice.find(filter)
          .populate("companyId", "name type businessNumber")
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Invoice.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: {
          invoices,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      logger.error("계산서 목록 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 계산서 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("companyId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "계산서를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: { invoice },
    });
  } catch (error) {
    logger.error("계산서 상세 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 계산서 생성
router.post(
  "/",
  [
    body("companyId").isMongoId().withMessage("유효한 회사 ID를 입력해주세요."),
    body("items")
      .isArray({ min: 1 })
      .withMessage("최소 1개 이상의 항목을 입력해주세요."),
    body("items.*.name")
      .trim()
      .notEmpty()
      .withMessage("품목명을 입력해주세요."),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("수량은 1 이상이어야 합니다."),
    body("items.*.unitPrice")
      .isFloat({ min: 0 })
      .withMessage("단가는 0 이상이어야 합니다."),
    body("items.*.taxType")
      .isIn(["과세", "면세", "영세"])
      .withMessage("유효한 과세구분을 선택해주세요."),
    body("totalSupplyAmount")
      .isFloat({ min: 0 })
      .withMessage("총 공급가액은 0 이상이어야 합니다."),
    body("totalTaxAmount")
      .isFloat({ min: 0 })
      .withMessage("총 세액은 0 이상이어야 합니다."),
    body("totalAmount")
      .isFloat({ min: 0 })
      .withMessage("총 합계금액은 0 이상이어야 합니다."),
    body("issueDate").isISO8601().withMessage("유효한 발행일을 입력해주세요."),
    body("status")
      .optional()
      .isIn(["임시저장", "발행", "전송", "승인", "취소"]),
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

      const { companyId, items, issueDate, ...otherData } = req.body;

      // 회사 존재 확인
      const company = await Company.findOne({
        _id: companyId,
        userId: req.user._id,
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "회사를 찾을 수 없습니다.",
        });
      }

      const invoiceData = {
        companyId,
        items,
        issueDate: new Date(issueDate),
        userId: req.user._id,
        ...otherData,
      };

      const invoice = new Invoice(invoiceData);
      await invoice.save();

      await invoice.populate("companyId", "name type businessNumber");

      logger.info(
        `새 계산서 생성: ${invoice.invoiceNumber} (사용자: ${req.user.email})`
      );

      res.status(201).json({
        success: true,
        message: "계산서가 생성되었습니다.",
        data: { invoice },
      });
    } catch (error) {
      logger.error("계산서 생성 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 계산서 수정
router.put(
  "/:id",
  [
    body("items").optional().isArray({ min: 1 }),
    body("issueDate").optional().isISO8601(),
    body("status")
      .optional()
      .isIn(["임시저장", "발행", "전송", "승인", "취소"]),
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

      const updateData = { ...req.body };

      // 날짜 변환
      if (updateData.issueDate) {
        updateData.issueDate = new Date(updateData.issueDate);
      }

      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      ).populate("companyId", "name type businessNumber");

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "계산서를 찾을 수 없습니다.",
        });
      }

      logger.info(
        `계산서 수정: ${invoice.invoiceNumber} (사용자: ${req.user.email})`
      );

      res.json({
        success: true,
        message: "계산서가 수정되었습니다.",
        data: { invoice },
      });
    } catch (error) {
      logger.error("계산서 수정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 계산서 삭제
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "계산서를 찾을 수 없습니다.",
      });
    }

    logger.info(
      `계산서 삭제: ${invoice.invoiceNumber} (사용자: ${req.user.email})`
    );

    res.json({
      success: true,
      message: "계산서가 삭제되었습니다.",
    });
  } catch (error) {
    logger.error("계산서 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 계산서 통계 조회
router.get("/stats/overview", async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalInvoices, invoicesByStatus, totalAmountResult] =
      await Promise.all([
        Invoice.countDocuments({ userId }),
        Invoice.aggregate([
          { $match: { userId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Invoice.aggregate([
          { $match: { userId } },
          { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
        ]),
      ]);

    const stats = {
      totalInvoices,
      byStatus: invoicesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totalAmount: totalAmountResult[0]?.totalAmount || 0,
    };

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    logger.error("계산서 통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
