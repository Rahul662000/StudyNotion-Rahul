import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import  Modal  from "../../../../common/Modal"
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import SubSectionModal from './SubSectionModal';
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    const [addSubSeciton , setAddSubSection] = useState(null);
    const [viewSubSeciton , setViewSubSection] = useState(null);
    const [editSubSeciton , setEditSubSection] = useState(null);

    const [confirmationModal , setConfirmationModal] = useState(null);


    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId : course._id,},
            token
        )

        if(result)
        {
            dispatch(setCourse(result))
        }
        setConfirmationModal(null)
    }

    

    const handleDeleteSubSection = async (subSectionId , sectionId) => {
        const result = await deleteSubSection({
            subSectionId ,
            sectionId ,},
            token
        )
        if(result)
        {
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result:section )
            const updatedCourse = {...course,courseContent : updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
    }

  return (
    <div>

        <div className='rounded-lg bg-richblack-700 p-6 px-8' id="nestedViewContainer">
            {
                course?.courseContent?.map((section) => (
                    <details key={section._id} open>

                        <summary className='flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2'>
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu className='text-2xl text-richblack-50'/>
                                <p className='font-semibold text-richblack-50'>
                                    {
                                        section.sectionName
                                    }
                                </p>
                            </div>
                            <div className='flex items-center gap-x-3'>
                                
                                <button onClick={() =>  handleChangeEditSectionName(section._id,section.sectionName)}>
                                    <MdEdit className='text-xl text-richblack-300'/>
                                </button>

                                <button onClick={()=>
                                    setConfirmationModal({
                                        text1:"Delete this section",
                                        text2:"All the lectures in this section will be deleted",
                                        btn1text:"Delete",
                                        btn2text:"Cancel",
                                        btn1Handler:()=>handleDeleteSection(section._id),
                                        btn2Handler:()=>setConfirmationModal(null),
                                    })
                                }>
                                    <MdDelete className='text-xl text-richblack-300'/>
                                </button>

                                {/* hori line */}

                                <span className='font-medium text-richblack-300'>
                                    |
                                </span>

                                {/* Dropdown arrow */}
                                <IoMdArrowDropdown className='text-xl text-richblack-300'/>

                            </div>
                        </summary>

                        <div className='px-6 pb-4'>
                            {
                                section?.subSection?.map((data) => (
                                    <div key={data?._id} onClick={()=>setViewSubSection(data)} className='flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2'>

                                        <div className='flex items-center gap-x-3 py-2'>
                                            <RxDropdownMenu className='text-2xl text-richblack-50'/>
                                            <p className='font-semibold text-richblack-50'>
                                            {
                                                data.title 
                                            }
                                            </p>
                                        </div>

                                        <div className='flex items-center gap-x-3' onClick={(e)=>e.stopPropagation()}>

                                        <button onClick={() => setEditSubSection({
                                                ...data,sectionId:section?._id
                                            })}>
                                                 <MdEdit className='text-xl text-richblack-300'/>
                                            </button>

                                            <button onClick={() => 
                                                setConfirmationModal({
                                                    text1:"Delete this sub section",
                                                    text2:"Current Lecture will be deleted",
                                                    btn1text:"Delete",
                                                    btn2text:"Cancel",
                                                    btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                                    btn2Handler:()=>setConfirmationModal(null),
                                                })

                                            }>

                                                <MdDelete className='text-xl text-richblack-300'/>

                                            </button>

                                        </div>

                                    </div>
                                ))
                            }

                            <button onClick={()=>setAddSubSection(section._id)} className='mt-3 flex items-center gap-x-1 text-yellow-50'>
                                <FaPlus/>
                                <p>Add Lecture</p>
                            </button>

                        </div>
                        
                    </details>
                ))
            }
        </div>

         {
            addSubSeciton ? (<SubSectionModal modalData={addSubSeciton} setModalData={setAddSubSection} add={true}/>)
            : viewSubSeciton ? (<SubSectionModal modalData={viewSubSeciton} setModalData={setViewSubSection} view={true}/>) 
            : editSubSeciton ? (<SubSectionModal modalData={editSubSeciton} setModalData={setEditSubSection} edit={true}/>) 
            : (<div></div>)
         }

         {
            confirmationModal ? (
                <Modal modalData={confirmationModal}/>
            ) : (
                <div></div>
            )
         }

    </div>
  )
}

export default NestedView
