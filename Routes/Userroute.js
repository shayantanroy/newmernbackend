import express from "express"
import passport from "passport";
import { Adminusers, getAdminStats, logout, myprofile } from "../Controller/UserController.js";
import { Authorisedadmin, isAuthenticated } from "../middleware/auth.js"


const router=express.Router();

router.get("/googlelogin",passport.authenticate("google",
{scope:["profile"]},
));

router.get(
    "/login",
    passport.authenticate("google"), 
    (req,res,next)=>{
      res.send("logged in");
    }
    // {
    //   successRedirect:process.env.FRONTEND_URL,
    // }
    // )
  );

router.get("/me",isAuthenticated,myprofile);
router.get("/admin/users",isAuthenticated,Authorisedadmin,Adminusers);
router.get("/logout",logout);
router.get("/admin/stats",isAuthenticated,Authorisedadmin,getAdminStats)








export default router;