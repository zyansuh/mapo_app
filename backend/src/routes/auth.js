const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// 회원가입
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("유효한 이메일을 입력해주세요."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("비밀번호는 최소 6자 이상이어야 합니다."),
    body("name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("이름을 입력해주세요."),
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

      const { email, password, name, phoneNumber } = req.body;

      // 이메일 중복 확인
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "이미 등록된 이메일입니다.",
        });
      }

      // 사용자 생성
      const user = new User({
        email,
        password,
        name,
        phoneNumber,
      });

      await user.save();

      // JWT 토큰 생성
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      logger.info(`새 사용자 등록: ${email}`);

      res.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      logger.error("회원가입 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 로그인
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("유효한 이메일을 입력해주세요."),
    body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
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

      const { email, password } = req.body;

      // 사용자 찾기
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 비밀번호 확인
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 계정 활성화 확인
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "비활성화된 계정입니다.",
        });
      }

      // 마지막 로그인 시간 업데이트
      user.lastLogin = new Date();
      await user.save();

      // JWT 토큰 생성
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      logger.info(`사용자 로그인: ${email}`);

      res.json({
        success: true,
        message: "로그인 성공",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      logger.error("로그인 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 프로필 조회
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    logger.error("프로필 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 프로필 업데이트
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("이름을 입력해주세요."),
    body("phoneNumber").optional().trim(),
    body("preferences").optional().isObject(),
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

      const { name, phoneNumber, preferences } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (preferences)
        updateData.preferences = { ...req.user.preferences, ...preferences };

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      });

      logger.info(`사용자 프로필 업데이트: ${user.email}`);

      res.json({
        success: true,
        message: "프로필이 업데이트되었습니다.",
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      logger.error("프로필 업데이트 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

// 비밀번호 변경
router.put(
  "/password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("현재 비밀번호를 입력해주세요."),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("새 비밀번호는 최소 6자 이상이어야 합니다."),
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

      const { currentPassword, newPassword } = req.body;

      // 현재 비밀번호 확인
      const user = await User.findById(req.user._id);
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
      }

      // 새 비밀번호 설정
      user.password = newPassword;
      await user.save();

      logger.info(`사용자 비밀번호 변경: ${user.email}`);

      res.json({
        success: true,
        message: "비밀번호가 변경되었습니다.",
      });
    } catch (error) {
      logger.error("비밀번호 변경 오류:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
);

module.exports = router;
