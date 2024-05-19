const CourseProgress = require("../models/courseProgress")
const SubSection = require("../models/subSection")

exports.updateCourseProgress = async( req , res ) =>{

    const { courseId , subSectionId } = req.body
    const userId = req.user.id

    try{

        // check for valid subsection
        const subSection = await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json(
                {
                    error:"Invalid SubSecion"
                }
            )
        }

        // check for old  entry
        let courseProgress = await CourseProgress.findOne({
            courseId : courseId,
            userId : userId
        })

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course Progress can not exist"
            })
        }

        else{

            // check for already completed
            if(courseProgress.completedVideos.includes(subSectionId))
            {
                return res.status(400).json({
                    error:"SubSection Already Completed"
                })
            }

            // not completed
            courseProgress.completedVideos.push(subSectionId)

        }

        await courseProgress.save()

        return res.status(200).json({
            success:true,
            message:"Video Completed"
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }
}