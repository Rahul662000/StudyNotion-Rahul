import React from 'react'
import HighLightText from './HighLightText'
import knowprogress from '../../../assets/Images/Know_your_progress.png'
import compareothers from '../../../assets/Images/Compare_with_others.png'
import planyour from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
        <div className='flex flex-col gap-6 items-center'>

            <div className='text-4xl font-semibold text-center'>
                Your swiss knife for <HighLightText text={"learning any language"}/>
            </div>

            <div className='text-center text-richblack-600 mx-auto text-base mt-3 font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex items-center justify-center mt-5 mx-auto'>
                <img src={knowprogress} alt='knowyourprogess' className='object-contain -mr-32 ml-auto'/>
                <img src={compareothers} alt='comparewithothers' className='object-contain'/>
                <img src={planyour} alt='planyourlesson' className='object-contain -ml-36'/>
            </div>

            <div className='w-fit'>
                <CTAButton active={true} linkto={'/login'}>
                    Learn More
                </CTAButton>
            </div>

        </div>
    </div>
  )
}

export default LearningLanguageSection