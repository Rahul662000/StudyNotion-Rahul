const Section = require("../models/section");
const Course = require("../models/course");

exports.createSection = async (req,res) => {
    try{

        // data fetch

        const {sectionName , courseId} = req.body;

        // data validation

        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"All Field are mandatory check once"
            })
        }

        // create section

        const newSection = await Section.create({
            sectionName
        }) 

        // updation course with section ObjectId

        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                {
                    $push:{courseContent:newSection._id},
                },
                {new:true}
            )

        // populate section & Sucsection HW

        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        // response 

        return res.status(200).json({
            success:true,
            message:"Section Created successfully",
            updatedCourse
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong Unable to Create section"
        })
    }
}

exports.updateSections = async (req,res) => {
    try{
        
        // fetch Data

        const {sectionName , sectionId , courseId} = req.body;

        // validation of data

        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:"All Field are mandatory check once"
            })
        }

        // update data

        const updatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});  

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        // response

        return res.status(200).json({
            success:true,
            message: updatedSection,
            data: course ,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong Unable to update section"
        })
    }
}

exports.deleteSection = async (req,res) => {
    try{

        // fetch data -- assuming that we are sending id in params

        const {sectionId , courseId} = req.body;

        // find by id and delete

        await Section.findByIdAndDelete(sectionId);

        // TODO[will do in testing] : to be need to delete the entry from course Schema

        // code delete also from course
        await Course.updateOne(
            { _id: courseId },
            { $pull: { courseContent: sectionId } }
        );

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        // response

        return res.status(200).json({
            success:true,
            message:"Deleted Successfully",
            data:course
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong Unable to delete section"
        })
    }
}