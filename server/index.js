const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const Contact = require("./routes/Contact")
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");  // to connect backend and front end
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// connect database
database.DBConnect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",     // to handle the requrest coming from frontend
        credentials:true,
    })
)
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))

// cloudinary connect
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/reach", Contact);

// default route
app.get("/",(req,res)=>{
    // res.send(`<h1>Welcome</h1>`);
    return res.json(
        {success:true,
        message:"Your server is up and Running"}
    )
});

app.listen(PORT,(req,res)=>{
    console.log(`App Running Successfully at port : ${PORT}`);
})  