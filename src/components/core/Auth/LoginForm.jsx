import { Link,useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { login } from "../../../services/operations/authAPI"


const LoginForm = () => {
    
  const navigate = useNavigate()
  
  const dispatch = useDispatch()
  
  const [formData, setFormData] = useState({
      email: "",
      password: "",
  })
  
  const [showPassword, setShowPassword] = useState(false)
  
  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }



  return (
      <form onSubmit={submitHandler} className='mt-6 flex w-full flex-col gap-y-4'>

        <label className='w-full' htmlFor='email'>
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <label className='relative' htmlFor='password'>
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Password: <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px]  pr-12 text-richblack-5"/>
            <span onClick={()=> setShowPassword((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer z-[10]'>
                    {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#afb2bf'/>) : (<AiOutlineEye fontSize={24} fill='#afb2bf'/>)}
            </span>
          <Link to="/forgot-password"><p className='text-xs mt-1 text-blue-100 max-w-max ml-auto'>Forgot Password?</p></Link>
        </label>

        <button type="submit" className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
                Sign In
        </button>
      </form>
  )
}

export default LoginForm