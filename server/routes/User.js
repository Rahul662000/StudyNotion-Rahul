const express = require("express");
const router = express.Router();

// imports the controllers and middleware functions

const {
    signUp,
    logIn,
    changePassword,
    sendOtp
} = require("../controllers/auth");

const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/resetPassword");

const {auth} = require("../middleware/auth");

// Route for login,singup,and authentication

// Authentication Routes

// user login
router.post("/login",logIn);

// user signup
router.post("/signup",signUp);

// changepassword
router.post("/changepassword",auth,changePassword);

// sendOtp
router.post("/sendotp",sendOtp);


// Reset Password

// generating a reset password token
router.post("/reset-password-token",resetPasswordToken);

// resetting user's password after verification
router.post("/reset-password",resetPassword);

module.exports = router;