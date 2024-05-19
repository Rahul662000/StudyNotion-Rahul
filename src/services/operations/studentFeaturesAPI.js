import {toast} from "react-hot-toast"
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import {resetCart} from '../../slices/cartSlice'
import {setPaymentLoading} from '../../slices/courseSlice'
import { APIConnector } from "../APIConnector"
import { catalogData, studentEndpoints } from "../APIs"

// require("dotenv").config();

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load Razorpay SDK from CDN

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src;
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function BuyCourse(token , courses , userDetails , navigate , dispatch){
    const toastId = toast.loading("Loading...")
    try{
        // load script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to Load")
            return
        }

        // initiate the order 

        const orderRes = await APIConnector("post" , COURSE_PAYMENT_API , {courses} , {
            Authorisation : `Bearer ${token}`,
        })

        if(!orderRes.data.success){
            throw new Error(orderRes.data.data)
        }

        console.log("OrderResponse" , orderRes)
        
        // creating options
        const options = {
            key:process.env.KEY_ID_RAZORPAY,
            currency:orderRes.data.data.currency,
            amount:`${orderRes.data.data.amount}`,
            order_id:orderRes.data.data.id,
            name:"StudyNotion",
            description:"Thank you for purchasing the course",
            image:rzpLogo,
            prefill:{
                name : `${userDetails.firstName}`,
                email : userDetails.firstName,
            },
            handler: function(response){
                // send successfull mail
                sendPaymentSuccessfullEmail(response , orderRes.data.data.amount , token)
                
                // Verify payment
                verifyPayment({...response,courses} , token , navigate , dispatch)
            }
        }

        console.log("Payment Options : " , options)

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("payment.failed" , function(response){
            toast.error("Oops , payment failed")
            console.log(response.error)
        })

    }catch(error){
        console.log("Payment API ERROR ......" , error)
        toast.error("Could not process payment")
    }

    toast.dismiss(toastId )
}

// To send mail
async function sendPaymentSuccessfullEmail(response , amount , token){
    try{

        await APIConnector("post" ,  SEND_PAYMENT_SUCCESS_EMAIL_API , {orderId:response.razorpay_order_id , paymentId:response.razorpay_payment_id , amount} , {
            Authorisation : `Bearer ${token}`
        })

    }catch(error){
        console.log("Payment Success Email Error")
    }
}

// Verify Payment
async function verifyPayment(bodyData , token , navigate , dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    try{

        console.log(token)

        const response = await APIConnector("post" , COURSE_VERIFY_API , bodyData , {
            Authorisation : `Bearer ${token}`,
        })

        // console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Payment Successfull...")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())

    }catch(error){
        console.log("Payment Verify Error..." , error)
        toast.error("Could not Verify Payment")
    }

    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}