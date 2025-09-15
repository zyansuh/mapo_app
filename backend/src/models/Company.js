const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["고객사", "협력업체", "공급업체", "하청업체", "기타"],
      required: true,
    },
    region: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["활성", "비활성", "보류", "종료"],
      default: "활성",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    businessNumber: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    memo: {
      type: String,
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    lastContactDate: {
      type: Date,
    },
    nextContactDate: {
      type: Date,
    },
    // 사용자별 데이터 분리를 위한 필드
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 설정
companySchema.index({ userId: 1, name: 1 });
companySchema.index({ userId: 1, type: 1 });
companySchema.index({ userId: 1, region: 1 });
companySchema.index({ userId: 1, status: 1 });
companySchema.index({ userId: 1, isFavorite: 1 });

// 가상 필드: 전체 주소
companySchema.virtual("fullAddress").get(function () {
  return `${this.region} ${this.address}`;
});

// JSON 변환 시 가상 필드 포함
companySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Company", companySchema);
