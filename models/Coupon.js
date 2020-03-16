const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponsSchema = new Schema({
  course: String,
  link: String
});

const Coupon = mongoose.model("coupon", couponsSchema);

module.exports = Coupon;
