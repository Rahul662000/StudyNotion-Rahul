import React from 'react'
import * as Icons from "react-icons/vsc"   // for fetching all icons
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { resetCourseState } from "../../../slices/courseSlice"

const SideBarLink = ({link , iconName}) => {

    const Icon = Icons[iconName];
    const location = useLocation();  // used here to get the location to highlight  child
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({path:route} , location.pathname);
        // to check the current path and the clicked path to highlight
    } 

  return (
        <NavLink to={link.path} onClick={() => dispatch(resetCourseState())} className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
        } transition-all duration-200`}>
            
            <span className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute(link.path)?"opacity-100":"opacity-0"}`}></span>

            <div className='flex items-center gap-x-2 '>
                <Icon className="text-lg"/>
                <span>{link.name}</span>
            </div>



        </NavLink>

  )
}

export default SideBarLink

