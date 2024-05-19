import {toast} from "react-hot-toast"
import {setLoading , setToken} from "../../slices/authSlice"
import {resetCart} from "../../slices/cartSlice"
import {setUser} from "../../slices/profileSlice"
import {APIConnector} from "../APIConnector"
import {endpoints} from "../APIs" 

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = endpoints

export function sendOtp(email , navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await APIConnector("POST" , SENDOTP_API , {
                email,
                checkUserPresent: true,
            })
            console.log("SENT OTP API RESPONSE.........." , response)
            console.log(response.data.success)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        }
        catch(error){
            console.log("SENTOTP API ERROR...........",error)
            console.log(error.response.data)
            toast.error("Could not send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function signUp(accountType , firstName , lastName , email , password , confirmPassword , otp , navigate){
    return async (dispatch) => {
        const toastId = toast.loading("LOADING...")
        dispatch(setLoading(true))
        try{
            const response = await APIConnector("POST",SIGNUP_API , {
                accountType,firstName,lastName,email,password,confirmPassword,otp,
            })

            console.log("SIGNUP API RESPONSE........." , response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Signup Successfully")
            navigate("/login")
        }
        catch(error){
            console.log("SIGNUP API ERROR......",error)
            toast.error("SignUp Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email , password , navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading....")
        dispatch(setLoading(true))
        try{
            const response = await APIConnector("POST",LOGIN_API,{
                email,password,
            })

            console.log("LOGIN API RESPONSE...... " , response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Login Successfull")
            dispatch(setToken(response.data.token))

            console.log(response.data)

            const userImage = response.data?.existUser?.image ? response.data.existUser.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.existUser.firstName} ${response.data.existUser.lastName}`

            dispatch(setUser({...response.data.existUser , image:userImage}))

            localStorage.setItem("user",JSON.stringify(response.data.existUser))
            localStorage.setItem("token",JSON.stringify(response.data.token))
           
            navigate("/dashboard/my-profile")
        }
        catch (error) {
            console.error("LOGIN API ERROR......", error);
            toast.error(`Login Failed: ${error.message || "An unexpected error occurred"}`);
          }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function getPasswordResetToken(email , setEmailSent){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await APIConnector("POST",RESETPASSTOKEN_API,{email})

            console.log("RESET PASSWORD TOKEN RESPOSNE...",response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Reset Email Sent Successfully")
            setEmailSent(true)
        }
        catch(error){
            console.log("RESETPASSTOKEN ERROR...",error)
            toast.error("Failed To Send Reset Email")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function resetPassword(password,confirmPassword,token,navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await APIConnector("POST",RESETPASSWORD_API,{
                password,confirmPassword,token,
            })

            console.log("RESET PASSWORD RESPONSE....",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        }
        catch(error){
            console.log("RESETPASSWORD ERROR...",error)
            toast.error("Failed to reset Password")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function logout(navigate){
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}