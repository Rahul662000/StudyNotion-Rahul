const express = require("express");
const router = express.Router();

const {capturePayment,verifyPayment,sendPaymentSuccessfullEmail} = require("../controllers/payments");
const {auth,isInstructor,isStudent,isAdmin} = require("../middleware/auth");
router.post("/capturePayment",auth,isStudent,capturePayment);
router.post("/verifyPayment",auth , isStudent , verifyPayment);
router.post(
  "/sendPaymentSuccessfullEmail",
  auth,
  isStudent,
  sendPaymentSuccessfullEmail
)

module.exports = router;
