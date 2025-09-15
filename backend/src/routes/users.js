const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 사용자 목록 조회 (관리자만)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    logger.error("사용자 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 사용자 상세 조회 (관리자만)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error("사용자 상세 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 사용자 역할 변경 (관리자만)
router.put(
  "/:id/role",
  adminAuth,
  [
    body("role")
      .isIn(["admin", "manager", "user"])
      .withMessage("유효한 역할을 선택해주세요."),
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

      const { role } = req.body;

      // 자기 자신의 역할은 변경할 수 없음
      if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "자신의 역할은 변경할 수 없습니다.",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      logger.info(
        `사용자 역할 변경: ${user.email} -> ${role} (관리자: ${req.user.email})`
      );

      res.json({
        success: true,
        message: "사용자 역할이 변경되었습니다.",
        data: { user },
      });
    } catch (error) {
      logger.error("사용자 역할 변경 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 사용자 활성화/비활성화 (관리자만)
router.put(
  "/:id/status",
  adminAuth,
  [
    body("isActive")
      .isBoolean()
      .withMessage("활성화 상태는 boolean 값이어야 합니다."),
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

      const { isActive } = req.body;

      // 자기 자신의 상태는 변경할 수 없음
      if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "자신의 계정 상태는 변경할 수 없습니다.",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      logger.info(
        `사용자 상태 변경: ${user.email} -> ${
          isActive ? "활성화" : "비활성화"
        } (관리자: ${req.user.email})`
      );

      res.json({
        success: true,
        message: `사용자가 ${isActive ? "활성화" : "비활성화"}되었습니다.`,
        data: { user },
      });
    } catch (error) {
      logger.error("사용자 상태 변경 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 사용자 삭제 (관리자만)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    // 자기 자신은 삭제할 수 없음
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "자신의 계정은 삭제할 수 없습니다.",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    logger.info(`사용자 삭제: ${user.email} (관리자: ${req.user.email})`);

    res.json({
      success: true,
      message: "사용자가 삭제되었습니다.",
    });
  } catch (error) {
    logger.error("사용자 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 사용자 통계 조회 (관리자만)
router.get("/stats/overview", adminAuth, async (req, res) => {
  try {
    const [totalUsers, activeUsers, usersByRole] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    logger.error("사용자 통계 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
