const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  deviceId: { type: String, required: true }, 
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_product",
        required: true,
      },
      size: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
