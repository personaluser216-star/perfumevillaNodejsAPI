const express = require("express");
const { addProduct, listProduct, singleProduct, removeProduct, updateProduct } = require("../Controller/ProductController");
const upload = require("../Middleware/Multer");

const ProductRouter = express.Router();

// add product (form-data with images)
ProductRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  addProduct
);


ProductRouter.get("/get", listProduct);

// get single product
ProductRouter.get("/get/:id", singleProduct);

// delete product
ProductRouter.post("/delete", removeProduct);
// update product
ProductRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  updateProduct
);

module.exports = ProductRouter;
