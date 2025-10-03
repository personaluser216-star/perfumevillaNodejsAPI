const express = require("express");
const { 
  placeOrder, 
  placeOrderStripe,
  updateStatus,
  getOrdersByDevice, 
  verifyStripe, 
  getOrders 
} = require("../Controller/OrderController");

const OrderRouter = express.Router();

OrderRouter.post("/place", placeOrder);
OrderRouter.post("/stripe", placeOrderStripe);
OrderRouter.post("/verify-stripe", verifyStripe);
OrderRouter.post("/update-status", updateStatus);

// 👇 IMPORTANT: put this BEFORE /:deviceId
OrderRouter.get("/get", getOrders);


// 👇 this should come after
OrderRouter.get("/:deviceId", getOrdersByDevice);

module.exports = OrderRouter;
