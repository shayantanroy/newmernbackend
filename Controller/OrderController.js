import { Order } from "../Models/Ordermodel.js";
import { asyncError } from "../middleware/asyncCathError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto"
import { Payment } from "../Models/Payment.js";



// cashon delivary
export const placeorder=asyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
      } = req.body;
        // (for temporary checking in post man thats why user is string  and string must be 24 hexa char or integer)
        // const user ="65c52b8d36375e63f9884ed7";



        const user=req.user._id;
    
      const orderOptions = {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        user,
      };
    
      await Order.create({...orderOptions});
    
      res.status(201).json({
        success: true,
        message: "Order Placed Successfully via Cash On Delivery",

})
});
export const placeorderOnline=asyncError(async(req,res,next)=>{
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;
  const user=req.user._id;


  const orderOptions={
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  }

  const options={
    amount:Number(totalAmount)*100,
    currency:"INR",

  };
  const order=await instance.orders.create(options);


  res.status(201).json({
    success:true,
    order,
    // this order only crete in razor pay for get payment id,order id,signature for payment verification
    orderOptions,

  })
});


export const paymentveryfication=asyncError(async(req,res,next)=>{


  const{razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderOptions
  }=req.body;

  const body=razorpay_order_id+"|"+razorpay_payment_id;

  const expectedsignature=crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body).digest("hex");


  const isAuthentic=expectedsignature===razorpay_signature;

        if(isAuthentic){
          const payment=await Payment.create({
            razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,

          });

          await Order.create({...orderOptions,
          paidAt:new Date(Date.now()),
        paymentInfo:payment._id});

        res.status(201).json({
          success:true,
          message:`order payment successfull PaymentId: ${payment._id}`
        })

        }else{

return next(new ErrorHandler("Payment failed",400))
        }


});



export const  orderDetails=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name")

    if(!order)return next(new ErrorHandler("Invalid Order Id",404));

    res.status(200).json({
        success:true,
        order,
      
    })

})


// login user orders find
export const getmyOrders=asyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id}).populate("user","name");



    res.status(200).json({
        success:true,
        orders,
        
    });
});


// admin orders
export const adminorders=asyncError(async(req,res,next)=>{
  const orders=await Order.find().populate("user","name");
  Object.keys(orders).reverse();
  // await orders.save();
  res.status(200).json({
    success:true,
    orders,
  })
})





// process order status for admin

export const procssOrderstatus=asyncError(async(req,res,next)=>{
  const order=await Order.findById(req.params.id)


  if(!order)return next(new ErrorHandler("invalid oreder Id",404));

if(order.orderStatus==="Preparing"){
   order.orderStatus="Shipped"
}
else if(order.orderStatus==="Shipped"){
  order.orderStatus="Delivered";
  order.deliveredAt=new Date(Date.now());
}
else if(order.orderStatus==="Delivered"){
  return next(new ErrorHandler("Food Already Delivered",400))
}

await order.save();

res.status(200).json({
  success:true,
  message:"Status Updated Successfully",
})

})
