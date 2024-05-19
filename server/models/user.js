const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        trim:true,
    },
    lastName : {
        type:String,
        required:true,
        trim:true,
    },
    email : {
        type:String,
        required:true,
        trim:true,
    },
    password : {
        type:String,
        required:true
    },
    accountType : {
        type:String,
        enum : ["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails : {
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"Profile"
    },
    course : [{
        type:mongoose.Schema.ObjectId,
        ref:"Course"
    }],
    image : {
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    courseProgress : [
         {
            type:mongoose.Schema.ObjectId,
            ref:"CourseProgress"
         }
    ],
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },

    },    // Add timestamps for when the document is created and last modified

    {timestamps:true}

);

module.exports = mongoose.model("User",userSchema);