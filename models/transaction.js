const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const calculationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for calculation"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const calculation = mongoose.model("calculation", calculationSchema);

module.exports = calculation;
