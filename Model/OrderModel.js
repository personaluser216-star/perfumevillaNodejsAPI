
const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: String, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
});

// const Order = mongoose.models.order || mongoose.model("order", orderSchema);
const Order = mongoose.model("Order", orderSchema); 

module.exports = Order;
