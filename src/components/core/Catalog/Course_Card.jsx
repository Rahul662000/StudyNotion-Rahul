import React, { useEffect, useState } from 'react'
import GetAvgRating from '../../../utils/avgRating'
import RatingStars from '../../common/RatingStars'
import { Link } from 'react-router-dom'

const Course_Card = ({course , height}) => {

  const [averageReviewCound , setAverageReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReview);
    setAverageReviewCount(count);
  },[course])


  return (
    <div>

      <Link to={`/courses/${course._id}`}>

        <div>
           <div className="rounded-lg">
            <img src={course.thumbnail} alt='Course Thumbnail' className={`${height} w-full rounded-xl object-cover`}/>
           </div>
           <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
            <div className='flex items-center gap-2'>
              <span className="text-yellow-5">{averageReviewCound || 0}</span>
              <RatingStars Review_Count={averageReviewCound}/> 
              <span className="text-richblack-400">{course?.ratingAndReview?.length} Rating</span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
           </div>
        </div>

      </Link>

    </div>
  )
}

export default Course_Card