import React from 'react'
import HighLightText from '../Homepage/HighLightText'
import CTAButton from '../../../components/core/Homepage/CTAButton'
const LearningGridData = [
    {
        order : -1 ,
        heading:  'World-Class Learning for',
        highlight : 'Anyone, Anywhere',
        description : 'Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.',
        Btntext : 'Learn More',
        BtnLink : '/'
    },
    {
        order : 1 ,
        heading:  'Curriculum Based on Industry Needs',
        description : 'Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.',
    },
    {
        order : 2 ,
        heading:  'Our Learning Methods',
        description : 'The learning process uses the namely online and offline.',
    },
    {
        order : 3 ,
        heading:  'Certification',
        description : 'You will get a certificate that can be used as a certification during job hunting.',
    },
    {
        order : 4 ,
        heading:  'Rating "Auto-grading"',
        description : 'You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.',
    },
    {
        order : 5 ,
        heading:  'Ready to Work',
        description : 'Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.',
    }
]

const LearningGrid = () => {
  return (
    <div className='grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12'>
        {
            LearningGridData.map((card,index) => {
                return(
                    <div key={index} className={`${index===0 && "xl:col-span-2 xl:h-[294px]"}
                    ${
                        card.order % 2 === 1 ? "bg-richblack-700 h-[294px]" : card.order % 2 === 0 ? "bg-richblack-800 h-[294px]" : "bg-transparent"  
                    }
                    ${
                        card.order === 3 && "xl:col-start-2"
                    }

                    `}>
                    {
                        card.order < 0 ? (
                            <div className='xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0'>
                                <h1 className='text-4xl font-semibold'>{card.heading}<HighLightText text={card.highlight}/></h1>
                                <p className='text-richblack-300 font-medium'>{card.description}</p>
                                <div className='w-fit mt-2'>
                                    <CTAButton active={true} linkto={card.BtnLink}>{card.Btntext}</CTAButton>
                                </div>

                            </div>
                        ) : (
                            <div className='p-8 flex flex-col gap-8'>
                                <h1 className='text-richblack-5 text-lg'>
                                    {card.heading}
                                </h1>
                                <p className='text-richblack-300 font-medium'>
                                    {card.description}
                                </p>
                            </div>
                        )
                    }
                    </div>
                )
            })
        }
    </div>
  )
}

export default LearningGrid