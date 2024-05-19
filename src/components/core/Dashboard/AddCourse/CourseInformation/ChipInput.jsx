import React , { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MdClose } from "react-icons/md"

const ChipInput = ({label,name,placeholder,register,errors,setValue,getValues}) => {

    const { editCourse , course } = useSelector((state)=> state.course)

    // state for managing chip
    const [chips , setChips] = useState([])

    useEffect(()=>{
        if(editCourse)
        {
            setChips(course?.tag)
        }
        register(name , {required:true , validate: (value) => value.length > 0})
    },[])

    useEffect(()=>{
        setValue(name,chips)
    },[chips])

    // delete tag
    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((_,index) => index !==chipIndex)
        setChips(newChips)
    }

    // handle input tag
    const handleKeyDown = (event) => {
        // check enter or , pressed
        if(event.key === "Enter" || event.key === ",")
        {
            event.preventDefault()
            // get the input field value
            const chipValue = event.target.value.trim()
            // check for existence
            if(chipValue && !chips.includes(chipValue))
            {
                const newChips = [...chips,chipValue]
                setChips(newChips)
                event.target.value = ""
            }

        }
    }


  return (
    <div className='flex flex-col sapce-y-2'>

        {/* Chip label */}
        <label htmlFor={name} className='text-sm text-richblack-5'>
            {label}<sup className='text-pink-200'>*</sup>
        </label>

        {/* Input chip and showing chip */}
        <div className='flex w-full flex-wrap gap-y-2'>
            {/* chip map for deleting and showing chip*/}
            {
                chips.map((chip,index) => (
                    <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                        {/* showing chip */}
                        {chip}
                        {/* delete chip */}
                        <button type='button' className='ml-2 focus:outline-none' onClick={()=>handleDeleteChip(index)}>
                            <MdClose className='text-sm'/>
                        </button>
                    </div>  
                ))
            }

            {/* input chip */}
            <input
                id={name}
                name={name}
                type='text'
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                className='w-full form-style'
            />
        </div>

        {/* Error */}
        {
            errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    {label} is required
                </span>
            )
        }

    </div>
  )
}

export default ChipInput