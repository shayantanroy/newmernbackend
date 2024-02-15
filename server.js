import app from "./app.js";
import { connectDB } from "./config/database.js";
import razorpay from "razorpay"


connectDB();

export const instance=new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});


app.get("/",(req,res,next)=>{
    res.send("<h1>working</h1>");
})
app.listen(process.env.PORT,()=>
console.log(`server is working on PORT:${process.env.PORT}, IN ${process.env.NODE_ENV} MODE`)
);


// MONGO_URI= mongodb://localhost:27017/BTechPizzaWala
