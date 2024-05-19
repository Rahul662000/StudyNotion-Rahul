import React, { useEffect , useState } from 'react'
import { NavbarLinks } from '../../data/navbar-links'
import { Link, matchPath } from 'react-router-dom'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import { useLocation  } from 'react-router-dom'
import { AiOutlineShoppingCart } from "react-icons/ai";
import {  useSelector } from 'react-redux'
import { APIConnector } from '../../services/APIConnector'
import { catalogData, categories } from '../../services/APIs'
import { IoIosArrowDown } from "react-icons/io";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { ACCOUNT_TYPE } from "../../utils/constants"


const Navbar = () => {

    // Redux

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const {totalItems} = useSelector((state) => state.cart)
    const location = useLocation();
    const [loading , setLoading] = useState(false);

    // API CALL

    const [subLinks , setSubLinks] = useState([]);
    
    useEffect(()=>{
        (async () => {
            setLoading(true)
            try{
                const res = await APIConnector("GET",categories.CATEGORIES_API)
                setSubLinks(res.data.data)
            }
            catch(error){
                console.log("Could Not Fetch Categories" , error)
            }
            setLoading(false)
        })();
    },[])

    

    const matchRoute = (route) => {
        return matchPath({path:route} , location.pathname)
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

            {/* Logo */}
            <Link to="/">
                <img src={Logo} width={160} height={42} loading='lazy'/>
            </Link>

            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((element,index) => (
                            <li key={index}>
                                {
                                    element.title === "Catalog" ? 
                                    (
                                        <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                        matchRoute("/catalog/:catalogName")
                                        ? "text-yellow-25"
                                        : "text-richblack-25"
                                        }`}>

                                            <p>
                                                {element.title}
                                            </p>    
                                            <IoIosArrowDown />

                                            <div className='invisible absolute left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblue-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] translate-x-[-50%] translate-y-[30%] z-50'>

                                            <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 translate-x-[80%] translate-y-[-40%]'>
                                            </div>

                                            {
                                                loading ? (
                                                    <p className='text-center'>Loading...</p>) : subLinks.length ? (
                                                        <>
                                                        {
                                                            subLinks?.filter((subLink) => subLink?.course?.length > 0)?. map((subLink , i) => (
                                                                <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                                    className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50' key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))
                                                        }
                                                        </>
                                                ) : (
                                                    <p className='text-center'>No Course Found</p>
                                                )
                                            }

                                            </div>

                                        </div>
                                    ) 
                                    : 
                                    (
                                        <Link to={element?.path}>    {/* question mark use for if value is undefined or null it will not throw error instead it return undefined */}
                                            <p className={`${matchRoute(element?.path)? "text-yellow-25" :
                                             "text-richblack-25"}`}> 
                                                {element.title}
                                                
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>
            
            {/* Login / SignUp / DashBoard */}

            <div className='gap-x-4 items-center md:flex hidden'>

                {
                    user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className='text-2xl text-richblack-100'/>
                            {
                                totalItems > 0 && (
                                    <span className='absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                        {totalItems}
                                    </span>
                                )
                            }

                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/login" >
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md pointer'>
                                 Log in  
                            </button>
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/Signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md pointer'>
                                 Sign Up  
                            </button>
                        </Link>
                    )
                }

                {
                    token !== null && <ProfileDropDown />
                    
                }
                
            </div>



        </div>
    </div>
  )
}

export default Navbar