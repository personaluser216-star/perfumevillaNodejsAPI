const CartModel = require("../Model/CartModel");

// ✅ Add to Cart
const addToCart = async (req, res) => {
  try {
    const { deviceId, productId, size,quantity = 1  } = req.body;

    if (!deviceId) {
      return res.json({ success: false, message: "deviceId required" });
    }

     let cart = await CartModel.findOne({ deviceId }).populate("items.productId");
    if (!cart) {
      cart = new CartModel({ deviceId, items: [] });
    }

    // check if product already exists
    const existingItem = cart.items.find(
  (item) =>
    item.productId._id.toString() === productId.toString() &&
    item.size === size
);
 if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, size, quantity });
    }

    await cart.save();
     await cart.populate("items.productId");
    res.json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Cart (qty change / remove)
const updateCart = async (req, res) => {
  try {
    const { deviceId, productId, size, quantity } = req.body;

    let cart = await CartModel.findOne({ deviceId }).populate("items.productId");
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    if (quantity <= 0) {
      // remove item
      cart.items = cart.items.filter(
        (item) => !(item.productId._id.toString() === productId && item.size === size)
      );
    } else {
      // update qty
      const item = cart.items.find(
        (item) => item.productId._id.toString() === productId && item.size === size
      );
      if (item) {
        item.quantity = quantity;
      } else {
        cart.items.push({ productId, size, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, cart });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Cart by deviceId
const getUserCart = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.json({ success: false, message: "deviceId required" });
    }

    const cart = await CartModel.findOne({ deviceId }).populate("items.productId");
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, updateCart, getUserCart };
