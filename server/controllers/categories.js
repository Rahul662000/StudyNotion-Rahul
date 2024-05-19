const Category = require("../models/Category");
const { Mongoose } = require("mongoose");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


// create tag handler function

exports.createCategory = async (req,res) => {
    try{

        // fetch data

        const {name,description} = req.body;

        // validation

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // create entry in DB

        const categoryDetail = await Category.create({name:name,description:description});

        // return response

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            mesage:error.mesage
        })
    }
}

// getAll tags

exports.getAllCateogries = async (req,res) => {
    try{

        const AllCateogries = await Category.find({});

        return res.status(200).json({
            success:true,
            message:"All tag return successfully",
            data:AllCateogries
        })
 
    }
    catch(error){
        return res.status(500).json({
            success:false,
            mesage:error.mesage
        })
    }
}

// category page Details

exports.categoryPageDetails = async (req,res) => {
    try{
        // get category id

        const {categoryId} = req.body;

        // get course for specified category id

         const selectedCategory = await Category.findById(categoryId)
                                        .populate({
                                            path:"course",
                                            match: {status:"Published"},
                                            populate:"ratingAndReview"
                                        })
                                        .exec();

        // validation

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found"
            });
        }

        // Handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
        }

        // get course for differnet categories

        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
          })

        console.log("Cateogry except selected " , categoriesExceptSelected)
        console.log(categoryId)
        let differentCategories = await Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id).populate({
            path:"course",
            match:{status:"Published"}
        }).exec();

        console.log("Different categories " , differentCategories)

        console.log((categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id))

        // get top 10 selling course

        // HW -- top selling

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
            path: "course",
            match: { status: "Published" },
            populate: {
                path: "instructor",
        },
        })
        .exec()
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
        // console.log("mostSellingCourses COURSE", mostSellingCourses)

        // return response

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
                mostSellingCourses
            }
        });

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "Internal server error",
            error:error.message
        });
    }
}