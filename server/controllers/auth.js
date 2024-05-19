const user = require("../models/user");
const OTP = require("../models/otp");
const otpGen = require("otp-generator");
const Profile = require("../models/profile");
const bcrypt = require('../app.js').bcrypt;
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");  // remain file to create for this

require("dotenv").config();

// Send Otp

exports.sendOtp = async (req,res) => {

    try{
        // fetch email from req body
        const {email} = req.body;

        // check if user already exsists

        const checkedUser = await user.findOne({email});
        if(checkedUser){
            return  res.status(401).json({
                    success:false,
                    message:"User Already Registered"
                })
        }

        // generate OTP

        var otp = otpGen.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        console.log("Generated OTP " , otp);

        // check unique or not

        const result = await OTP.findOne({ otp: otp })
        console.log("Result is Generate OTP Func")
        console.log("OTP", otp)
        console.log("Result", result)
        while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
        })
        }

        const otpPayload = {email,otp};

        // create an entry in DB

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP BODY : " , otpBody);

        //  return response

        res.status(200).json({
            success:true,
            message:"OTP send successfully",
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message  
        })
    }
};

// SignUp

exports.signUp = async (req,res) => {
    try{
        // data fetch

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // data validation

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        // both password verification

        if(password !== confirmPassword){
            return res.staus(400).json({
                success:false,
                message:"Password & Confirm Password Do not Match"
            })
        }

        // check user already exssit ofr not

        const existingUser = await user.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success:false,
                message:"User Already exists"
            });
        }

        // find most recent otp for the user

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1); 
        console.log(recentOtp);

        // validate

        if(recentOtp.length == 0)
        {
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp != recentOtp[0].otp)
        {
            return res.status(400).json({
                success:false,
                message:"OTP invalid"
            })
        }

        // hashed password

        const hashedPassword = await bcrypt.hash(password , 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true)

        // creatre entry in DB

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        }) 

        const userDB = await user.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            contactNumber,
            accountType:accountType,
            additionalDetails:profileDetails._id, // doubt
            approved: approved,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // return response

        return res.status(200).json({
            success:true,
            message:"User is Registered",
            user
        })
        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registred please try again"
        })
    }
}

// Login

exports.logIn = async (req,res) =>{
    try{
        // get data

        const {email,password} = req.body;

        // validate data

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }

        // find user existance

        const existUser = await user.findOne({email}).populate("additionalDetails");

        if(!existUser){
            return res.status(401).json({
                success:false,
                message:"User is Not Registred,please Sign Up"
            })
        }

        // password match and // generate token

        if(await bcrypt.compare(password , existUser.password))
        {

            const payload = {
                email:existUser.email,
                id:existUser._id,
                accountType:existUser.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,
            {
                expiresIn : "24h",
            })
            existUser.token = token;
            existUser.password = undefined;

            // create cookie

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
                httpOnly:true
            }


            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Logged In success",
                token,
                existUser
            })

        } 
        
        else{
            return res.status(400).json({
                success:false,
                message:"Wrong Credentials"
            })
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Loggin Failue Try Again"
        })
    }
}

// Change Password 

exports.changePassword = async (req,res) => {
    try{
         // get data from request body

        const userDetails = await user.findById(req.user.id);

        // get oldPassword,newPassword,cnfmnewPassword

        const { oldPassword, newPassword } = req.body;

        // validate 

        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // if (newPassword !== confirmNewPassword) {
        //     // If new password and confirm new password do not match, return a 400 (Bad Request) error
        //     return res.status(400).json({
        //         success: false,
        //         message: "The password and confirm password does not match",
        //     });
        // }

        // update in dB

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await user.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // mail send password updates

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // return response

        return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });

    }
    catch(error){
       // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        }); 
    }
}
