const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Delivery = require("../models/Delivery");
const Company = require("../models/Company");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 배송 목록 조회
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isIn(["준비중", "배송중", "배송완료", "취소"]),
    query("companyId").optional().isMongoId(),
    query("sortBy").optional().isIn(["deliveryDate", "createdAt", "status"]),
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
        sortBy = "deliveryDate",
        sortOrder = "desc",
      } = req.query;

      const filter = { userId: req.user._id };
      if (status) filter.status = status;
      if (companyId) filter.companyId = companyId;

      const sort = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [deliveries, total] = await Promise.all([
        Delivery.find(filter)
          .populate("companyId", "name type phoneNumber")
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Delivery.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: {
          deliveries,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      logger.error("배송 목록 조회 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 배송 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const delivery = await Delivery.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("companyId");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "배송 정보를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: { delivery },
    });
  } catch (error) {
    logger.error("배송 상세 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 배송 생성
router.post(
  "/",
  [
    body("companyId").isMongoId().withMessage("유효한 회사 ID를 입력해주세요."),
    body("products")
      .isArray({ min: 1 })
      .withMessage("최소 1개 이상의 상품을 입력해주세요."),
    body("products.*.category")
      .trim()
      .notEmpty()
      .withMessage("상품 카테고리를 입력해주세요."),
    body("products.*.productItem")
      .trim()
      .notEmpty()
      .withMessage("상품명을 입력해주세요."),
    body("products.*.quantity")
      .isInt({ min: 1 })
      .withMessage("수량은 1 이상이어야 합니다."),
    body("products.*.unitPrice")
      .isFloat({ min: 0 })
      .withMessage("단가는 0 이상이어야 합니다."),
    body("deliveryDate")
      .isISO8601()
      .withMessage("유효한 배송일을 입력해주세요."),
    body("status").optional().isIn(["준비중", "배송중", "배송완료", "취소"]),
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

      const { companyId, products, deliveryDate, ...otherData } = req.body;

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

      // 상품 총액 계산
      const productsWithTotal = products.map((product) => ({
        ...product,
        totalPrice: product.quantity * product.unitPrice,
      }));

      const totalAmount = productsWithTotal.reduce(
        (sum, product) => sum + product.totalPrice,
        0
      );

      const deliveryData = {
        companyId,
        products: productsWithTotal,
        totalAmount,
        deliveryDate: new Date(deliveryDate),
        userId: req.user._id,
        ...otherData,
      };

      const delivery = new Delivery(deliveryData);
      await delivery.save();

      await delivery.populate("companyId", "name type phoneNumber");

      logger.info(
        `새 배송 생성: ${delivery.deliveryNumber} (사용자: ${req.user.email})`
      );

      res.status(201).json({
        success: true,
        message: "배송이 등록되었습니다.",
        data: { delivery },
      });
    } catch (error) {
      logger.error("배송 생성 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 배송 수정
router.put(
  "/:id",
  [
    body("products").optional().isArray({ min: 1 }),
    body("deliveryDate").optional().isISO8601(),
    body("status").optional().isIn(["준비중", "배송중", "배송완료", "취소"]),
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

      // 상품 정보가 업데이트되는 경우 총액 재계산
      if (updateData.products) {
        const productsWithTotal = updateData.products.map((product) => ({
          ...product,
          totalPrice: product.quantity * product.unitPrice,
        }));
        updateData.products = productsWithTotal;
        updateData.totalAmount = productsWithTotal.reduce(
          (sum, product) => sum + product.totalPrice,
          0
        );
      }

      // 날짜 변환
      if (updateData.deliveryDate) {
        updateData.deliveryDate = new Date(updateData.deliveryDate);
      }

      const delivery = await Delivery.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      ).populate("companyId", "name type phoneNumber");

      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: "배송 정보를 찾을 수 없습니다.",
        });
      }

      logger.info(
        `배송 수정: ${delivery.deliveryNumber} (사용자: ${req.user.email})`
      );

      res.json({
        success: true,
        message: "배송 정보가 수정되었습니다.",
        data: { delivery },
      });
    } catch (error) {
      logger.error("배송 수정 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 배송 삭제
router.delete("/:id", async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "배송 정보를 찾을 수 없습니다.",
      });
    }

    logger.info(
      `배송 삭제: ${delivery.deliveryNumber} (사용자: ${req.user.email})`
    );

    res.json({
      success: true,
      message: "배송이 삭제되었습니다.",
    });
  } catch (error) {
    logger.error("배송 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 배송 통계 조회
router.get("/stats/overview", async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalDeliveries,
      pendingDeliveries,
      completedDeliveries,
      totalAmountResult,
    ] = await Promise.all([
      Delivery.countDocuments({ userId }),
      Delivery.countDocuments({
        userId,
        status: { $in: ["준비중", "배송중"] },
      }),
      Delivery.countDocuments({ userId, status: "배송완료" }),
      Delivery.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const stats = {
      totalDeliveries,
      pendingDeliveries,
      completedDeliveries,
      totalAmount: totalAmountResult[0]?.totalAmount || 0,
    };

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    logger.error("배송 통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
