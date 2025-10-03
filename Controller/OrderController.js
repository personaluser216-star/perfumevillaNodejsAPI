// Controller
const Order = require("../Model/OrderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRETKEY);
const Cart = require("../Model/CartModel");

const placeOrder = async (req, res) => {
  try {
    const { deviceId, items, amount, address, paymentMethod } = req.body;
    if (!deviceId || !items?.length) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    const order = new Order({
      deviceId,
      items,
      amount,
      address,
      paymentMethod,
      payment: false,
      date: Date.now()
    });

    await order.save();
    await Cart.updateOne(
      { deviceId },
      { $set: { items: [] } }
    );
    res.json({ success: true, order });
  } catch (err) {
    console.error("placeOrder error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { deviceId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      deviceId,
      items,
      amount,
      address,
      paymentMethod: "stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const currency = "inr";
    const deliveryCharge = 50;

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment"
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const isSuccess = success === "true" || success === true;

    if (isSuccess) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      if (order.deviceId) {
        await Cart.findOneAndUpdate(
          { deviceId: order.deviceId },
          { items: [] }
        );
      }

      return res.json({ success: true, message: "Payment successful" });
    } else {
      // ⚡ return proper JSON when payment failed/cancelled
      return res.json({ success: false, message: "Payment cancelled or failed" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;  // ✅ change deviceId -> orderId

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,   // ✅ use _id
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status updated", order: updatedOrder });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


const getOrdersByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.json({ success: false, message: "Device ID required" });
    }

    const orders = await Order.find({ deviceId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
   
    if (orders.length === 0) {
      console.log("⚠️ No orders found → maybe collection name mismatch");
    }
    res.json({ success: true, orders });
  } catch (err) {
    console.error("getOrders error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






module.exports = { placeOrder, placeOrderStripe,getOrdersByDevice, updateStatus,verifyStripe,getOrders };
