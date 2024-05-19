const {instance} = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail"); // remain to create template
const { default: mongoose } = require("mongoose");
// const { current } = require("@reduxjs/toolkit");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const crypto = require("crypto");
const courseProgress = require("../models/courseProgress");

// initiate the razorpay order
exports.capturePayment = async(req,res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0)
    {
        return res.json({success:false,message:"Please provide Course Id"})
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id)
            if(!course){
                return res.status(400).json({success:false,message:"Could not find the course"})
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.enrolledStudents.includes(uid)){
                return res.status(400).json({success:false,message:"User Already Purchased"})
            }

            totalAmount += course.price

        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,message:e.message })
        }
    }

    // options

    const options = {
        amount : totalAmount * 100,
        currency : "INR",
        receipt:Math.random(Date.now()).toString()
    }

    // creating order

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            data:paymentResponse
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            data:"Could Not initiate order"
        })
    }

}

// Verify payment
exports.verifyPayment = async(req , res) => {

    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature ;

    const courses = req.body.courses;
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(400).json({success:false,message:"Payment Failed"})
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
                                .createHmac("sha256" , process.env.KEY_SECRET_RAZORPAY)
                                .update(body.toString())
                                .digest("hex")

    console.log("Expected token" , expectedSignature)
    console.log("Razorpay signature" , razorpay_signature)

    if(expectedSignature === razorpay_signature){
        // enroll student

        await enrollStudents(courses , userId , res)

        // return response
        return res.status(200).json({success:true , message:"Payment Verified"})
    }

    return res.status(400).json({success:false , message:"Payment failed"})
}

const enrollStudents = async(courses , userId , res) => {
    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide data for Courses or userId"
        })
    }

    for(const courseId of courses){
        try{
            // find the course and enroll the student initiate
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId} , {
                $push:{enrolledStudents:userId} 
            } , { new : true })

            if(!enrolledCourse){
                return res.status(500).json({success:false , message:"Course not found"})
            }

            console.log("Updated course: ", enrolledCourse)


            // courseProgess
            const courseProgess = await courseProgress.create({
                courseId:courseId , userId:userId , completedVideos:[]
            })

            // find the student and add the course to their enrolled course list

            const enrolledStudent = await User.findByIdAndUpdate(userId , {$push:{
                course :  courseId, courseProgress:courseProgess._id
                }},{ new : true }
            )

            // send mail to Student
            const emailResposne = await mailSender(
                enrollStudents.email , `Successfully Enrolled into ${enrolledCourse.courseName}`, courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)
            )
            console.log("Email Sent Successfully")
        }
        catch(error){
            console.log(error)
            return res.status(500).json({success:false,message:error.message})
        }
    }
}

exports.sendPaymentSuccessfullEmail = async(req,res) => {
    const {orderId , paymentId , amount} = req.body;
    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({success:false , message:"Please Proveide all the fields"})
    }

    try{

        // find student
        const enrolledStudent = await User.findById(userId)

        await mailSender(enrolledStudent.email , `Payment Received` , paymentSuccessEmail(`${enrolledStudent.firstName}` , amount/100 , orderId , paymentId))


    }catch(error){
        console.log(error)
        console.log("Error in sending mail")
        return res.status(500).json({success:false , message:"Could not send Email"})
    }

}


// capture the payment and initiate the razorpay order
// exports.capturePayment = async (req,res) => {
//         // get course and user ID

//         const {courseId} = req.body;
//         const userId = req.user.id;

//         // validation
//         // valid course id and valid course details

//         if(!courseId)
//         {
//             return res.status(400).json({
//                 success:false,
//                 message:"Please Provide correct Course ID"
//             })
//         }

//         let course;
//         try{
//             course = await Course.findById(courseId);
//             if(!course){
//                 return res.status(400).json({
//                     success:false,
//                     message:"Could not find the course"
//                 })
//             }

//             // user already paid?

//             const uid = new mongoose.Types.ObjectId(userId);        // convert userId(string) in objectId
//             if(course.enrolledStudents.includes(uid))       
//             {
//                 return res.status(200).json({
//                     success:false,
//                     message:"Student is Already Enrolled"
//                 }) 
//             }

//         }
//         catch(error){
//             return res.status(500).json({
//                 success:false,
//                 message:"Something went wrong",
//                 error:error.message
//             }) 
//         }

//         // order create

//         const amount = course.price;
//         const currency = "INR";
        
//         const options = {
//             amount : amount * 100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 courseId : courseId,
//                 userId,
//             }
//         };

//         try{
//             // initiate the payment using razorpay

//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);

//             // return response

//             return res.status(200).json({
//                 success:true,
//                 message:"Payment Success full",
//                 courseName : course.courseName,
//                 courseDescription : course.courseDescription,
//                 thumbnail : course.thumbnail,
//                 orderId : paymentResponse.id,
//                 curreny:paymentResponse.currency,
//                 amount : paymentResponse.amount, 
//             });

//         }
//         catch(error){
//             return res.status(500).json({
//                 success:false,
//                 message:"Could not initiate order"
//             })
//         }
// };

// Verify signature of Razorpay

// exports.verifySignature = async (req,res) => {

//     // server secure key
//     const webHookSecret = "123456789"; 

//     // key recieved from razorpay
//     const signature = req.header["x-razorpay-signature"];

//     // encrypting server secure key
//     const shasum = crypto.createHmac("SHA256",webHookSecret);

//     // converting Hmac object to string
//     shasum.update(JSON.stringify(req.body));

//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is Authorized");
//         const{courseId,userId} = req.body.payload.payment.entity.notes;

//         try{
//             // fullfill the action
//             // find the course and enrolled the student in it

//             const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},
//                 {
//                     $push:{enrolledStudents:userId}
//                 },{new:true});

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course Not Found"
//                 });
//             }

//             console.log(enrolledCourse);

//             //  find the student and the update the enrolled course in it 

//             const enrolledStudent = await User.findOneAndUpdate({_id:userId},
//                 {
//                     $push:{course:courseId}
//                 },{new:true});

//             console.log(enrolledStudent);

//             if(!enrolledStudent){
//                     return res.status(500).json({
//                         success:false,
//                         message:"Student Not Found"
//                     });
//                 }

//             // send mail with confirmation mail

//             const emailResposne = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulation, From StudyNotion",
//                 "Congratulation to our onbaorded into new codehelp course",
//             );

//                 console.log(emailResposne);
//                 return res.status(200).json({
//                     success:true,
//                     message:"signature verified and course added"
//                 })

//         }
//         catch(error){
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }

//     else{
//         return res.status(400).json({success:false,message:"Invalid Request"})
//     }

// };
