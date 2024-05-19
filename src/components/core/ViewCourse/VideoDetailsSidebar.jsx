import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconButton from "../../common/IconButton"
import { IoIosArrowBack } from "react-icons/io"
import { BsChevronDown } from "react-icons/bs"

const VideoDetailsSidebar = ({setReviewModal}) => {

  const [activeStatus , setActiveStatus] = useState ("")
  const [videoBarActive , setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const { sectionId , subSectionId } = useParams()
  const location = useLocation()

  const {
    courseSectionData , 
    courseEntireData , 
    totalNoOfLectures ,  
    completedLectures
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {

    ;(async() =>{
      if(!courseSectionData.length)
        return;
      const currentSectionIndex = await courseSectionData.findIndex(  
        (data) => data._id === sectionId
      )  // fectching current section

      const currentSubSectionIndex = await courseSectionData?.[currentSectionIndex]?.subSection.findIndex(  
        (data) => data._id === subSectionId
      )// fectching current subsection
      const activeSubSectionId = await courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id  // // fectching current video

      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
      setVideoBarActive(activeSubSectionId)

    })()

  } , [courseSectionData , courseEntireData , location.pathname])

  return (
    <>
      <div className='flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800'>

        {/* for buttons and heading */}
        <div className='mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25'>

          {/* buttons */}
          <div className='flex w-full items-center justify-between'>

            <div onClick={()=>navigate("/dashboard/enrolled-courses")} className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90' title='back'>
              <IoIosArrowBack size={30} />
            </div>

            <div>
              <IconButton text="Add Review" onClick={() => setReviewModal(true)} customClasses="ml-auto"/>
            </div>

          </div>

          {/* heading and titles */}
          <div className='flex flex-col'>
            <p>{courseEntireData?.courseName}</p>
            <p className='text-sm font-semibold text-richblack-500'>{completedLectures?.length} / {totalNoOfLectures}</p>
          </div>

        </div>

        {/* for sections and subsections */}
        <div className='h-[calc(100vh - 5rem)] overflow-y-auto'>
          {
            courseSectionData.map((section , index)=>(
              <div onClick={()=>setActiveStatus(section?._id)} key={index} className='mt-2 cursor-pointer text-sm text-richblack-5'>

                {/* section */}
                <div className='flex flex-row justify-between bg-richblue-600 px-5 py-4'>
                  
                  <div className='w-[70%] font-semibold'>
                    {section?.sectionName}
                  </div>
                  
                  <div className='flex items-center gap-3'>
                    <span className={`${
                      activeStatus === section?.sectionName ? "rotate-0" : "rotate-180"
                    } transition-all duration-500`}>
                      <BsChevronDown/>
                    </span>
                  </div>

                </div>

                {/* subSections */}
                <div>
                  {
                    activeStatus === section?._id && (
                      <div className="transition-[height] duration-500 ease-in-out">
                        {
                          section.subSection.map((topic , index) => (
                            <div className={`flex gap-3 px-5 py-2 ${videoBarActive === topic._id ? "bg-yellow-200 text-richblack-800 font-semibold":"hover:bg-richblack-900"}`} key={index} onClick={()=>{
                              navigate(`/view-Course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`) 
                              setVideoBarActive(topic?._id)
                            }}>
                              <input type='checkbox' checked={completedLectures.includes(topic?._id)} onChange={() => {}}/>
                              <span>{topic.title}</span>
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </div>

              </div>
            ))
          }
        </div>

      </div>
    </>
  )
}

export default VideoDetailsSidebar