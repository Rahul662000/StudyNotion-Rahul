const express = require("express");
const router = express.Router();
const {auth, isStudent, isInstructor} = require("../middleware/auth");

const {
    deleteProfile,
    updateProfile,
    userAllDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
} = require("../controllers/profile");

// profile routers

// Delete User Account
router.delete("/deleteprofile",auth,isStudent,deleteProfile);
router.put("/updateprofile",auth,updateProfile);
router.get("/getuserdetails",auth,userAllDetails);
// enrolled courses
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);
router.get("/instructor" , auth , isInstructor ,instructorDashboard)

module.exports = router;

