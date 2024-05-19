const User = require("../models/user");
const Profile = require("../models/profile");
const {uploadImage} = require("../utils/imageUpload");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/courseProgress");
const { default: mongoose } = require("mongoose");
const Course = require("../models/course")


require("dotenv").config();

exports.updateProfile = async (req,res) => {
    try{
        // get data

        const {firstName="",lastName="",dateOfBirth="",about="",contactNumber="",gender=""} = req.body;

        // validation of data

        if(!contactNumber || !gender)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are Mandatory"
            })
        }

        // user id

        const id = req.user.id;

        // find profile

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await  Profile.findById(profileId);

        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
        })

        await user.save()

        // update profile

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save();

        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

        // return response

        return res.status(200).json({
            success:true,
            message:"Profile Updated successfully",
            updatedUserDetails
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update profile",
            error:error.message,
        })
    }
}

exports.deleteProfile = async (req,res) =>{
    try{
        // fetch data

        const userId = req.user.id;

        // verify id

        const userDetails = await User.findById({_id:userId}); 

        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }

        // delete profile

        await Profile.findByIdAndDelete({_id:new mongoose.Types.ObjectId(userDetails.additionalDetails)});

        // delete user

        await User.findByIdAndDelete({_id:userId});

        // delete also from enrolled students HW


        for (const courseId of userDetails.course) {
            await Course.findByIdAndUpdate(
              courseId,
              { $pull: { enrolledStudents: id } },
              { new: true }
            )
          }
        // response

        return res.status(200).json({
            success:true,
            message:"Account Deleted Successfully"
        })

        await CourseProgress.deleteMany({ userId:id })

    }
    catch(error){
        return res.status(200).json({
            success:false,
            message:"Something went wrong,Unable to Delete profile"
        });
    }
}

exports.userAllDetails = async (req,res) => {
    try{
        
        // get id

        const id = req.user.id;

        // find user details

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
            data:userDetails
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.updateDisplayPicture = async (req,res) => {
    try{
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImage(displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000)
        const updateProfile = await User.findByIdAndUpdate({_id:userId},
            {image:image.secure_url},
            {new:true})

        res.send({
            success:true,
            message:"Image Updated successfully",
            data:updateProfile
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getEnrolledCourses = async (req,res) => {
    try{
        const userId = req.user.id;
        let userDetails = await User.findOne({_id:userId}).populate({path:"course" , populate:{
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }}).exec()
        userDetails = userDetails.toObject()

        console.log("userDetails : ",userDetails )

        var SubsectionLength = 0
        for (var i = 0; i < userDetails.course.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.course[i].courseContent.length; j++) {
              totalDurationInSeconds += userDetails.course[i].courseContent[
                j
              ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
              userDetails.course[i].totalDuration = convertSecondsToDuration(
                totalDurationInSeconds
              )
              SubsectionLength +=
                userDetails.course[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
              courseId: userDetails.course[i]._id,
              userId: userId,
            })

            console.log("course Progess : " , courseProgressCount)

            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
              userDetails.course[i].progressPercentage = 100
            } else {
              // To make it up to 2 decimal point
              const multiplier = Math.pow(10, 2)
              userDetails.course[i].progressPercentage =
                Math.round(
                  (courseProgressCount / SubsectionLength) * 100 * multiplier
                ) / multiplier
            }

          }

        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:`Could not find user with id: ${userDetails}`
            })
        }
        return res.status(200).json({
            success:true,
            data: userDetails.course
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.instructorDashboard = async(req,res) => {
     try{

        const courseDetails = await Course.find({instructor:req.user.id})

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.enrolledStudents.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // create an new object with the additional fields
            const courseDataWithStats = {
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats 

        })

        res.status(200).json({
            course:courseData
        })

     }catch(error){
        console.log(error)
        res.status(500).json({
            message:"Internal server error"
        })
     }
}