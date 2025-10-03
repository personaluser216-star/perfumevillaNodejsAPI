const express=require("express");
const dotenv=require("dotenv");
const Connect = require("./Connection/Connect");
const AdminRouter = require("./Router/AdminRouter");
const cors=require("cors");
const ProductRouter = require("./Router/ProductRouter");
const CartRouter = require("./Router/CartRouter");
const OrderRouter = require("./Router/OrderRouter");

const app=express();

dotenv.config();
const PORT = process.env.PORT || 4000
app.use(express.json());
Connect()
app.use(cors({
  origin: "*",  
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use("/admin",AdminRouter);
app.use("/product",ProductRouter);
app.use("/cart",CartRouter);
app.use("/order",OrderRouter);


app.get("/",(req,res)=>
{
    return res.json({success:true,message:"okay"})
})


app.listen(PORT,()=>
{
    console.log(`server started on port ${PORT}`)
})
