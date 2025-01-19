const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        volumePoint: {
          type: String,
          required: true,
        },
        mrp: {
          type: Number,
          required: true,
          min: 0,
        },
        atTwentyFivePercent: {
          type: Number,
          required: true,
          min: 0, 
        },
        atThirtyFivePercent: {
          type: Number,
          required: true,
          min: 0,
        },
        atFortyTwoPercent: { 
          type: Number,
          required: true,
          min: 0,
        },
        atFiftyPercent: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true } 
);


const List = mongoose.model("List", productSchema);
module.exports = List;
