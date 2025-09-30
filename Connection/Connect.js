const mongoose= require("mongoose")
const dotenv=require("dotenv")

dotenv.config()
const Connect=async()=>
{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected...")
    } catch (error) {
        console.log("Database Disconnected..")
    }
}
module.exports=Connect;