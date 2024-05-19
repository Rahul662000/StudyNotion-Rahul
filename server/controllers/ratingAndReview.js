const ratingAndReviews = require("../models/ratingAndReviews");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");

// create rating

exports.createRating = async (req,res) => {
    try{

        // getUserId

        const userId = req.user.id;

        // get Data from req body

        const {rating,review,courseId} = req.body;

        // check if user is enrolled

        const courseDetails = await Course.findOne({_id:courseId,enrolledStudents:{$elemMatch:{$eq:userId} } });

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            })
        }

        // check if already reviewed the course

        const alreadyReviewed = await ratingAndReviews.findOne({
            user:userId,course:courseId
        });

        if(alreadyReviewed)
        {
            return res.status(403).json({
                success:false,
                message:"Course is already reviews by the user"
            })
        }
        
        // create rating

        const ratingReview = await ratingAndReviews.create({rating,review,course:courseId,user:userId})

        // update course with rating and review

        await Course.findByIdAndUpdate({_id:courseId}, {
            $push: {
              ratingAndReview: ratingReview._id,
            },
          },{new:true})
          await courseDetails.save()

        // return response

        return res.status(200).json({
            success:true,
            message:"Rating And Review Successfully Created",
            ratingReview
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get average rating

exports.getAverageRating = async (req,res) => {
    try{
        // getcourseId

        const courseId = req.body.courseId;

        // calculate average rating

        const result = await ratingAndReviews.aggregate([
            {
                $match:{course:new mongoose.Types.ObjectId(courseId)}
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                    
                }
            }
        ])

        // return rating

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        // if no rating exist

        return res.status(200).json({
            success:true,
            message:"Average rating is 0 no rating given",
            averageRating: 0
        })        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get All rating and reviews

exports.getAllRating = async (req,res) => {
    try{

        const allRating = await ratingAndReviews.find({})
                                                        .sort({rating:"desc"})
                                                        .populate({path:"user",select:"firstName lastName email image",})
                                                        .populate({path:"course",select:"courseName"})
                                                        .exec();

        return res.status(200).json({
            success:true,
            data:allRating
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}