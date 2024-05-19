const SubSection = require("../models/subSection");
const Section = require("../models/section");
const {uploadImage} = require("../utils/imageUpload");
const section = require("../models/section");

require("dotenv").config();

exports.createSubSection = async (req,res) => {
    try{
        // fetch data

        const {sectionId , title , description} = req.body;

        // extract file

        const video = req.files.videoFile;

        // validation

        if(!sectionId || !title || !description || !video)
        {
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }

        // upload video to cloudinary

        const uploadDetails = await uploadImage(video,process.env.FOLDER_NAME);

        // create subsection

        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
         }) 

        // update sectio with subsectio courseid

         const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:subSectionDetails._id}},{new:true}).populate("subSection");

        // HW to use Populate for Subsection

        // response

         return res.status(200).json({
            success:true,
            message:"SubSection Created Successfully",
            data:updatedSection,
         })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            message:error.message,
         })
    }
}

exports.updateSubSection = async (req,res) => {
    try{
        const {sectionId , subSectionId , title , description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection)
        {
            return res.status(404).json({
                success:false,
                message:"SubSection not found"
            })
        }

        if(title !== undefined){
            subSection.title = title
        }

        if(description !== undefined)
        {
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video;
            const uploadDetails = await uploadImage(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();
        const updatedsubSection  = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success:true,
            message:"Section Updated Successfully",
            data:updatedsubSection
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"An error occured while updating the section"
        })
    }
}

exports.deleteSubSection = async (req,res) => {
    try{
        const {subSectionId , sectionId} = req.body;
        await Section.findByIdAndUpdate({_id:sectionId},
            {
                $pull:{ // remove the particular conditio from array
                    subSection:subSectionId,
                }
            })

        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"SubSection not found"
            })
        }

        const updatedsubSection  = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success:true,
            message:"SubSection deleted successfully",
            data:updatedsubSection
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"An Error occured while deleting the subsection"
        })
    }
}