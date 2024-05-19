const express = require("express");
const router = express.Router();

const {
    createCourse,
    getCourseDetails,
    allCourses,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/course");

const {
    getAllCateogries,
    createCategory,
    categoryPageDetails
} = require("../controllers/categories");

const {
    createSection,
    updateSections,
    deleteSection
} = require("../controllers/section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/subSection");

const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/ratingAndReview");

const {auth,isInstructor,isStudent,isAdmin} = require("../middleware/auth");

const { updateCourseProgress } = require("../controllers/courseProgress")

// Course Routes

// Course only be created by instructors
router.post("/createcourse",auth,isInstructor,createCourse);
router.post("/addsection",auth,isInstructor,createSection);
router.post("/updatesection",auth,isInstructor,updateSections);
router.post("/deletesection",auth,isInstructor,deleteSection);
router.post("/addSubSection",auth,isInstructor,createSubSection);
router.post("/updatesubsection",auth,isInstructor,updateSubSection);
router.post("/deletesubsection",auth,isInstructor,deleteSubSection);
// get all registered course
router.get("/getallcourses",allCourses);
// get details of specified course
router.post("/getcoursedetails",getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
// courseProgress
router.post("/updatecourseProgress", auth , isStudent , updateCourseProgress)

// category routes created by admin only

router.post("/createcategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",getAllCateogries);
router.post("/getcategorypagedetails",categoryPageDetails);

// rating and reviews

router.post("/createrating",auth,isStudent,createRating);
router.get("/getaveragerating",getAverageRating);
router.get("/getReviews",getAllRating);

module.exports = router;