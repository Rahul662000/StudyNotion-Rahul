const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otp = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(), 
        expires:5*60*100, // The document will be automatically deleted after 5 minutes of its creation time
    }
});

// a fuinction to send email

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email From StudyNotion",emailTemplate(otp));
        console.log("Email Sent Successfully",mailResponse);
    }
    catch(error){
        console.log("Error Occured While Sending Mail",error);
        throw error;
    }
} 

// pre middleware

// Define a pre-save hook to send email after the document has been saved

otp.pre("save",async function (next){
    // Only send an email when a new document is created

    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})


module.exports = mongoose.model("OTP",otp);