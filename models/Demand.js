const mongoose = require("mongoose");
const { Schema } = mongoose;

const demandSchema = new Schema({
  course: String,
  counter: { type: Number, default: 1 }
});

const Demand = mongoose.model("demand", demandSchema);

module.exports = Demand;
