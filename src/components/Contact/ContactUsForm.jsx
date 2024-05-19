import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { contactusEndpoint } from '../../services/APIs';
import countryCode from '../../data/countrycode.json'
import { APIConnector } from "../../services/APIConnector"

const ContactUsForm = () => {
    const [loading,setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful}
    } = useForm();

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset,isSubmitSuccessful]);

    const submitContactForm = async (data) => {
        console.log("Loggin Data" , data)
        try{
            console.log(data)
            setLoading(true)
            const res = await APIConnector("POST",contactusEndpoint.CONTACT_US_API , data)
            // const response = {status:"OK"};
            console.log("Hi")
            console.log(res)
            setLoading(false)
        }
        catch(e){
            console.log("Error" , e.message);
            setLoading(false)
        }
    }


  return (
    <form onSubmit={handleSubmit(submitContactForm)} className='flex flex-col gap-7'>

        <div className='flex gap-5 flex-col lg:flex-row '>

            {/* first */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='firstName' className='lable-style'>First Name:</label>
                <input type='text' name='firstName' id='firstName' placeholder='Enter Your First Name...' 
                className="form-style"
                {...register("firstName",{required:true})}/> {/* if some error error is raised*/}
                {
                    errors.firstName && (
                        <spa className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter Your Name
                        </spa>
                    )
                }
            </div>

            {/* last */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastName' className='lable-style'>Last Name:</label>
                <input type='text' name='lastName' id='lastName' 
                className="form-style"
                placeholder='Enter Your Last Name...' {...register("lastName")}/>
            </div>

        </div>


            {/* email  */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='email' className='lable-style'>
                    Email Address:
                </label>
                <input type='email' name='email' id='email' placeholder='Enter Your Email Address...'
                className="form-style" {...register("email",{required:true})}/>
                {
                    errors.email && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>
                            Please Enter Your Email
                        </span>
                    )
                }
            </div>

            {/* PhoneNumber */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='phoneNo' className='lable-style'>Phone Number:</label>

                <div className='flex flex-row gap-5'>
                    {/* option */}
                    <div className='flex w-[81px] flex-col gap-2'>
                        <select name='dropdown' id='dropdown' className="form-style" {...register("countrycode",{required:true})} >
                            {
                                countryCode.map((element,index) => {
                                    return(
                                        <option key={index} value={element.code}>{element.code} -{element.country}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    

                    {/* phone */}
                    <div className='flex w-full flex-col gap-2'>
                        <input type='number' name='phoneNo' id='phoneNo' placeholder='1234567890' className="form-style" {...register("phoneNo",{
                            required:{value:true,message:"Enter Phone Number"},
                            maxLength:{value:10,message:"Invalid Phone Number"},
                            minLength:{value:8,message:"Invalid Phone Number"}
                        })}/>
                    </div>

                </div>
                {
                    errors.phoneNo && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            {errors.phoneNo.message}
                        </span>
                    )
                }
            </div>

            {/* Message */}
            <div className='flex flex-col'>
                <label htmlFor='message' class='lable-style'>Message:</label>
                <textarea
                    name='message'
                    id='message'
                    cols="30"
                    rows="7"
                    className='form-style'
                    placeholder='Enter Your Message Here..'
                    {...register("message",{required:true})}
                />
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter Your Message
                        </span>
                    )
                }
            </div>

            {/* button */}

            <button 
            disabled={loading} type='submit' className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
            }  disabled:bg-richblack-500 sm:text-[16px] `}>
                Send Message
            </button>

       
    </form>
  )
}

export default ContactUsForm