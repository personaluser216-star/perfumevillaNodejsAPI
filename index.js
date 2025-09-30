const express=require("express");
const dotenv=require("dotenv");
const Connect = require("./Connection/Connect");
const AdminRouter = require("./Router/AdminRouter");
const cors=require("cors");
const ProductRouter = require("./Router/ProductRouter");
const CartRouter = require("./Router/CartRouter");

const app=express();
Connect()
dotenv.config();
const PORT = process.env.PORT || 4000
app.use(express.json());
app.use(cors({
  origin: "*",  
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use("/admin",AdminRouter);
app.use("/product",ProductRouter);
app.use("/cart",CartRouter);

app.get("/",(req,res)=>
{
    return res.json({success:true,message:"okay"})
})


app.listen(PORT,()=>
{
    console.log(`server started on port ${PORT}`)
})
