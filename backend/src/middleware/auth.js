const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "액세스 토큰이 필요합니다.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "비활성화된 계정입니다.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("인증 미들웨어 오류:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다.",
      });
    }

    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "관리자 권한이 필요합니다.",
      });
    }
    next();
  } catch (error) {
    logger.error("관리자 인증 미들웨어 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

module.exports = { auth, adminAuth };
