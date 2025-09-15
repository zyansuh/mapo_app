const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Rate limiting 설정
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// 일반 API 요청 제한
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15분
  100, // 최대 100 요청
  "너무 많은 요청이 발생했습니다. 15분 후 다시 시도해주세요."
);

// 인증 관련 요청 제한 (더 엄격)
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15분
  5, // 최대 5 요청
  "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요."
);

// Helmet 보안 설정
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS 설정
const corsOptions = {
  origin: function (origin, callback) {
    // 개발 환경에서는 모든 origin 허용
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // 프로덕션에서는 특정 origin만 허용
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 정책에 의해 차단되었습니다"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// 요청 크기 제한
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get("content-length") || "0");
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: "요청 크기가 너무 큽니다. 최대 10MB까지 허용됩니다.",
    });
  }

  next();
};

// SQL Injection 방지 (MongoDB이지만 NoSQL Injection 방지)
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      // 기본적인 NoSQL Injection 패턴 제거
      return obj.replace(/[$]/g, "");
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = sanitize(obj[key]);
        } else if (typeof obj[key] === "object") {
          obj[key] = sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  securityHeaders,
  corsOptions,
  requestSizeLimit,
  sanitizeInput,
};
