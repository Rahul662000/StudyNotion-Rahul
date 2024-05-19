import React from 'react'
import instructorimg from '../../../assets/Images/Instructor.png'
import HighLightText from './HighLightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row gap-20 items-center'>

            {/* Left section */}
            <div className='w-[50%]'>
                <img src={instructorimg} alt='Imstructor img' className='shadow-white'/>
            </div>

            {/* Right section */}
            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an <HighLightText text={'instructor'}/>
                </div>
                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                <div className='w-fit'>
                    <CTAButton active={true} linkto={'/signup'}>
                        <div className='flex flex-row gap-2 items-center w-fit'>
                            Start Teaching Today 
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                </div>
                
            </div>

        </div> 
    </div>
  )
}

export default InstructorSection