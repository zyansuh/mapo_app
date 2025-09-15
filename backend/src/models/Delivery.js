const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const deliverySchema = new mongoose.Schema(
  {
    deliveryNumber: {
      type: String,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    products: [productSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    memo: {
      type: String,
    },
    driver: {
      name: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
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

// 배송번호 자동 생성
deliverySchema.pre("save", async function (next) {
  if (!this.deliveryNumber) {
    const count = await this.constructor.countDocuments();
    this.deliveryNumber = `DEL-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Delivery", deliverySchema);
