import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import Tab from "../../common/Tab"
import {useDispatch} from "react-redux"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { sendOtp } from "../../../services/operations/authAPI"
import {setSignupData} from "../../../slices/authSlice"

const SignupForm = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData , setFormData] = useState({
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      confirmPassword:"", 
  });

  const [showPassword,setShowPassword] = useState(false);
  const [showPassword1,setShowPassword1] = useState(false);
  
  // student or instructor   
  const [accountType,setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const { firstName,lastName,email,password,confirmPassword } = formData

  function changeHandler(event){
      setFormData((prev) => ({
          ...prev,
          [event.target.name] : event.target.value
      }))
  }

  function submitHandler(e){
      e.preventDefault();
      if(password !== confirmPassword)
      {
          toast.error("Password didn't Match");
          return;
      }

      const signupData = {
        ...formData,accountType
      }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    console.log(email)
    dispatch(sendOtp(email,navigate))

    // reset
    setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)

  }   

//   data to apss to tab component

  const tabData = [
    {
        id:1,
        tabName : "Student",
        type: ACCOUNT_TYPE.STUDENT
    },
    {
        id:1,
        tabName : "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR
    }
  ]


return (
  <div className='flex flex-col w-full gap-y-4 mt-6'>

        {/* Tab */}

        <Tab tabData={tabData} field={accountType} setField={setAccountType}/>

      {/* Student Instructor tab */}

      <form onSubmit={submitHandler} className="flex w-full flex-col gap-y-4">

          {/* First Name and Last Name Div */}

          <div className='flex gap-x-4'>
              <label className='w-full'>
                  <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] opacity-60'>
                    First Name: <sup className='text-pink-200'>*</sup>
                    </p>
                  <input className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5" required type='text' name='firstName' onChange={changeHandler} placeholder='Enter First Name...' value={firstName}
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                  />
              </label>

              <label className='w-full'>
                  <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Last Name: <sup className='text-pink-200'>*</sup></p>
                  <input className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5" required type='text' name='lastName' onChange={changeHandler} placeholder='Enter Last Name...' value={lastName}/>
              </label>
          </div>

          {/* Email */}

          <div>
              <label className='w-full'>
                  <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Email: <sup className='text-pink-200'>*</sup></p>
                  <input className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5" required type='email' name='email' onChange={changeHandler} placeholder='Enter Email Address...' value={email}
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                  />
              </label>
          </div>

          {/* Create Password and Confirm Password */}

          <div className="flex gap-x-4">
              <label className='relative'>
                  <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Create Password: <sup className='text-pink-200'>*</sup></p>
                  <input className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5" style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }} required type={showPassword ? ('text') : ('password')} name='password' onChange={changeHandler} placeholder='Enter Password...' value={password}/>
                  <span onClick={()=> setShowPassword((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer'>
                      {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#afb2bf'/>) : (<AiOutlineEye fontSize={24} fill='#afb2bf'/>)}
                  </span>
              </label>

              <label className='relative'>
                  <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Confirm Password: <sup className='text-pink-200'>*</sup></p>
                  <input className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5" required type={showPassword1 ? ('text') : ('password')} name='confirmPassword' onChange={changeHandler} placeholder='Enter Password...' value={confirmPassword}

                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                  />
                  <span onClick={()=> setShowPassword1((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer'>
                      {showPassword1 ? (<AiOutlineEyeInvisible fontSize={24} fill='#afb2bf'/>) : (<AiOutlineEye fontSize={24} fill='#afb2bf'/>)}
                  </span>
              </label>

          </div>

          <button type="submit" className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
              <p>Create Account</p>
          </button>

      </form>

  </div>
)
}

export default SignupForm