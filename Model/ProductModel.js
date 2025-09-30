const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true }, // multiple images
  category: { type: String, required: true },
  subCategory: { type: String },
  sizes: { type: [String], required: true },
  fragrance: { type: [String], required: true },
  bestSeller: { type: Boolean, default: false },
  brand: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productModel = mongoose.models.tbl_product || mongoose.model("tbl_product", productSchema);

module.exports = productModel;
