
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../Models/usermodel.js"
import { asyncError } from "../middleware/asyncCathError.js";
import { Order } from "../Models/Ordermodel.js";
// google autentication
export const ConnectPassword=()=>{
    passport.use(new GoogleStrategy(
        {

           
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:process.env.GOOGLE_CLIENT_URL,
        },async (accessToken,refreshToken,profile,done)=>{
                const user=await User.findOne({
                    googleId:profile.id,
                })
                if(!user){
                    const newuser=await User.create({
                        googleId:profile.id,
                        name:profile.displayName,
                        photo:profile.photos[0].value,
                    })
                    return done(null,newuser);
                }else{
                    return done(null,user);
                }
            }
        ));
       
        passport.serializeUser((user,done)=>{
            done(null,user.id);

        })
        passport.deserializeUser(async(id,done)=>{
            const user=await User.findById(id);
            done(null,user);
        })
    }



    // my profile
    export const myprofile=asyncError(async(req,res,next)=>{


        res.status(200).json({
            success:true,
            // req.user automatic get from google dont need to define
            user:req.user,
        })

        })

        export const logout=asyncError(async(req,res,next)=>{
      
            req.session.destroy((err) => {
                if (err) return next(err);
                res.clearCookie("connect.sid",
                {
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    httpOnly: process.env.NODE_ENV === "development" ? false : true,
                    sameSite: process.env.NODE_ENV === "development" ? false : "none",
                });



                res.status(200).json({
                  message: "Logged Out",
                });
              });

        })

    export const Adminusers=asyncError(async(req,res,next)=>{
        const users=await User.find();
        res.status(200).json({
            success: true,
            users,
    })
});
//  dash board stats
export const getAdminStats = asyncError(async (req, res, next) => {
    const usersCount = await User.countDocuments();
  
    const orders = await Order.find({});
  
    const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
    const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
    const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");
  
    let totalIncome = 0;
  
    orders.forEach((i) => {
      totalIncome += i.totalAmount;
    });
  
    res.status(200).json({
      success: true,
      usersCount,
      ordersCount: {
        total: orders.length,
        preparing: preparingOrders.length,
        shipped: shippedOrders.length,
        delivered: deliveredOrders.length,
      },
      totalIncome,
    });
  });
    

