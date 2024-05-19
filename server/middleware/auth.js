const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

// auth

exports.auth = async (req,res,next) => {
    try{

        // exrtact token

        const token = 
                    req.cookies.token 
                    || req.body.token ||
                    req.header("Authorisation").replace("Bearer ", "");

        // token missing

        if(!token)
        {
            return res.status(400).json({
                success:false,
                message:" Token Missing"
            });
        }

        // console.log(req.user)
        // verifying token

        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            // console.log("Decode : ",decode);
            req.user = decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Error while validating the Token"
        })
    }
}

// Student

exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected route for Students only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Account type not fectch try again"
        })
    }
}

// Instrutor

exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected route for Instructors only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Account type not fectch try again"
        })
    }
}

// Admin

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected route for Admins only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Account type not fectch try again"
        })
    }
}