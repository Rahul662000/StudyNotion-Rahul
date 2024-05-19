import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineimage from "../../../assets/Images/TimelineImage.png"

const timeLine = [
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully comitted to the success company"
    },
    {
        Logo:Logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority"
    },
    {
        Logo:Logo3,
        heading:"Flexibility",
        Description:"The ability to switch is an important skills"
    },
    {
        Logo:Logo4,
        heading:"Solve the Problem",
        Description:"Code your way to a solution"
    }
];

const TimeLineSection = () => {
  return (
    <div>
        <div className='flex gap-15 items-center'>

        {/* left */}

        <div className='flex flex-col w-[45%] gap-10'>
            {
                timeLine.map ((element,index) => {
                    return (
                        <div className='flex gap-6' key={index}>

                            {/* left */}
                            <div className='w-[50px] h-[50px] bg-white flex items-center rounded-full'>
                                <img src={element.Logo} className='mx-auto'/>
                            </div>

                            {/* Right */}
                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.Description}</p>
                            </div>

                        </div>
                    )
                })
            }
        </div>

        {/* Right */}

        <div className='relative shadow-blue-200'>
            <img src={timelineimage} alt='timelineimage' className='shadow-white object-cover h-fit'/>

            <div className='absolute bg-caribbeangreen-700 flex text-white uppercase py-6 left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                <div className='flex items-center gap-5 border-r border-caribbeangreen-300 px-7'>
                    <h2 className='text-3xl font-bold'>10</h2>
                    <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>
                <div className='flex items-center gap-5 px-7'>
                    <h2 className='text-3xl font-bold'>250</h2>
                    <p className='text-caribbeangreen-300 text-sm'>Types of Courses</p>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default TimeLineSection