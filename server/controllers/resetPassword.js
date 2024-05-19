const jwt = require("jsonwebtoken");
const User = require("../models/user")
const mailSender = require("../utils/mailSender");
const { response } = require("express");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
// reset password token
 
exports.resetPasswordToken = async (req,res) => {
    
    try{

        // get email from req body

        const email = req.body.email;

        // check user for email

        const user = await User.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:`Your Email ${email} is Not registered with us`
            })
        }

        // generate token 

        const token = crypto.randomBytes(20).toString("hex");

        // update user by adding token and expiration time

        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+3600000,
            },{new:true});


        // create url

        const url = `http://localhost:3000/update-password/${token}`

        // send mail

        await mailSender(email,"Password Reset Link",`Password Reset : ${url}`);

        return res.json({success:true,
            message:"email sent successfully,Check email and update password"});

    }
    catch(error){
        // return response
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password",
        error
        })
    }

    
}

// reset password

exports.resetPassword = async (req,res) => {
    try{
        // fetch data

        const {password,confirmPassword,token} = req.body;

        // validate

        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password Donot match"
            })
        }

        // get user details from db using token

        const userDetails = await User.findOne({token:token});

        // entry not found

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid"
            })
        }

        // toekn time expired

        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"link expires"
            })
        }

        // hashed password

        const hashedPassword = await bcrypt.hash(password,10);

        // upadate password

        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});

        // return response

        return res.status(200).json({
            success:true,
            message:"Password reset successfull"
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            
            success:false,
            message:"Something went wrong , please try again",
            error
        })
    }

}