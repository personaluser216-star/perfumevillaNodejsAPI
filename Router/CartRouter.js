const express = require("express");


const { addToCart, updateCart, getUserCart } = require("../Controller/CartController");


const CartRouter=express.Router()
{
    CartRouter.post("/add", addToCart);


CartRouter.post("/update", updateCart);

CartRouter.post("/get", getUserCart);
}

module.exports = CartRouter;
