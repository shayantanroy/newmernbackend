import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { ConnectPassword } from "./Controller/UserController.js"
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from"cors";
// import { errorMiddleware } from "./middleware/errormiddleware.js";
const app=express();


dotenv.config({
    path:"./config/config.env"
})



// for middleware middileware (express-session)

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
      },
})
);
app.use(cookieParser());
app.use(express.json());

app.use(urlencoded({
    extended:true,
}))


// after session create(^)

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

// app.enable("trust proxy"); important for deployment
app.enable("trust proxy");


app.use(cors({
    // credentials must be be true other wise could not get cookie
    credentials:true,
    origin:process.env.FRONTENED_URL,
    methods:["GET","POST","PUT","DELETE"]
}))



ConnectPassword();

// import routes
import userroute from "./Routes/Userroute.js";
import Orderroute from "./Routes/orderroute.js";
import { errorMiddleware } from "./middleware/errormiddleware.js";


app.use("/api/v1",userroute);
app.use("/api/v1",Orderroute);




// using error middleware
app.use(errorMiddleware);

export default app;
