import express from "express"
import { Authorisedadmin, isAuthenticated } from "../middleware/auth.js";
import { adminorders, getmyOrders, orderDetails, paymentveryfication, placeorder, placeorderOnline, procssOrderstatus } from "../Controller/OrderController.js";




const router=express.Router();
router.post("/createorder",isAuthenticated,placeorder);
router.post("/placeorderonline",isAuthenticated,placeorderOnline);
router.post("/paymentverification",isAuthenticated,paymentveryfication);
router.get("/myorders",isAuthenticated,getmyOrders);
router.get("/order/:id",isAuthenticated,orderDetails);
router.get("/admin/orders",isAuthenticated,Authorisedadmin,adminorders);
router.get("/admin/order/:id",isAuthenticated,Authorisedadmin,procssOrderstatus);
export default router
