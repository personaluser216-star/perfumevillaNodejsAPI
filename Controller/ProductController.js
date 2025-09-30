const Cloudinary = require("../Connection/Cloudinaray");
const productModel = require("../Model/ProductModel");

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes,fragrance, bestSeller, brand } = req.body;

    // multiple image files
    const imageFiles = [
      ...(req.files.image1 || []),
      ...(req.files.image2 || []),
      ...(req.files.image3 || []),
      ...(req.files.image4 || [])
    ];

    if (!imageFiles.length) {
      return res.json({ success: false, message: "Please upload at least one image" });
    }

    // upload to cloudinary
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await Cloudinary.uploader.upload(file.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    // handle sizes field
    let parsedSizes = [];
    if (typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes); // expect ["200ml","500ml"]
      } catch (err) {
        parsedSizes = [sizes];
      }
    } else if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    }

    let parsedFragrance = [];
    if (typeof fragrance === "string") {
      try {
    parsedFragrance = JSON.parse(fragrance); // expect ["200ml","500ml"]
      } catch (err) {
parsedFragrance = [fragrance];
      }
    } else if (Array.isArray(fragrance)) {
      parsedFragrance = fragrance;
    }

    const product = new productModel({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes,
      fragrance:parsedFragrance,
      bestSeller: bestSeller === "true" || bestSeller === true,
      brand,
      image: imageUrls
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully!", product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get single product
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // product id from URL
    const { name, description, price, category, subCategory, sizes, fragrance, bestSeller, brand } = req.body;

    // multiple image files (if new uploaded)
    const imageFiles = [
      ...(req.files?.image1 || []),
      ...(req.files?.image2 || []),
      ...(req.files?.image3 || []),
      ...(req.files?.image4 || [])
    ];

    let imageUrls = [];

    if (imageFiles.length > 0) {
      // upload new images to cloudinary
      imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const result = await Cloudinary.uploader.upload(file.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
    }

    // handle sizes
    let parsedSizes = [];
    if (typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (err) {
        parsedSizes = [sizes];
      }
    } else if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    }

    // handle fragrance
    let parsedFragrance = [];
    if (typeof fragrance === "string") {
      try {
        parsedFragrance = JSON.parse(fragrance);
      } catch (err) {
        parsedFragrance = [fragrance];
      }
    } else if (Array.isArray(fragrance)) {
      parsedFragrance = fragrance;
    }

    // update product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(category && { category }),
        ...(subCategory && { subCategory }),
        ...(parsedSizes.length > 0 && { sizes: parsedSizes }),
        ...(parsedFragrance.length > 0 && { fragrance: parsedFragrance }),
        ...(typeof bestSeller !== "undefined" && {
          bestSeller: bestSeller === "true" || bestSeller === true,
        }),
        ...(brand && { brand }),
        ...(imageUrls.length > 0 && { image: imageUrls }) // only replace if new uploaded
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { addProduct, listProduct, singleProduct, removeProduct,updateProduct };
