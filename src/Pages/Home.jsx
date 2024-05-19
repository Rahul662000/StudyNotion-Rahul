import React from 'react'
import { Link } from 'react-router-dom';
import {FaArrowRight} from "react-icons/fa";
import HighLightText from '../components/core/Homepage/HighLightText';
import CTAButton from '../components/core/Homepage/CTAButton';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import TimeLineSection from '../components/core/Homepage/TimeLineSection';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';
import InstructorSection from '../components/core/Homepage/InstructorSection'
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/Homepage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  return (
    <div>

        {/* Section 1 */}

        <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent mb-32'>

            {/* Route you to signup API  */}
            <Link to="/signup">
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex items-center gap-3 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with  
                <HighLightText text={" Coding Skills"}/>  {/* creating component to highlight text */}
            </div>

            {/* Paragraph */}
            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            {/* Button */}
            <div className='flex gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
            </div>

            {/* Video */}
            <div className='mx-3 my-12 shadow-blue-200 '>
                <video muted loop autoPlay>
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>

            {/* CodeSection 1 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row"} 
                    heading={
                                <div className='text-4xl font-semibold'>
                                    Unlock your <HighLightText text={"coding potential"}/> with our online courses.
                                </div>
                            } 
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabtn1 = {
                        {
                            btnText:"Try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2 = {
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><ahref="two/">Two</a><a href="three/">Three</a>\n</nav>`}
                    codeColor={"text-yellow-25"}/>

            </div>

            {/* CodeSection 2 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row-reverse"} 
                    heading={
                                <div className='text-4xl font-semibold'>
                                    Start <HighLightText text={`coding \n in seconds`}/>
                                </div>
                            } 
                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                    ctabtn1 = {
                        {
                            btnText:"Continue Lesson",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2 = {
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><ahref="two/">Two</a><a href="three/">Three</a>\n</nav>`}
                    codeColor={"text-yellow-25"}/>

            </div>

            {/* Cards */}
            <ExploreMore/>

        </div>

        {/* Section 2 */}

        <div className='bg-pure-greys-5 text-richblack-700'>

            <div className='homepage_bg h-[310px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto '>
                    <div className='h-[130px]'></div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex gap-2 items-center'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div> 
                        </CTAButton>
                        <CTAButton active={false} linkto={"/login"}>
                            <div className='flex gap-2 items-center'>
                                Learn More
                            </div> 
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                <div className='flex gap-5 mb-10 mt-[90px]'>
                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the skills you need for a <HighLightText text={"job that is in demand"}/>
                    </div>
                    <div className='flex flex-col gap-10 w-[45%]  items-start'>
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/login"}>Learn More</CTAButton>
                    </div>
                </div>

                <TimeLineSection/>

                <LearningLanguageSection/>
            </div>

            

        </div>

        {/* Section 3 */}
        
        <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-richblack-5'>

            <InstructorSection/>

            <h2 className='text-center text-4xl font-semibold mt-8'>Reviews from other learners</h2>

            {/* Review slider */}

            <ReviewSlider/>

        </div>

        {/* Footer */}
        <Footer/>


    </div>
  )
}

export default Home