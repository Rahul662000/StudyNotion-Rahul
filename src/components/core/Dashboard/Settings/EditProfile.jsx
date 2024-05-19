import React from 'react'
import { updateProfile } from '../../../../services/operations/settingAPI'
import { useForm } from 'react-hook-form'
import { useSelector , useDispatch } from 'react-redux'
import IconButton from "../../../common/IconButton"
import { useNavigate } from "react-router-dom"

const EditProfile = () => {

  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) =>{
      try{
        dispatch(updateProfile(token,data))
      }
      catch(error){
        console.log("Error Message - " , error.message)
      }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>

      {/* Profile Information */}

        <div className='my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>

          <h2 className='text-lg font-semibold text-richblack-5'>Profile Information</h2>

          {/* Name */}
          <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label className="lable-style" htmlFor='firstName'>First Name</label>
              <input type='text' name='firstName' id='firstName' placeholder='Enter First Name' {...register("firstName",{required:true})}
              defaultValue={user?.firstName}
              className='form-style'/>
              {errors.firstName && (
                <span className='-mt-1 text-[12px] text-yellow-100'>Please Enter your first Name</span>
              )}
            </div>

            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastName' className='lable-style'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  id='lastName'
                  placeholder='Enter Last Name'
                  {...register("lastName",{required:true})}
                  defaultValue={user?.lastName}
                  className='form-style'
                />
                {
                  errors.lastName && (
                    <span className='-mt-1 text-[12px] text-yellow-100'>
                      Please Enter your last name.
                    </span>
                  )
                }
            </div>
          </div>

          {/* Date of Birth & Gender */}
          <div className='flex flex-col gap-5 lg:flex-row' >

            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='dateOfBirth' className='lable-style'>
                Date of Birth
              </label>
              <input
                type='date'
                name='dateOfBirth'
                id='dateOfBirth'
                className='form-style'
                {...register("dateOfBirth",
                {
                  required:{
                    value:true,
                    message:"Please Enter your Date of Birth"
                  },
                  max:{
                    value:new Date().toISOString().split("T")[0],
                    message:"Date of Birth Cannot be in Future."
                  }
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {
                errors.dateOfBirth && (
                  <span className='-mt-1 text-[12px] text-yellow-100'>
                    {errors.dateOfBirth.message}
                  </span>
                )
              }
            </div>

            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='gender' className='lable-style'>
                Gender
              </label>
              <select type="text"
                name='gender'
                id='gender'
                className='form-style'
                {
                  ...register("gender",{
                    required:true
                  })
                }
                defaultValue={user?.additionalDetails?.gender}
              >
                {
                  genders.map((ele,i) => {
                    return (
                      <option key={i} value={ele}>
                        {ele}
                      </option>
                    )
                  })
                }
              </select>
              {
                errors.gender && (
                  <span className='-mt-1 text-[12px] text-yellow-100'>
                    Please Choose your gender.
                  </span>
                )
              }

            </div>

          </div>

          {/* Contact and about */}
          <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='contactNumber' className='lable-style'>
                  Contact Number
                </label>
                <input
                  type='tel'
                  name='contactNumber'
                  id='contactNumber'
                  placeholder='Enter Contact Numbers'
                  className='form-style'
                  {
                    ...register("contactNumber",{
                      required:{
                        value: true,
                        message: "Please enter your Contact Numer"
                      },
                      maxLength:{
                        value:12,
                        message:"Invalid Contact Number"
                      },
                      minLength: { value: 10, message: "Invalid Contact Number" },
                    })
                  }
                  defaultValue={user?.additionalDetails?.contactNumber}
                />
                {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactNumber.message}
                </span>
                )}
              </div>
              <div className='flex flex-col gap-2 lg:w-[48%]'>
                  <label className='lable-style'
                  htmlFor='about'>
                    About
                  </label>
                  <input
                  type="text"
                  name="about"
                  id="about"
                  placeholder="Enter Bio Details"
                  className="form-style"
                  {...register("about", { required: true })}
                  defaultValue={user?.additionalDetails?.about}
                  />
                  {errors.about && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your About.
                  </span>
                  )}
              </div>
          </div>
        </div>

         {/* Button */}
         <div className='flex justify-end gap-2'>

          <button className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50' onClick={()=>{
            navigate("/dashboard/my-profile")
          }}>
            Cancel
          </button>

          <IconButton type="submit" text="Save"/>
         </div>

      </form>
    </>
  )
}

export default EditProfile